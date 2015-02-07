a = [1, 2, 3, 4, 5]

function  rec(results, a, i, j){
	if (i >= a.length)
		return;

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
}