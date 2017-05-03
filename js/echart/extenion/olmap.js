/**
 * Created by admin on 2016/9/26.
 */
/**
 * OLMap component extension
 */


// define(function(require) {

echarts.registerCoordinateSystem(
	'openlayers', OLMapCoordSys
);
// Action
echarts.registerAction({
	type: 'openlayersRoam',
	event: 'openlayersRoam',
	update: 'updateLayout'
}, function(payload, ecModel) {
	ecModel.eachComponent('openlayers', function(olMapModel) {
		var olmap = olMapModel.getOLMap();
		var center = olmap.getView().getCenter();
		olMapModel.setCenterAndZoom([center[0], center[1]], olmap.getView().getZoom());
	});
});


// return {
// version: '1.0.0'
// };
// });