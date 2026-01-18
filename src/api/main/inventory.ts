import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type InventoryItemBinding = components['schemas']['InventoryItemBinding'];
type InventoryItemGetQuery = paths['/Inventory/item']['get']['parameters']['query'];

const get = (query: InventoryItemGetQuery) => api.get('inventory/item', query);

const post = (inventory: InventoryItemBinding) => api.post('inventory/item', inventory);

const put = (id: string, inventory: InventoryItemBinding) => api.put(`inventory/item/${id}`, inventory);

const inventory = {
    get,
    post,
    put,
};

export default inventory;
