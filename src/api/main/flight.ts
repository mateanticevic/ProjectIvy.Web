import * as api from '../config';

import { components, paths } from 'types/ivy-types';

type AirlineInt32KeyValuePair = components['schemas']['AirlineInt32KeyValuePair'];
type FlightBinding = components['schemas']['FlightBinding'];
type FlightPagedView = components['schemas']['FlightPagedView'];
type GetFlightQuery = paths['/Flight']['get']['parameters']['query'];
type GetFlightCountQuery = paths['/Flight/Count/ByAirline']['get']['parameters']['query'];
type GetFlightCountByYearQuery = paths['/Flight/Count/ByYear']['get']['parameters']['query'];

const get = (filters?: GetFlightQuery): Promise<FlightPagedView> => api.get('flight', filters);

const getCountByAirline = (filters?: GetFlightCountQuery): Promise<AirlineInt32KeyValuePair[]> => api.get('flight/count/byairline', filters);

const getCountByAirport = (filters?: GetFlightCountQuery) => api.get('flight/count/byairport', filters);

const getCountByYear = (filters?: GetFlightCountByYearQuery) => api.get('flight/count/byyear', filters);

const post = (flight: FlightBinding): Promise<number> => api.post('flight', flight);

const put = (id: string, flight: FlightBinding): Promise<number> => api.put(`flight/${id}`, flight);

const flight = {
    get,
    getCountByAirline,
    getCountByAirport,
    getCountByYear,
    post,
    put,
};

export default flight;
