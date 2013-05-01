/**
 * Unit testing
 */


/**
 * Initialization settings object
 * @type {Object}
 */
var init = {
	version: 0
}



test("hubJS.init() : version", function () {
	hubJS.init();
	equal(JSON.stringify(hubJS.userSettings), JSON.stringify({version: 0}));

	hubJS.init({version:0});
	equal(JSON.stringify(hubJS.userSettings), JSON.stringify({version: 0}));

	hubJS.init({version: 1});
	equal(JSON.stringify(hubJS.userSettings), JSON.stringify({version: 1}));
});

test("hubJS.init() : additional params", function () {
	hubJS.init({key: "value"});
	equal(JSON.stringify(hubJS.userSettings), JSON.stringify({version: 0, key: "value"}));
});

test("hubJS.extractEmbeddedItemIds()", function () {
	var testData = {
		_embedded: {
			tags: [
				{id: 1},
				{id: 2},
				{id: 3},
				{id: 4},
				{id: 5}
			]
		}
	};

	var expected = [1,2,3,4,5];
	var set = hubJS.utility.extractEmbeddedItemIds(testData, "tags");
	equal(JSON.stringify(set), JSON.stringify(expected));

	var expected = [];
	var set = hubJS.utility.extractEmbeddedItemIds({}, "tags");
	equal(JSON.stringify(set), JSON.stringify(expected));
});

asyncTest("hubJS.get() : lookup with no data", function () {
	hubJS.init();
	var response = hubJS.get("articles", {}).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.get() : lookup with ID", function () {
	hubJS.init();

	var id = 157;

	var response = hubJS.get("articles", {id: id}).then(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with no data", function () {
	hubJS.init();
	var response = hubJS.articles.find().then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with ID", function () {
	hubJS.init();

	var id = 157;

	var response = hubJS.articles.find({id: id}).then(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with ID", function () {
	hubJS.init();

	var id = 157;

	var response = hubJS.articles.find({id: id}).then(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.recent()", function () {
	hubJS.init();
	var response = hubJS.articles.recent(2).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 2);
		start();
	});
});

asyncTest("hubJS.articles.recent()", function () {
	hubJS.init();
	response = hubJS.articles.recent().then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.related()", function () {
	hubJS.init();
	var response = hubJS.articles.related(1009).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.related(): get back two articles", function () {
	hubJS.init();
	var response = hubJS.articles.related(157, { per_page: 2}).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 2);
		start();
	});
});

asyncTest("hubJS.articles.related(): with a passed excluded ID", function () {
	hubJS.init();
	var response = hubJS.articles.related(157, { excluded_ids: 123 }).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});