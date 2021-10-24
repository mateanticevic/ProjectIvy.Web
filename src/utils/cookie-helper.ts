import jwt_decode from 'jwt-decode';
import { Identity } from 'types/users';

export const getCookieValue = (name: string) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);

export const getIdentity = () => {
    const cookie = getCookieValue('IdToken');
    return cookie ? jwt_decode<Identity>(cookie) : null;
};
