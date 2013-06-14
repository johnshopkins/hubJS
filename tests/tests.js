/**
 * Unit testing
 */


/**
 * Initialization settings object
 * @type {Object}
 */
var init = {
	version: 0,
	key: "70a252dc26486819e5817371a48d6e3b5989cb2a"
}

hubJS.baseUrl = "http://local.api.hub.jhu.edu/";


test("hubJS.init() : version", function () {
	hubJS.init();
	deepEqual(hubJS.userSettings, { version: 0, key: null });

	hubJS.init({ version: 0 });
	deepEqual(hubJS.userSettings, { version: 0, key: null });

	hubJS.init({ version: 1 });
	deepEqual(hubJS.userSettings, { version: 1, key: null });
});

test("hubJS.init() : key", function () {
	hubJS.init({ key :"kitteh" });
	deepEqual(hubJS.userSettings, { version: 0, key: "kitteh" });
});

test("hubJS.init() : additional params", function () {
	hubJS.init({ somethingElse: "value"});
	deepEqual(hubJS.userSettings, { key: null, somethingElse: "value", version: 0 });
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
	deepEqual(set, expected);

	var expected = [];
	var set = hubJS.utility.extractEmbeddedItemIds({}, "tags");
	deepEqual(set, expected);
});

asyncTest("hubJS.get() : lookup with no data", function () {
	hubJS.init(init);
	var response = hubJS.get("articles", {}).then(function (payload) {
		console.log(payload);
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.get() : lookup with ID", function () {
	hubJS.init(init);

	var id = 157;

	var response = hubJS.get("articles", {id: id}).then(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with no data", function () {
	hubJS.init(init);
	var response = hubJS.articles.find().then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with ID", function () {
	hubJS.init(init);

	var id = 157;

	var response = hubJS.articles.find({id: id}).then(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with ID", function () {
	hubJS.init(init);

	var id = 157;

	var response = hubJS.articles.find({id: id}).then(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.recent()", function () {
	hubJS.init(init);
	var response = hubJS.articles.recent(2).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 2);
		start();
	});
});

asyncTest("hubJS.articles.recent()", function () {
	hubJS.init(init);
	response = hubJS.articles.recent().then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.related()", function () {
	hubJS.init(init);
	var response = hubJS.articles.related(1009).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.related(): get back two articles", function () {
	hubJS.init(init);
	var response = hubJS.articles.related(157, { per_page: 2}).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 2);
		start();
	});
});

asyncTest("hubJS.articles.related(): with a passed excluded ID", function () {
	hubJS.init(init);
	var response = hubJS.articles.related(157, { excluded_ids: 123 }).then(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("Error detection", function () {
	hubJS.init();
	var response = hubJS.get("articles").then(function (payload) {
		if (payload.error) {
	        var httpStatus = payload.statusCode;
	        var message = payload.message;
	    }
		equal(httpStatus, 401);
		equal(message, "API requests require authentication.");
		start();
	});
});