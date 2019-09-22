import * as api from '../config';

function get(filters) {
    return api.get("todo", filters);
}

function post(todo) {
    return api.post("todo", todo);
}

function postDone(id) {
    return api.post(`todo/${id}/done`);
}

const todo= {
    get,
    post,
    postDone
}

export default todo;
