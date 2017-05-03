/**
 * Created by admin on 2016/9/26.
 */

// define(function(require) {

function v2Equal(a, b) {
    return a && b && a[0] === b[0] && a[1] === b[1];
}
echarts.extendComponentModel({
    type: 'openlayers',

    getOLMap: function() {
        // __olmap is injected when creating BMapCoordSys
        return this.__olmap;
    },

    setCenterAndZoom: function(center, zoom) {
        this.option.center = center;
        this.option.zoom = zoom;

    },

    centerOrZoomChanged: function(center, zoom) {
        var option = this.option;
        return !(v2Equal(center, option.center) && zoom === option.zoom);
    },

    defaultOption: {

        center: [104.114129, 37.550339],

        zoom: 5,

        mapStyle: {},

        roam: false
    }
});
// });