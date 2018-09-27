"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_toastr_1 = require("react-redux-toastr");
const types = __importStar(require("../constants/poiActionTypes"));
const poiApi = __importStar(require("../api/main/poi"));
const tripApi = __importStar(require("../api/main/trip"));
function addPoi(poi) {
    return function (dispatch) {
        return poiApi.post(poi).then(() => {
            react_redux_toastr_1.toastr.success('Success', 'Poi added.');
            dispatch(addPoiSuccess());
        });
    };
}
exports.addPoi = addPoi;
function addPoiSuccess() {
    return { type: types.ADD_POI_SUCCESS };
}
exports.addPoiSuccess = addPoiSuccess;
function addPoiToTrip(tripId, poiId) {
    return function () {
        return tripApi.postPoi(tripId, poiId).then(() => {
            react_redux_toastr_1.toastr.success('Success', 'Poi linked to trip.');
        });
    };
}
exports.addPoiToTrip = addPoiToTrip;
function getPois(filters) {
    return function (dispatch) {
        return poiApi.get(filters).then(json => { dispatch(getPoisSuccess(json)); });
    };
}
exports.getPois = getPois;
function getPoisSuccess(pois) {
    return { type: types.GET_POIS_SUCCESS, pois };
}
exports.getPoisSuccess = getPoisSuccess;
