/**
 * Created by admin on 2016/9/26.
 */
/**
 * BMap component extension
 */
echarts.registerCoordinateSystem(
    'openlayers', BMapCoordSys
);
// Action
echarts.registerAction({
    type: 'openlayersRoam',
    event: 'openlayersRoam',
    update: 'updateLayout'
}, function (payload, ecModel) {
    ecModel.eachComponent('openlayers', function (bMapModel) {
        var bmap = bMapModel.getBMap();
        var center = bmap.getView().getCenter();
        bMapModel.setCenterAndZoom([center[0], center[1]], bmap.getView().getZoom());
    });
});


// define(function (require) {
//
//     require('echarts').registerCoordinateSystem(
//         'bmap', require('./BMapCoordSys')
//     );
//     require('./BMapModel');
//     require('./BMapView');
//
//     // Action
//     require('echarts').registerAction({
//         type: 'bmapRoam',
//         event: 'bmapRoam',
//         update: 'updateLayout'
//     }, function (payload, ecModel) {
//         ecModel.eachComponent('bmap', function (bMapModel) {
//             var bmap = bMapModel.getBMap();
//             var center = bmap.getCenter();
//             bMapModel.setCenterAndZoom([center.lng, center.lat], bmap.getZoom());
//         });
//     });
//
//     return {
//         version: '1.0.0'
//     };
// });
