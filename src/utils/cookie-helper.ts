import { jwtDecode } from "jwt-decode";
import { Feature, Identity } from 'types/users';

export const getCookieValue = (name: string) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);

export const getIdentity = () => {
    const cookie = getCookieValue('AccessToken');
    const identity = cookie ? jwtDecode<Identity>(cookie) : null;

    if (identity) {
        return {
            ...identity,
            pif: [Feature.Beer, Feature.Calls, Feature.Finance, Feature.Tracking, Feature.Movies, Feature.Travel, Feature.Cars]
        }
    }

    return null;
};
