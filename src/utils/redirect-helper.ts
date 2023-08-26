import _ from 'lodash';

export const redirectToAuth = () => window.location = `${import.meta.env.VITE_AUTH_URL}/connect/authorize?client_id=${import.meta.env.VITE_OAUTH_CLIENT_ID}&scope=openid%20userid&response_type=id_token%20token&redirect_uri=${encodeURIComponent(import.meta.env.VITE_APP_URL)}&nonce=${_.uniqueId()}`;