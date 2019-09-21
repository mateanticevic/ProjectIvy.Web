import * as api from '../config';
import { User } from 'types/users';

export function get(): Promise<User> {
    return api.get("user");
}