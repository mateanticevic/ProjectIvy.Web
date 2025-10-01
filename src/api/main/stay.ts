import * as api from '../config';
import { components } from 'types/ivy-types';

type StayBinding = components['schemas']['StayBinding'];

const post = (stay: StayBinding) => api.post('stay', stay);

const stay = {
    post,
};

export default stay;
