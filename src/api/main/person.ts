import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type Person = components['schemas']['Person'];
type PersonByDateOfBirth = components['schemas']['PersonByDateOfBirth'];
type GetPersonQuery = paths['/Person']['get']['parameters']['query'];
type GetPersonByDateOfBirthQuery = paths['/Person/ByDateOfBirth']['get']['parameters']['query'];

const get = (filters?: GetPersonQuery): Promise<Person> => api.get('person', filters);

const getByDateOfBirth = (filters: GetPersonByDateOfBirthQuery): Promise<PersonByDateOfBirth> =>
    api.get('person/byDateOfBirth', filters);

const person = {
    get,
    getByDateOfBirth,
};

export default person;
