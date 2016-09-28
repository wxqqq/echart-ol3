/**
 * Created by admin on 2016/9/26.
 */

echarts.extendComponentView({
    type: 'openlayers',

    render: function (bMapModel, ecModel, api) {
        var rendering = true;
        var bmap = bMapModel.getBMap();
        var viewportRoot = api.getZr().painter.getViewportRoot();
        var coordSys = bMapModel.coordinateSystem;
        var moveHandler = function (type, target) {
            viewportRoot.style.visibility = 'visible';
            if (rendering) {
                return;
            }
            var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
            var mapOffset = [
                -parseInt(offsetEl.style.left, 10) || 0,
                -parseInt(offsetEl.style.top, 10) || 0
            ];
            viewportRoot.style.left = mapOffset[0] + 'px';
            viewportRoot.style.top = mapOffset[1] + 'px';

            coordSys.setMapOffset(mapOffset);
            bMapModel.__mapOffset = mapOffset;

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

        bmap.un('pointerdrag', this._oldMoveHandler);

        bmap.getView().un('change:center', moveHandler);
        // FIXME
        // Moveend may be triggered by centerAndZoom method when creating coordSys next time
        // bmap.removeEventListener('moveend', this._oldMoveHandler);
        bmap.un('moveend', this._oldZoomEndHandler);
        bmap.getView().un('change:resolution',this._oldBeforeZoomHandel);
        bmap.on('pointerdrag', beforeZoomHandel);
        bmap.on('moveend', zoomEndHandler);
        bmap.getView().on('change:resolution',beforeZoomHandel);
        bmap.getView().on('change:center', moveHandler);
        this._oldMoveHandler = moveHandler;
        this._oldZoomEndHandler = zoomEndHandler;
        this._oldBeforeZoomHandel=beforeZoomHandel;

        // var roam = bMapModel.get('roam');
        // if (roam && roam !== 'scale') {
        //     bmap.enableDragging();
        // }
        // else {
        //     bmap.disableDragging();
        // }
        // if (roam && roam !== 'move') {
        //   bmap.enableScrollWheelZoom();
        //    bmap.enableDoubleClickZoom();
        //   bmap.enablePinchToZoom();
        // }
        // else {
        // bmap.disableScrollWheelZoom();
        // bmap.disableDoubleClickZoom();
        // bmap.disablePinchToZoom();
        // }

        //   var originalStyle = bMapModel.__mapStyle;

        // var newMapStyle = bMapModel.get('mapStyle') || {};
        // // FIXME, Not use JSON methods
        // var mapStyleStr = JSON.stringify(newMapStyle);
        // if (JSON.stringify(originalStyle) !== mapStyleStr) {
        //     // FIXME May have blank tile when dragging if setMapStyle
        //     if (Object.keys(newMapStyle).length) {
        //         bmap.setMapStyle(newMapStyle);
        //     }
        //     bMapModel.__mapStyle = JSON.parse(mapStyleStr);
        // }

        rendering = false;
    }
});
// define(function (require) {
//
//     return require('echarts').extendComponentView({
//         type: 'bmap',
//
//         render: function (bMapModel, ecModel, api) {
//             var rendering = true;
//
//             var bmap = bMapModel.getBMap();
//             var viewportRoot = api.getZr().painter.getViewportRoot();
//             var coordSys = bMapModel.coordinateSystem;
//             var moveHandler = function (type, target) {
//                 if (rendering) {
//                     return;
//                 }
//                 var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
//                 var mapOffset = [
//                     -parseInt(offsetEl.style.left, 10) || 0,
//                     -parseInt(offsetEl.style.top, 10) || 0
//                 ];
//                 viewportRoot.style.left = mapOffset[0] + 'px';
//                 viewportRoot.style.top = mapOffset[1] + 'px';
//
//                 coordSys.setMapOffset(mapOffset);
//                 bMapModel.__mapOffset = mapOffset;
//
//                 api.dispatchAction({
//                     type: 'bmapRoam'
//                 });
//             };
//
//             function zoomEndHandler() {
//                 if (rendering) {
//                     return;
//                 }
//                 api.dispatchAction({
//                     type: 'bmapRoam'
//                 });
//             }
//
//             bmap.removeEventListener('moving', this._oldMoveHandler);
//             // FIXME
//             // Moveend may be triggered by centerAndZoom method when creating coordSys next time
//             // bmap.removeEventListener('moveend', this._oldMoveHandler);
//             bmap.removeEventListener('zoomend', this._oldZoomEndHandler);
//             bmap.addEventListener('moving', moveHandler);
//             // bmap.addEventListener('moveend', moveHandler);
//             bmap.addEventListener('zoomend', zoomEndHandler);
//
//             this._oldMoveHandler = moveHandler;
//             this._oldZoomEndHandler = zoomEndHandler;
//
//             var roam = bMapModel.get('roam');
//             if (roam && roam !== 'scale') {
//                 bmap.enableDragging();
//             }
//             else {
//                 bmap.disableDragging();
//             }
//             if (roam && roam !== 'move') {
//                 bmap.enableScrollWheelZoom();
//                 bmap.enableDoubleClickZoom();
//                 bmap.enablePinchToZoom();
//             }
//             else {
//                 bmap.disableScrollWheelZoom();
//                 bmap.disableDoubleClickZoom();
//                 bmap.disablePinchToZoom();
//             }
//
//             var originalStyle = bMapModel.__mapStyle;
//
//             var newMapStyle = bMapModel.get('mapStyle') || {};
//             // FIXME, Not use JSON methods
//             var mapStyleStr = JSON.stringify(newMapStyle);
//             if (JSON.stringify(originalStyle) !== mapStyleStr) {
//                 // FIXME May have blank tile when dragging if setMapStyle
//                 if (Object.keys(newMapStyle).length) {
//                     bmap.setMapStyle(newMapStyle);
//                 }
//                 bMapModel.__mapStyle = JSON.parse(mapStyleStr);
//             }
//
//             rendering = false;
//         }
//     });
// });
