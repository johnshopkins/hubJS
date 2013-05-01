# hubJS

HubJS is the JavaScript library for interacting with the Hub API.


## Usage

Include hubJS.js on all pages that need access to the library. Be sure to [initialize the library](#init) before attemping to run functions.

```html
<script src="hubJS.js"></script>
hubJS.init();
```


## <a name="utility"></a> Utility functions

### <a name="init"></a>hubJS.init(settings)
Initializes hubJS with user settings. This function must run before any [getter functions](#getter).

##### Parameters

1. __settings__ {Object} Optional. A set of key/value pairs that configure hubJS. See available settings below.


##### Available settings
1. __version__ {Int} API version (see [API docs](http://api.hub.jhu.edu/docs) for help). Defaults to current version.

##### Example

```javascript
hubJS.init({
	version: 0
});
```

## <a name="getter"></a> Getter functions

All getter functions return a JavaScript promise, which is an object that has a function as the value of the `then` property. `then()` takes a single function as a argument, which is called when the promise is fulfilled. This function accepts three arguments:

1. `data`: data retrieved from the request (JSON)
2. `status`: HTTP status code (example: 200)
3. `statusText`: HTTP status test (example; "OK")

Related: [Detecting errors](#detecting-errors)

### hubJS.articles.find(data)
Retrieves articles based on passed data. Returns a promise object.

##### Parameters

1. __data__ {Object} Optional. A set of key/value pairs that filter the pool of articles returned. See [available filters](#filters).


##### Example

```javascript
// Get Hub articles in the "health" topic ordered by ascending ID
hubJS.articles.find({
	order_by: "id|asc",
	source: "hub",
	topic: "health"
}).then(function(data, status, statusText) {
	// do something with data
});

// Get the article with the ID of 157
hubJS.articles.find({
	id: 157
}).then(function(data, status, statusText) {
	// do something with data
});
```


### hubJS.articles.recent(count)

Retrieves rencent articles. Returns a promise object.

##### Parameters

1. __count__ {Integer} Optional. Number of articles to retrieve. Defaults to 5.

##### Example

```javascript
// Get two recent articles
hubJS.articles.recent(2).then(function(data, status, statusText) {
	// do something with data
});
```


### hubJS.articles.popular(data)

Retrieve articles currently popular on the Hub website. Returns a promise object.

##### Parameters

1. __data__ {Object} Optional. A set of key/value pairs that filter the pool of articles returned. See [available filters](#filters).

##### Example

```javascript
// Get popular Hub articles in the "health" topic
hubJS.articles.popular({
	source: "hub",
	topic: "health"
}).then(function(data, status, statusText) {
	// do something with data
});
```

### hubJS.articles.related(id, data)

Finds articles related to a given article. Relationships are made first by common tags. If there are no tag relationships, topic relationships are searched for. Returns a promise object.

##### Parameters

1. __id__ {Integer} Required. ID of the article to lookup other articles against.
1. __data__ {Object} Optional. A set of key/value pairs that filter the pool of articles returned. See [available filters](#filters).

##### Example

```javascript
// Returns two articles related to article #157
hubJS.articles.related(157, {
	per_page: 2
}).then(function(data, status, statusText) {
	// do something with data
});
```


### hubJS.get(endpoint, data)

Gets a payload from the API. Returns a promise object.

##### Parameters

1. __endpoint__ {String} Required. Endpoint of the API to query.
1. __data__ {Object} Optional. A set of key/value pairs that filter the pool of articles returned. See [available filters](#filters).

##### Example

```javascript
// Get topics from the topics endpoint
hubJS.get("topics").then(function(data, status, statusText) {
	// do something with data
});

// Get 10 topics from the topic endpoint
hubJS.getr("topics", {
	per_page: 10
}).then(function(data, status, statusText) {
	// do something with data
})
```

## <a name="filters"></a> Available filters
1. __id__ {Int} Article ID. If used, only one article will be returned
1. __tags__ {String} Comma-separated list of tag slugs or IDs
1. __topics__ {String} Comma-separated list of topic slugs or IDs
1. __publish_date__ {String} "YYYY-MM-DD" for a single date; "YYYY-MM-DD,YYYY-MM-DD" for a date range
1. __order_by__ {String} [field]|[asc|desc] Default: "publish_date|desc"
1. __source__ {String} Publication source ("hub", "magazine" or "gazette")


## <a name="detecting-errors"></a> Detecting errors

HubJS promises loosly follow the [CommonJS Pomises/A proposal](http://wiki.commonjs.org/wiki/Promises/A), which defines a promise as "an object that has a function as the value for the property `then()`," which accepts three arguments (all functions):

1. `fulfilledHandler`: called when a promise is fulfilled
2. `errorHandler`: called when a promise fails
3. `progressHandler`: called for promise progress events

Currently, hubJS promises does not support the `errorHandler` and `progressHandler` arguments.

Regarding `errorHandler`, all requests made from hubJS use [JSONP](http://en.wikipedia.org/wiki/JSONP) to overcome the cross-domain limitation of AJAX requests. The downside of using JSONP is that it cannot detect errors in the request, so it will always return with a status of 200; therefore, the `fulfilledHandler` is _always_ fired even if there is an error. In a future release of hubJS, this problem will be resolved, but for now, there is a workaround:

```javascript
hubJS.articles.find().then(function(data, status, statusText) {
	if (data.error) {
		// there was an error
		var httpStatus = data.statusCode;
		var message = data.message;
	} else {
		// no error, so let's do stuff with the data
	}
}
});
```

Regarding `progressHandler`, this is just a feature that has yet to be implemented.