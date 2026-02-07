import * as api from '../config';

import { components, paths } from 'types/ivy-types';

type WorkDay = components['schemas']['WorkDay'];
type GetWorkDayQuery = paths['/WorkDay']['get']['parameters']['query'];

const get = (filters?: GetWorkDayQuery): Promise<WorkDay[]> => api.get('workday', filters) as Promise<WorkDay[]>;

const workDay = {
    get,
};

export default workDay;
