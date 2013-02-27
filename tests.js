/**
 * Unit testing
 */


/**
 * Initialization settings object
 * @type {Object}
 */
var init = {
	version: 0,
	env: "development"
}

// production
// var init = {
// 	version: 1
// }



test("hub.init() : version", function () {
	hub.init({});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

	hub.init({version:0});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

	hub.init({version: 1});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 1, env: "production"}));
});

test("hub.init() : env", function () {
	hub.init({});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

	hub.init({env: "production"});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

	hub.init({env: "development"});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "development"}));
});

test("hub.init() : additional params", function () {
	hub.init({key: "value"});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production", key: "value"}));
});

test("hub.extractEmbeddedItemIds()", function () {
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
	var set = hub.utility.extractEmbeddedItemIds(testData, "tags");
	equal(JSON.stringify(set), JSON.stringify(expected));

	var expected = [];
	var set = hub.utility.extractEmbeddedItemIds({}, "tags");
	equal(JSON.stringify(set), JSON.stringify(expected));
});

asyncTest("hub.get() : lookup with no data", function () {
	hub.init(init);
	var response = hub.get("articles");
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hub.get() : lookup with ID", function () {
	hub.init(init);

	var id = 157;

	var response = hub.get("articles", {id: id});
	response.done(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hub.articles.find() : lookup with no data", function () {
	hub.init(init);
	var response = hub.articles.find();
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hub.articles.find() : lookup with ID", function () {
	hub.init(init);

	var id = 157;

	var response = hub.articles.find({id: id});
	response.done(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hub.articles.find() : lookup with ID", function () {
	hub.init(init);

	var id = 157;

	var response = hub.articles.find({id: id});
	response.done(function (payload) {
		var foundId = payload.id;
		equal(foundId, id);
		start();
	});
});

asyncTest("hub.articles.recent()", function () {
	hub.init(init);
	var response = hub.articles.recent();
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
		start();
	});
});

asyncTest("hub.articles.related()", function () {
	hub.init(init);
	var response = hub.articles.related(157);
	response.done(function (payload) {
		var length = payload._embedded.articles.length;
		equal(length, 5);
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

	hub.init({version: 0, env: "development"});
	
	hub.articles.find({id: 157}, function() {
		console.log("Custom callback for articles.find()");
	});

	hub.articles.recent({}, function() {
		console.log("Custom callback for articles.recent()");
	});

	hub.articles.popular({}, function() {
		console.log("Custom callback for articles.popular()");
	});

	hub.articles.related(157, function() {
		console.log("Custom callback for articles.related()");
	});

});