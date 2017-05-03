/**
 * Created by admin on 2016/9/26.
 */

function OLMapCoordSys(olmap, api) {
    this._olmap = olmap;
    this.dimensions = ['lng', 'lat'];
    this._mapOffset = [0, 0];
    this._api = api;
    this.projection = olmap.getView().getProjection()
}

OLMapCoordSys.prototype.dimensions = ['lng', 'lat'];

OLMapCoordSys.prototype.setMapOffset = function(mapOffset) {
    this._mapOffset = mapOffset;
};

OLMapCoordSys.prototype.getOLMap = function() {
    return this._olmap;
};

OLMapCoordSys.prototype.dataToPoint = function(data) {
    var px = this._olmap.getPixelFromCoordinate(ol.proj.fromLonLat(data, this.projection));
    var mapOffset = this._mapOffset;
    if (px) {
        return [px[0] - mapOffset[0], px[1] - mapOffset[1]];

    } else {
        return [0, 0];
    }
};

OLMapCoordSys.prototype.pointToData = function(px) {
    var mapOffset = this._mapOffset;
    var pt = this._olmap.getCoordinateFromPixel({
        x: px[0] + mapOffset[0],
        y: px[1] + mapOffset[1]
    });
    return pt;
};

OLMapCoordSys.prototype.getViewRect = function() {
    var api = this._api;
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

OLMapCoordSys.prototype.getRoamTransform = function() {
    return echarts.matrix.create();
};


// For deciding which dimensions to use when creating list data
OLMapCoordSys.dimensions = OLMapCoordSys.prototype.dimensions;



OLMapCoordSys.create = function(ecModel, api) {
    var olmapCoordSys;
    var root = api.getDom();

    // TODO Dispose
    ecModel.eachComponent('openlayers', function(olmapModel) {
        var viewportRoot = api.getZr().painter.getViewportRoot();
        viewportRoot.style.position = 'absolute'
        console.log(viewportRoot)
        if (typeof ol === 'undefined') {
            throw new Error('openlayers api is not loaded');
        }
        if (olmapCoordSys) {
            throw new Error('Only one openlayers component can exist');
        }
        if (!olmapModel.__olmap) {
            // Not support IE8
            var olmapRoot = root.querySelector('.ec-extension-olmap');
            if (olmapRoot) {
                // Reset viewport left and top, which will be changed
                // in moving handler in OLMapView
                viewportRoot.style.left = '0px';
                viewportRoot.style.top = '0px';
                console.log(viewportRoot)

                root.removeChild(olmapRoot);
            }
            var olmap = olmapModel.__olmap = eval(olmapModel.get('mapobj'));
            if (!olmap) {
                olmapRoot = document.createElement('div');
                console.log(1)
                olmapRoot.id = 'map'
                document.body.appendChild(olmapRoot)
                olmapRoot.style.cssText = 'width:100%;height:100%';
                olmap = olmapModel.__olmap = new ol.Map({
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM()
                        })
                    ],
                    target: 'map',
                    controls: ol.control.defaults({
                        attributionOptions: ({
                            collapsible: false
                        })
                    }),
                    view: new ol.View({
                        center: ol.proj.fromLonLat([116.4551, 40.2539]),
                        zoom: 5,
                        // projection: "EPSG:4326"
                    })
                });
            }

            // Not support IE8
            olmapRoot.classList.add('ec-extension-olmap');
            root.appendChild(olmapRoot);

            var targetView = olmap.getViewport();
            var beforeView = targetView.querySelector(".ol-overlaycontainer-stopevent");
            targetView.insertBefore(viewportRoot, beforeView)
        }
        var olmap = olmapModel.__olmap;
        // Set olmap options
        // centerAndZoom before layout and render
        // var center = olmapModel.get('center');
        // var zoom = olmapModel.get('zoom');
        // if (center && zoom) {
        //     var pt = new ol.geom.Point([center[0], center[1]]);
        //     olmap.getView().fit(pt, olmap.getSize(), {maxZoom: zoom})
        // }

        olmapCoordSys = new OLMapCoordSys(olmap, api);
        olmapCoordSys.setMapOffset(olmapModel.__mapOffset || [0, 0]);
        olmapModel.coordinateSystem = olmapCoordSys;
    });

    ecModel.eachSeries(function(seriesModel) {
        if (seriesModel.get('coordinateSystem') === 'openlayers') {
            seriesModel.coordinateSystem = olmapCoordSys;
        }
    });
};