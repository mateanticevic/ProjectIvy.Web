import * as api from '../config';

export function get(filters) {
    return api.get("todo", filters);
}

export function post(todo) {
    return api.post("todo", todo);
}

export function postDone(id) {
    return api.post(`todo/${id}/done`);
}
