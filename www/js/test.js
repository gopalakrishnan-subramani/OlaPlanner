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



a = [1, 2, 3, 4, 5]

function  rec(results, a, i, j){
	if (i >= a.length)
		return;
	
	if (i == 0 && j == a.length - 1) {
		j = i;
		i++;
		rec(results, a, i, j);
		return;
	}
	

	if ((a.length > i) && (a.length > j) && ( i != j) && (i < j)) {
		var data = {};
		data.source = a[i];
		data.destination = a[j];
		data.distance = 0;

		results.push(data);
	}

	j++;

	if (j == a.length) {
		j = i;
		i++;
	}

	rec(results, a, i, j);
}

results = []
rec(results, a, 0, 1)

console.log(results.length)

for (i = 0; i < results.length; i++) {
	console.log(results[i]);
	var data = results[i];

}

//var map = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}},

var map = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}};

var    graph = new Graph(map);

console.log(graph.findShortestPath('a', 'b'));      // => ['a', 'c', 'b']
console.log(graph.findShortestPath('a', 'c'));      // => ['a', 'c']
console.log(graph.findShortestPath('b', 'a'));      // => ['b', 'a']
console.log(graph.findShortestPath('b', 'c', 'b')); // => ['b', 'c', 'b']
console.log(graph.findShortestPath('c', 'a', 'b')); // => ['c', 'b', 'a', 'c', 'b']
console.log(graph.findShortestPath('c', 'b', 'a')); // => ['c', 'b', 'a']
