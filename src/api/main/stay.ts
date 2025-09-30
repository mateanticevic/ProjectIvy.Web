import * as api from '../config';
import { components } from 'types/ivy-types';

type StayBinding = components['schemas']['StayBinding'];

const post = (date: string, stay: StayBinding) => api.post(`stay/${date}`, stay);

const stay = {
    post,
};

export default stay;
