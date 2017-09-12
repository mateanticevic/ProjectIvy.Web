import * as api from '../config';

export function getPoiCategories() {
    return api.get("common/poiCategory");
}