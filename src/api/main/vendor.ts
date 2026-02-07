import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type VendorPagedView = components['schemas']['VendorPagedView'];
type PoiPagedView = components['schemas']['PoiPagedView'];
type GetVendorQuery = paths['/Vendor']['get']['parameters']['query'];

function get(filters?: GetVendorQuery): Promise<VendorPagedView> {
    return api.get('vendor', filters);
}

function getPois(vendorId: string): Promise<PoiPagedView> {
    return api.get(`vendor/${vendorId}/poi`);
}

const vendor = {
    get,
    getPois,
};

export default vendor;
