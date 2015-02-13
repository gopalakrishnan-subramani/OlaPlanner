exports.getUserById = function (req, res) {
	User.getUserById();
	res.send([{name:'wine1'}, {name:'wine2'}, {name:'wine3'}]);
};