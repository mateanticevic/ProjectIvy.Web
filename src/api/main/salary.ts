import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type Salary = components['schemas']['Salary'];
type SalaryBinding = components['schemas']['SalaryBinding'];
type SalaryPagedView = components['schemas']['SalaryPagedView'];
type SalaryQuery = paths['/Salary']['get']['parameters']['query'];

const get = (filters?: SalaryQuery): Promise<SalaryPagedView> => api.get('salary', filters);
const getById = (id: string): Promise<Salary> => api.get(`salary/${encodeURIComponent(id)}`);
const post = (binding: SalaryBinding): Promise<Salary> => api.post('salary', binding);
const put = async (id: string, binding: SalaryBinding): Promise<void> => { await api.put(`salary/${encodeURIComponent(id)}`, binding); };
const del = async (id: string): Promise<void> => { await api.del(`salary/${encodeURIComponent(id)}`); };

export default { get, getById, post, put, del };
