import * as api from '../config';

export function get() {
    return api.get("card?isActive=true");
}