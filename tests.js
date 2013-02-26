/**
 * Unit testing
 */
test("Test version -- hub.init()", function ()
{
	hub.init({});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

	hub.init({version:0});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

	hub.init({version: 1});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 1, env: "production"}));
});

test("Test additional params -- hub.init()", function ()
{
	hub.init({key: "value"});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production", key: "value"}));
});

test("Test environment -- hub.init()", function ()
{
	hub.init({});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

	hub.init({env: "production"});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "production"}));

	hub.init({env: "development"});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, env: "development"}));
});

test("hub.extractEmbeddedItemIds()", function ()
{
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



// /**
//  * Manual testing
//  */
// jQuery(document).ready(function ($) {

// 	var callbacks = {
// 		success: function (payload, status, jqXHR) {
// 			console.log(payload);
// 			console.log("custom success callback.");
// 		},
// 		error: function (jqXHR, status, error) {
// 			console.log("custom error callback.");
// 		}
// 	};

// 	hub.init({version: 1, env: "development"});
// 	hub.articles.related(785, callbacks);

// });