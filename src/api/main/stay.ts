import * as api from '../config';
import { components } from 'types/ivy-types';

type StayBinding = components['schemas']['StayBinding'];

const post = (stay: StayBinding) => api.post('stay', stay);

const put = (id: string, stay: StayBinding) => api.put(`stay/${id}`, stay);

const stay = {
    post,
    put,
};

export default stay;
