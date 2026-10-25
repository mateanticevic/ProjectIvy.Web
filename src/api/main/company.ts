import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type CompanyPagedView = components['schemas']['CompanyPagedView'];
type CompanyQuery = paths['/Company']['get']['parameters']['query'];

const get = (filters?: CompanyQuery): Promise<CompanyPagedView> => api.get('company', filters);

export default { get };
