export const getAuthRedirectUri = (callback: string | null) => {
    if (callback === null) {
        return import.meta.env.VITE_APP_URL;
    }
    const redirectUri = new URL(import.meta.env.VITE_APP_URL);
    redirectUri.searchParams.set('callback', callback);
    return redirectUri.toString();
};

export const getAuthCallback = (callback: string | null) => {
    if (callback?.startsWith('/') && !callback.startsWith('//')) {
        const target = new URL(callback, window.location.origin);
        if (target.origin === window.location.origin) {
            return `${target.pathname}${target.search}${target.hash}`;
        }
    }
    return '/';
};

export const redirectToLogin = () => {
    const callback = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const parameters = new URLSearchParams({
        client_id: 'web',
        redirect_uri: getAuthRedirectUri(callback),
        response_type: 'code',
        scope: 'openid',
    });
    window.location.assign(`${import.meta.env.VITE_AUTH_URL}/realms/ivy/protocol/openid-connect/auth?${parameters}`);
};
