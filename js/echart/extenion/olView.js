/**
 * Created by admin on 2016/9/26.
 */


// define(function(require) {

// return
echarts.extendComponentView({
    type: 'openlayers',

    render: function(olMapModel, ecModel, api) {
        var rendering = true;
        var olmap = olMapModel.getOLMap();
        var viewportRoot = api.getZr().painter.getViewportRoot();
        var coordSys = olMapModel.coordinateSystem;
        var moveHandler = function(type, target) {
            viewportRoot.style.visibility = 'visible';
            if (rendering) {
                return;
            }
            var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
            var mapOffset = [-parseInt(offsetEl.style.left, 10) || 0, -parseInt(offsetEl.style.top, 10) || 0];
            viewportRoot.style.left = mapOffset[0] + 'px';
            viewportRoot.style.top = mapOffset[1] + 'px';

            coordSys.setMapOffset(mapOffset);
            olMapModel.__mapOffset = mapOffset;

            api.dispatchAction({
                type: 'openlayersRoam'
            });
        };

        function zoomEndHandler() {
            viewportRoot.style.visibility = 'visible';
            if (rendering) {
                return;
            }
            api.dispatchAction({
                type: 'openlayersRoam'
            });
        }

        function beforeZoomHandel() {
            viewportRoot.style.visibility = 'hidden';
        }

        olmap.un('pointerdrag', this._oldMoveHandler);

        olmap.getView().un('change:center', moveHandler);
        // FIXME
        // Moveend may be triggered by centerAndZoom method when creating coordSys next time
        // olmap.removeEventListener('moveend', this._oldMoveHandler);
        olmap.un('moveend', this._oldZoomEndHandler);
        olmap.getView().un('change:resolution', this._oldBeforeZoomHandel);
        olmap.on('pointerdrag', beforeZoomHandel);
        olmap.on('moveend', zoomEndHandler);
        olmap.getView().on('change:resolution', beforeZoomHandel);
        olmap.getView().on('change:center', moveHandler);
        this._oldMoveHandler = moveHandler;
        this._oldZoomEndHandler = zoomEndHandler;
        this._oldBeforeZoomHandel = beforeZoomHandel;

        // var roam = olMapModel.get('roam');
        // if (roam && roam !== 'scale') {
        //     olmap.enableDragging();
        // }
        // else {
        //     olmap.disableDragging();
        // }
        // if (roam && roam !== 'move') {
        //   olmap.enableScrollWheelZoom();
        //    olmap.enableDoubleClickZoom();
        //   olmap.enablePinchToZoom();
        // }
        // else {
        // olmap.disableScrollWheelZoom();
        // olmap.disableDoubleClickZoom();
        // olmap.disablePinchToZoom();
        // }

        //   var originalStyle = olMapModel.__mapStyle;

        // var newMapStyle = olMapModel.get('mapStyle') || {};
        // // FIXME, Not use JSON methods
        // var mapStyleStr = JSON.stringify(newMapStyle);
        // if (JSON.stringify(originalStyle) !== mapStyleStr) {
        //     // FIXME May have blank tile when dragging if setMapStyle
        //     if (Object.keys(newMapStyle).length) {
        //         olmap.setMapStyle(newMapStyle);
        //     }
        //     olMapModel.__mapStyle = JSON.parse(mapStyleStr);
        // }

        rendering = false;
    }
});
// });