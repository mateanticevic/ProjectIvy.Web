"""Update the preview stack's image tag, then request a Komodo deployment."""
import http.client
import json
import os
import re
import time
import urllib.error
import urllib.request


def log_http_error(error, secrets):
    def safe(value):
        for secret in secrets:
            value = value.replace(secret, '[redacted]')
            value = value.replace(json.dumps(secret)[1:-1], '[redacted]')
        # Keep untrusted response text on one line and escape Azure logging commands.
        return json.dumps(value[:1024]).replace('#', r'\u0023')

    if error.headers:
        for header in ('Content-Type', 'Server', 'CF-Ray', 'X-Request-ID'):
            value = error.headers.get(header)
            if value:
                print(f'Komodo response {header}: {safe(value)}', flush=True)

    try:
        with error:
            body = error.read(1025)
    except (OSError, http.client.HTTPException):
        print('Could not read the Komodo error response body.', flush=True)
    else:
        if len(body) > 1024:
            print('Komodo error response body exceeds 1024 bytes.', flush=True)
        elif body:
            detail = safe(body.decode(errors='replace'))
            print(f'Komodo error response body: {detail}', flush=True)


def main():
    required = ['KOMODO_URL', 'KOMODO_API_KEY', 'KOMODO_API_SECRET',
                'KOMODO_PREVIEW_STACK', 'IMAGE_TAG']
    for key in required:
        if not os.environ.get(key) or os.environ[key].startswith('$('):
            raise SystemExit(f'Configure Azure pipeline variable {key}.')
    base = os.environ['KOMODO_URL'].rstrip('/')
    if not base.startswith('https://'):
        raise SystemExit('KOMODO_URL must use HTTPS.')
    api_key = os.environ['KOMODO_API_KEY']
    api_secret = os.environ['KOMODO_API_SECRET']

    def api(path, params):
        request = urllib.request.Request(
            base + path, data=json.dumps(params).encode(),
            headers={'Content-Type': 'application/json',
                     'x-api-key': api_key,
                     'x-api-secret': api_secret},
            method='POST')
        print(f'Komodo POST {path}', flush=True)
        started = time.monotonic()

        def response_status(response, status):
            redirect = ' after redirect' if response.geturl() != request.full_url else ''
            return f'Komodo POST {path} returned HTTP {status}{redirect} in {time.monotonic() - started:.2f}s'

        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                print(response_status(response, response.status), flush=True)
                return json.load(response)
        except urllib.error.HTTPError as error:
            print(response_status(error, error.code), flush=True)
            log_http_error(error, (api_key, api_secret))
            raise SystemExit(f'Komodo POST {path} failed: HTTP {error.code}') from None
        except urllib.error.URLError as error:
            raise SystemExit(f'Komodo POST {path} connection failed ({type(error.reason).__name__}).') from None
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise SystemExit(f'Komodo POST {path} returned an invalid JSON response.') from None

    stack = api('/read/GetStack', {'stack': os.environ['KOMODO_PREVIEW_STACK']})
    environment = stack['config'].get('environment', '')
    # Require an explicit placeholder to avoid modifying the wrong image/config.
    pattern = r'(?m)^IVY_IMAGE_TAG=[^\r\n]*$'
    if len(re.findall(pattern, environment)) != 1:
        raise SystemExit('Preview stack environment must contain exactly one IVY_IMAGE_TAG=value line.')
    environment = re.sub(pattern, lambda _: 'IVY_IMAGE_TAG=' + os.environ['IMAGE_TAG'], environment)
    stack_id = stack['_id']['$oid']
    api('/write/UpdateStack', {'id': stack_id, 'config': {'environment': environment}})
    api('/execute/DeployStack', {'stack': stack_id})
    print('Komodo accepted the preview stack deployment request.')


if __name__ == '__main__':
    main()
