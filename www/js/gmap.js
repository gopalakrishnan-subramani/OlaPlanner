angular.module('starter.gmap', [])

.directive('map', function() {
    // directive link function
    

    var link = function(scope, element, attrs) {
      //alert('link');

        var map, infoWindow;
        

        
        // map config
        var mapOptions = {
            center: new google.maps.LatLng(50, 2),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        
        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
                if (scope && scope.onMapReady) {
                	scope.onMapReady(map);
                }
            }
        }

        
        // show the map and place some markers
        initMap();    
};
    
    return {
        restrict: 'A',
        template: '<div class="gmaps"></div>',
        replace: true,
        link: link
    };
})

