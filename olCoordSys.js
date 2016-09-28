/**
 * Created by admin on 2016/9/26.
 */

function BMapCoordSys(bmap, api) {
    this._bmap = bmap;
    this.dimensions = ['lng', 'lat'];
    this._mapOffset = [0, 0];
    this._api = api;
    this.projection = bmap.getView().getProjection()
}

BMapCoordSys.prototype.dimensions = ['lng', 'lat'];

BMapCoordSys.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset;
};

BMapCoordSys.prototype.getBMap = function () {
    return this._bmap;
};

BMapCoordSys.prototype.dataToPoint = function (data) {
    var px = this._bmap.getPixelFromCoordinate(ol.proj.fromLonLat(data, this.projection));
    var mapOffset = this._mapOffset;
    return [px[0] - mapOffset[0], px[1] - mapOffset[1]];
};

BMapCoordSys.prototype.pointToData = function (px) {
    var mapOffset = this._mapOffset;
    var pt = this._bmap.getCoordinateFromPixel({
        x: px[0] + mapOffset[0],
        y: px[1] + mapOffset[1]
    });
    return pt;
};

BMapCoordSys.prototype.getViewRect = function () {
    var api = this._api;
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

BMapCoordSys.prototype.getRoamTransform = function () {
    return echarts.matrix.create();
};

var Overlay;

// For deciding which dimensions to use when creating list data
BMapCoordSys.dimensions = BMapCoordSys.prototype.dimensions;

function createOverlayCtor() {
    function Overlay(root) {
        this._root = root;
    }

    Overlay.prototype = new ol.Overlay({
        element: this._root,
        position: [20, 0]
    });
    /**
     * 初始化
     *
     * @param {BMap.Map} map
     * @override
     */
    Overlay.prototype.initialize = function (map) {
        map.getPanes().labelPane.appendChild(this._root);
        return this._root;
    };
    /**
     * @override
     */
    Overlay.prototype.draw = function () {
    };

    return Overlay;
}

BMapCoordSys.create = function (ecModel, api) {
    var bmapCoordSys;
    var root = api.getDom();

    // TODO Dispose
    ecModel.eachComponent('openlayers', function (bmapModel) {
        var viewportRoot = api.getZr().painter.getViewportRoot();
        if (typeof ol === 'undefined') {
            throw new Error('openlayers api is not loaded');
        }
        Overlay = Overlay || createOverlayCtor();
        if (bmapCoordSys) {
            throw new Error('Only one openlayers component can exist');
        }
        if (!bmapModel.__bmap) {
            // Not support IE8
            var bmapRoot = root.querySelector('.ec-extension-bmap');
            if (bmapRoot) {
                // Reset viewport left and top, which will be changed
                // in moving handler in BMapView
                viewportRoot.style.left = '0px';
                viewportRoot.style.top = '0px';
                root.removeChild(bmapRoot);
            }
            var bmap = bmapModel.__bmap = eval(bmapModel.get('mapobj'));
            bmapRoot = bmap.getTargetElement();
           // bmapRoot.style.cssText = 'width:100%;height:100%';
            // Not support IE8
            bmapRoot.classList.add('ec-extension-bmap');
            root.appendChild(bmapRoot);

            var targetView = bmap.getViewport();
            var beforeView = targetView.querySelector(".ol-overlaycontainer-stopevent");
            targetView.insertBefore(viewportRoot, beforeView)
        }
        var bmap = bmapModel.__bmap;
        // Set bmap options
        // centerAndZoom before layout and render
        // var center = bmapModel.get('center');
        // var zoom = bmapModel.get('zoom');
        // if (center && zoom) {
        //     var pt = new ol.geom.Point([center[0], center[1]]);
        //     bmap.getView().fit(pt, bmap.getSize(), {maxZoom: zoom})
        // }

        bmapCoordSys = new BMapCoordSys(bmap, api);
        bmapCoordSys.setMapOffset(bmapModel.__mapOffset || [0, 0]);
        bmapModel.coordinateSystem = bmapCoordSys;
    });

    ecModel.eachSeries(function (seriesModel) {
        if (seriesModel.get('coordinateSystem') === 'openlayers') {
            seriesModel.coordinateSystem = bmapCoordSys;
        }
    });
};
