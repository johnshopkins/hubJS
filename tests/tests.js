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
	hubJS.init({});
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
	hubJS.init(init);
	var response = hubJS.get("articles");
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.get() : lookup with ID", function () {
	hubJS.init(init);

	var id = 157;

	var response = hubJS.get("articles", {id: id});
	response.done(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with no data", function () {
	hubJS.init(init);
	var response = hubJS.articles.find();
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with ID", function () {
	hubJS.init(init);

	var id = 157;

	var response = hubJS.articles.find({id: id});
	response.done(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.find() : lookup with ID", function () {
	hubJS.init(init);

	var id = 157;

	var response = hubJS.articles.find({id: id});
	response.done(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hubJS.articles.recent()", function () {
	hubJS.init(init);
	var response = hubJS.articles.recent();
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.related()", function () {
	hubJS.init(init);
	var response = hubJS.articles.related(157);
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hubJS.articles.related(): get back two articles", function () {
	hubJS.init(init);
	var response = hubJS.articles.related(157, { per_page: 2});
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 2);
		start();
	});
});


/**
 * Manual testing for callbacks
 */

jQuery(document).ready(function ($) {
	var cb = function() {
		console.log("custom callback");
	}

	hubJS.init({version: 0, env: "development"});
	
	hubJS.articles.find({id: 157}, function() {
		console.log("Custom callback for articles.find()");
	});

	hubJS.articles.recent({}, function() {
		console.log("Custom callback for articles.recent()");
	});

	hubJS.articles.popular({}, function() {
		console.log("Custom callback for articles.popular()");
	});

	hubJS.articles.related(157, function() {
		console.log("Custom callback for articles.related()");
	});

});