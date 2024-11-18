import * as api from '../config';

import { components } from 'types/ivy-types';

type WorkDay = components['schemas']['WorkDay'];

const get = (filters) => api.get('workday', filters) as Promise<WorkDay[]>;

const workDay = {
    get,
};

export default workDay;
