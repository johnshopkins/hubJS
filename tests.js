/**
 * Unit testing
 */

var init = {
	version: 0,
	env: "development"
}

// test("hub.init() : version", function ()
// {
// 	hub.init({});
// 	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

// 	hub.init({version:0});
// 	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

// 	hub.init({version: 1});
// 	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 1, env: "production"}));
// });

// test("hub.init() : env", function ()
// {
// 	hub.init({});
// 	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

// 	hub.init({env: "production"});
// 	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

// 	hub.init({env: "development"});
// 	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "development"}));
// });

// test("hub.init() : additional params", function ()
// {
// 	hub.init({key: "value"});
// 	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production", key: "value"}));
// });

// test("hub.extractEmbeddedItemIds()", function ()
// {
// 	var testData = {
// 		_embedded: {
// 			tags: [
// 				{id: 1},
// 				{id: 2},
// 				{id: 3},
// 				{id: 4},
// 				{id: 5}
// 			]
// 		}
// 	};

// 	var expected = [1,2,3,4,5];
// 	var set = hub.utility.extractEmbeddedItemIds(testData, "tags");
// 	equal(JSON.stringify(set), JSON.stringify(expected));

// 	var expected = [];
// 	var set = hub.utility.extractEmbeddedItemIds({}, "tags");
// 	equal(JSON.stringify(set), JSON.stringify(expected));
// });

// asyncTest("hub.get() : lookup with no data", function ()
// {
// 	hub.init(init);
// 	var response = hub.get("articles");
// 	response.success(function (payload) {
// 		var length = payload._embedded.articles.length;
// 		equal(length, 5);
// 		start();
// 	})
// });

// asyncTest("hub.get() : lookup with ID", function ()
// {
// 	hub.init(init);

// 	var id = 157;

// 	var response = hub.articles.find({id: id});
// 	response.success(function (payload) {
// 		var foundId = payload.id;
// 		equal(foundId, id);
// 		start();
// 	})
// });

// asyncTest("hub.articles.find() : lookup with no data", function ()
// {
// 	hub.init(init);
// 	var response = hub.articles.find();
// 	response.success(function (payload) {
// 		var length = payload._embedded.articles.length;
// 		equal(length, 5);
// 		start();
// 	})
// });

// asyncTest("hub.articles.find() : lookup with ID", function ()
// {
// 	hub.init(init);

// 	var id = 157;

// 	var response = hub.articles.find({id: id});
// 	response.success(function (payload) {
// 		var foundId = payload.id;
// 		equal(foundId, id);
// 		start();
// 	})
// });

// asyncTest("hub.articles.recent()", function ()
// {
// 	hub.init(init);
// 	var response = hub.articles.recent();
// 	response.success(function (payload) {
// 		var length = payload._embedded.articles.length;
// 		equal(length, 5);
// 		start();
// 	})
// });

// asyncTest("hub.articles.related()", function ()
// {
// 	hub.init(init);
// 	var response = hub.articles.related(157);
// 	response.success(function (payload) {
// 		var length = payload._embedded.articles.length;
// 		console.log(length);
// 		equal(length, 5);
// 		start();
// 	})
// });

// /**
//  * Manual testing
//  */
jQuery(document).ready(function ($) {

	var callbacks = {
		success: function (payload, status, jqXHR) {
			console.log(payload);
			console.log("custom success callback.");
		},
		error: function (jqXHR, status, error) {
			console.log("custom error callback.");
		}
	};

	hub.init({version: 1, env: "development"});
	test = hub.articles.related(785);
	// test = hub.articles.related(157);

	console.log(test);

	// test.success(function(payload) {
	// 	console.log(payload);
	// });

});