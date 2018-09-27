"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const lib_1 = require("react-bootstrap/lib");
const react_google_maps_1 = require("react-google-maps");
const react_fontawesome_1 = __importDefault(require("react-fontawesome"));
const actions = __importStar(require("../actions/poiActions"));
const init = __importStar(require("../actions/commonActions"));
const Select_1 = __importDefault(require("../components/common/Select"));
const Map_1 = __importDefault(require("../components/common/Map"));
const PoiModal_1 = __importDefault(require("../components/pois/PoiModal"));
const PoiPanel_1 = __importDefault(require("../components/pois/PoiPanel"));
class PoisPage extends react_1.default.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            poi: {
                latitude: 0,
                longitude: 0
            },
            isModalOpen: false,
            filters: {
                page: 1,
                pageSize: 10
            }
        };
        props.init.getPoiCategories();
        props.init.getVendors();
        props.actions.getPois(this.state.filters);
        this.onAddToTrip = this.onAddToTrip.bind(this);
        this.onFiltersChanged = this.onFiltersChanged.bind(this);
        this.onNewClick = this.onNewClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onMapDragEnd = this.onMapDragEnd.bind(this);
        this.onPoiChange = this.onPoiChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }
    onAddToTrip(poiId) {
        this.props.actions.addPoiToTrip("finland-and-estonia", poiId);
    }
    onFiltersChanged(filter) {
        let filters = Object.assign({}, this.state.filters, filter);
        this.setState({ filters: filters });
        this.props.actions.getPois(filters);
    }
    onMapClick(e) {
        this.setState({
            isModalOpen: true,
            poi: {
                latitude: e.latLng.lat(),
                longitude: e.latLng.lng()
            }
        });
    }
    onModalClose() {
        this.setState({ isModalOpen: false });
    }
    onMapDragEnd() {
        //let bounds = this.map.state.map.getBounds();
        //let filters = { ...this.state.filters, x: { lat: bounds.f.b, lng: bounds.b.b }, y: { lat: bounds.f.f, lng: bounds.b.f } };
        //this.setState({ filters: filters });
        //this.props.actions.getPois(filters);
    }
    onNewClick() {
        this.setState({ isModalOpen: true });
    }
    onPoiChange(property) {
        let poi = Object.assign({}, this.state.poi, property);
        this.setState({ poi: poi });
    }
    onSave() {
        this.props.actions.addPoi(this.state.poi);
        this.setState({ isModalOpen: false });
        this.props.actions.getPois(this.state.filters);
    }
    render() {
        const poiMarkers = this.props.pois.pois.items != null ? this.props.pois.pois.items.map(poi => react_1.default.createElement(react_google_maps_1.Marker, { key: poi.id, defaultPosition: { lat: poi.location.latitude, lng: poi.location.longitude }, title: poi.name })) : null;
        return (react_1.default.createElement(lib_1.Grid, null,
            react_1.default.createElement(lib_1.Row, null,
                react_1.default.createElement(lib_1.Col, { lg: 12 },
                    react_1.default.createElement(lib_1.Panel, null,
                        react_1.default.createElement(lib_1.Panel.Heading, null, "Map"),
                        react_1.default.createElement(lib_1.Panel.Body, { className: "padding-0 panel-medium" },
                            react_1.default.createElement(Map_1.default, { onClick: this.onMapClick, map: map => this.map = map, onDragEnd: this.onMapDragEnd }, poiMarkers)),
                        react_1.default.createElement(lib_1.Panel.Footer, null,
                            react_1.default.createElement(lib_1.ToggleButtonGroup, { type: "radio", name: "options", defaultValue: 'move' },
                                react_1.default.createElement(lib_1.ToggleButton, { value: 'move' },
                                    react_1.default.createElement(react_fontawesome_1.default, { name: "arrows" }),
                                    " Move"),
                                react_1.default.createElement(lib_1.ToggleButton, { value: 'new' },
                                    react_1.default.createElement(react_fontawesome_1.default, { name: "map-marker" }),
                                    " New")))))),
            react_1.default.createElement(lib_1.Row, null,
                react_1.default.createElement(lib_1.Col, { lg: 3 },
                    react_1.default.createElement(lib_1.Panel, null,
                        react_1.default.createElement(lib_1.Panel.Heading, null, "Filters"),
                        react_1.default.createElement(lib_1.Panel.Body, null,
                            "              ",
                            react_1.default.createElement(lib_1.ControlLabel, null, "Category"),
                            react_1.default.createElement(Select_1.default, { options: this.props.common.poiCategories, onChange: id => this.onFiltersChanged({ categoryId: id }) }),
                            react_1.default.createElement(lib_1.ControlLabel, null, "Vendor"),
                            react_1.default.createElement(Select_1.default, { options: this.props.common.vendors, onChange: id => this.onFiltersChanged({ vendorId: id }) }),
                            react_1.default.createElement(lib_1.ControlLabel, null, "Name"),
                            react_1.default.createElement(lib_1.FormControl, { type: "text", onChange: x => this.onFiltersChanged({ name: x.target.value }) })))),
                react_1.default.createElement(lib_1.Col, { lg: 9 },
                    react_1.default.createElement(PoiPanel_1.default, { pagedItems: { page: this.state.filters.page, pageSize: this.state.filters.pageSize, list: this.props.pois.pois }, onNewClick: this.onNewClick, addToTrip: this.onAddToTrip, onPageChange: page => this.onFiltersChanged({ page: page }) }))),
            react_1.default.createElement(PoiModal_1.default, { isOpen: this.state.isModalOpen, onClose: this.onModalClose, onSave: this.onSave, categories: this.props.common.poiCategories, onPoiChange: this.onPoiChange, poi: this.state.poi })));
    }
}
function mapStateToProps(state) {
    return {
        common: state.common,
        pois: state.pois
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: redux_1.bindActionCreators(actions, dispatch),
        init: redux_1.bindActionCreators(init, dispatch)
    };
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(PoisPage);
