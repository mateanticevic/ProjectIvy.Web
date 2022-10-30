import _ from 'lodash';

export const redirectToAuth = () => window.location = `${process.env.AUTH_URL}/connect/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&scope=openid%20userid&response_type=id_token%20token&redirect_uri=${encodeURIComponent(process.env.APP_URL)}&nonce=${_.uniqueId()}`;