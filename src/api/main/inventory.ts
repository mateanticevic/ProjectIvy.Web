import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type InventoryItemBinding = components['schemas']['InventoryItemBinding'];
type InventoryItemPagedView = components['schemas']['InventoryItemPagedView'];
type InventoryItemGetQuery = paths['/Inventory/item']['get']['parameters']['query'];

const get = (query?: InventoryItemGetQuery): Promise<InventoryItemPagedView> => api.get('inventory/item', query);

const post = (inventory: InventoryItemBinding): Promise<number> => api.post('inventory/item', inventory);

const put = (id: string, inventory: InventoryItemBinding): Promise<number> => api.put(`inventory/item/${id}`, inventory);

const inventory = {
    get,
    post,
    put,
};

export default inventory;
