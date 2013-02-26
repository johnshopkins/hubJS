/**
 * Unit testing
 */
test("hub.init()", function ()
{
	hub.init({});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0}));

	hub.init({version:0});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0}));

	hub.init({version: 1});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 1}));

	hub.init({another: "test"});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 0, another: "test"}));

	hub.init({version:1, another: "test"});
	equal(JSON.stringify(hub.userSettings), JSON.stringify({version: 1, another: "test"}));
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

// 	hub.init({version: 1});
// 	hub.articles.related(785, callbacks);

// });