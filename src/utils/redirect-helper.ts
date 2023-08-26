import _ from 'lodash';

export const redirectToAuth = () => window.location = `${import.meta.env.AUTH_URL}/connect/authorize?client_id=${import.meta.env.OAUTH_CLIENT_ID}&scope=openid%20userid&response_type=id_token%20token&redirect_uri=${encodeURIComponent(import.meta.env.APP_URL)}&nonce=${_.uniqueId()}`;