import * as api from '../config';
import { components } from 'types/ivy-types';

type Currency = components['schemas']['Currency'];

function get(): Promise<Currency[]> {
    return api.get('currency');
}

const currency = {
    get,
};

export default currency;
