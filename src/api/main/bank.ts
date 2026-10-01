import * as api from '../config';
import { components, paths } from 'types/ivy-types';
import { PagedList } from 'types/common';

type Bank = components['schemas']['Bank'];
type GetBankQuery = paths['/Bank']['get']['parameters']['query'];

const get = (filters?: GetBankQuery): Promise<PagedList<Bank>> => api.get('bank', filters);

const bank = {
    get,
};

export default bank;
