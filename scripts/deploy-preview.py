"""Update the preview stack's image tag, then request a Komodo deployment."""
import json
import os
import re
import urllib.error
import urllib.request


def main():
    required = ['KOMODO_URL', 'KOMODO_API_KEY', 'KOMODO_API_SECRET',
                'KOMODO_PREVIEW_STACK', 'IMAGE_TAG']
    for key in required:
        if not os.environ.get(key) or os.environ[key].startswith('$('):
            raise SystemExit(f'Configure Azure pipeline variable {key}.')
    base = os.environ['KOMODO_URL'].rstrip('/')
    if not base.startswith('https://'):
        raise SystemExit('KOMODO_URL must use HTTPS.')

    def api(path, params):
        request = urllib.request.Request(
            base + path, data=json.dumps(params).encode(),
            headers={'Content-Type': 'application/json',
                     'x-api-key': os.environ['KOMODO_API_KEY'],
                     'x-api-secret': os.environ['KOMODO_API_SECRET']},
            method='POST')
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            raise SystemExit(f'Komodo API request failed: HTTP {error.code}') from None
        except urllib.error.URLError:
            raise SystemExit('Komodo API connection failed.') from None

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
