var Graph = (function (undefined) {

  var extractKeys = function (obj) {
    var keys = [], key;
    for (key in obj) {
        Object.prototype.hasOwnProperty.call(obj,key) && keys.push(key);
    }
    return keys;
  }

  var sorter = function (a, b) {
    return parseFloat (a) - parseFloat (b);
  }

  var findPaths = function (map, start, end, infinity) {
    infinity = infinity || Infinity;

    var costs = {},
        open = {'0': [start]},
        predecessors = {},
        keys;

    var addToOpen = function (cost, vertex) {
      var key = "" + cost;
      if (!open[key]) open[key] = [];
      open[key].push(vertex);
    }

    costs[start] = 0;

    while (open) {
      if(!(keys = extractKeys(open)).length) break;

      keys.sort(sorter);

      var key = keys[0],
          bucket = open[key],
          node = bucket.shift(),
          currentCost = parseFloat(key),
          adjacentNodes = map[node] || {};

      if (!bucket.length) delete open[key];

      for (var vertex in adjacentNodes) {
          if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
          var cost = adjacentNodes[vertex],
              totalCost = cost + currentCost,
              vertexCost = costs[vertex];

          if ((vertexCost === undefined) || (vertexCost > totalCost)) {
            costs[vertex] = totalCost;
            addToOpen(totalCost, vertex);
            predecessors[vertex] = node;
          }
        }
      }
    }

    if (costs[end] === undefined) {
      return null;
    } else {
      return predecessors;
    }

  }

  var extractShortest = function (predecessors, end) {
    var nodes = [],
        u = end;

    while (u) {
      nodes.push(u);
      predecessor = predecessors[u];
      u = predecessors[u];
    }

    nodes.reverse();
    return nodes;
  }

  var findShortestPath = function (map, nodes) {
    var start = nodes.shift(),
        end,
        predecessors,
        path = [],
        shortest;

    while (nodes.length) {
      end = nodes.shift();
      predecessors = findPaths(map, start, end);

      if (predecessors) {
        shortest = extractShortest(predecessors, end);
        if (nodes.length) {
          path.push.apply(path, shortest.slice(0, -1));
        } else {
          return path.concat(shortest);
        }
      } else {
        return null;
      }

      start = end;
    }
  }

  var toArray = function (list, offset) {
    try {
      return Array.prototype.slice.call(list, offset);
    } catch (e) {
      var a = [];
      for (var i = offset || 0, l = list.length; i < l; ++i) {
        a.push(list[i]);
      }
      return a;
    }
  }

  var Graph = function (map) {
    this.map = map;
  }

  Graph.prototype.findShortestPath = function (start, end) {
    if (Object.prototype.toString.call(start) === '[object Array]') {
      return findShortestPath(this.map, start);
    } else if (arguments.length === 2) {
      return findShortestPath(this.map, [start, end]);
    } else {
      return findShortestPath(this.map, toArray(arguments));
    }
  }

  Graph.findShortestPath = function (map, start, end) {
    if (Object.prototype.toString.call(start) === '[object Array]') {
      return findShortestPath(map, start);
    } else if (arguments.length === 3) {
      return findShortestPath(map, [start, end]);
    } else {
      return findShortestPath(map, toArray(arguments, 1));
    }
  }

  return Graph;

})();



angular.module('starter.krish', [])

.controller('AccountCtrl', function($scope, DataStore,Distance, Direction) {
  

var map = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}};

var    graph = new Graph(map);

console.log(graph.findShortestPath('a', 'b'));      // => ['a', 'c', 'b']
console.log(graph.findShortestPath('a', 'c'));      // => ['a', 'c']
console.log(graph.findShortestPath('b', 'a'));      // => ['b', 'a']
console.log(graph.findShortestPath('b', 'c', 'b')); // => ['b', 'c', 'b']
console.log(graph.findShortestPath('c', 'a', 'b')); // => ['c', 'b', 'a', 'c', 'b']
console.log(graph.findShortestPath('c', 'b', 'a')); // => ['c', 'b', 'a']



  if (Distance) {

  var origin = 'RBI Layout, Bangalore';
  //var destination = new google.maps.LatLng(50.087, 14.421);
   var destination = "HSR Layout, Bangalore";

    Distance.getDistance(origin, destination).then(function(results){
      alert(results.length);
    });
  } 

  var places = [
                  {name: 'Railway Station, Bangalore', plannedAt: new Date(2015, 2, 8, 8, 0)},
                  {name: 'Airport, Bangalore', plannedAt: new Date(2015, 2, 8, 11, 0)}
              ];

    
  $scope.onMapReady = function(map) {
     
        var geocoder = new google.maps.Geocoder();
        
          var address = "RBI Layout, Bangalore";

          geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              map.setCenter(results[0].geometry.location);
              //alert(JSON.stringify(results[0].geometry.location));
              var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
              });
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });





        //map.setCenter(new google.maps.LatLng(12.9667, 77.5667));
            
        var markers = [];
        
        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        
        //setMarker(map, new google.maps.LatLng(12.9667, 77.5667), 'Bangalore', 'Just some content');
       // setMarker(map, new google.maps.LatLng(12.8879878, 77.58181209999998), 'RBI Layout', 'More content');
        //setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    
  };
    
     
  

  $scope.settings = {
    enableFriends: true
  };
});
