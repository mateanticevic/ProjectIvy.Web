import * as api from '../config';

const get = (geohash: string, precision: number) => api.get(`geohash?geohash=${geohash}&precision=${precision}`);

const geohash = {
    get
};

export default geohash;