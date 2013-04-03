# hubJS

The JavaScript library for interacting with The Hub API.


## Dependencies

1. jQuery >= 1.8.0


## Usage

Include jQuery and hubJS on each page that will use the hubJS library.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<script src="hubJS.js"></script>
```


## Methods

### hubJS.init(settings)
Initializes hubJS with user settings. This method must run before any other method.

##### Parameters

1. __settings__ {PlainObject} Required. A set of key/value pairs that configure hubJS. See available settings below.


##### Available settings
1. __version__ {Int} API version
1. __fail__ {Lambda(jqXHR, textStatus, errorThrown)} Failed request callback function

##### Example

```javascript
hubJS.init({
	version: 0,
	fail: function(jqXHR, textStatus, errorThrown) {
		console.log("Error found: " + errorThrown);
	)
});
```

### hubJS.articles.find(data, callback)
Retrieves articles based on passed data.

##### Parameters

1. __data__ {PlainObject} Optional. A set of key/value pairs that filter the pool of articles returned. See available filters below.
1. __callback__ {Lamdba(data, textStatus, jqXHR)} Optional. Callback that fires upon successful retrieval of data.


##### Example

```javascript
// Returns Hub articles in the "health" topic ordered by ascending ID
hubJS.articles.find({
	order_by: "id|asc",
	source: "hub",
	topic: "health"
});

// Returns the article with the ID of 157 and fires a callback when returned
hubJS.articles.find({
	id: 157
}, function(data, textStatus, jqXHR) {
	// do stuff with the data
});
```


### hubJS.articles.recent(count, callback)

Retrieves rencent articles.

##### Parameters

1. __count__ {Integer} Optional. Number of articles to retrieve. Defaults to 5.
1. __callback__ {Lamdba(data, textStatus, jqXHR)} Optional. Callback that fires upon successful retrieval of data.

##### Example

```javascript
// Returns two recent articles
hubJS.articles.recent(2);

// Returns two recent articles and fires a callback when returned
hubJS.articles.recent(2, function(data, textStatus, jqXHR) {
	// do stuff with the data
});
```


### hubJS.articles.popular(data, callback)

Retrieve articles currently popular on the Hub website.

##### Parameters

1. __data__ {PlainObject} Optional. A set of key/value pairs that filter the pool of articles returned. See available filters below.
1. __callback__ {Lamdba(data, textStatus, jqXHR)} Optional. Callback that fires upon successful retrieval of data.

##### Example

```javascript
// Returns popular Hub articles in the "health" topic
hubJS.articles.popular({
	source: "hub",
	topic: "health"
});

// Returns popular Hub articles in the "health" topic and fires a callback when returned
hubJS.articles.popular({
	source: "hub",
	topic: "health"
}, function(data, textStatus, jqXHR) {
	// do stuff with the data
});
```

### hub.JS.articles.related(id, data, callback)

Finds articles related to a given article. Relationships are made first by common tags. If there are no tag relationships, topic relationships are searched for.

##### Parameters

1. __id__ {Integer} Required. ID of the article to lookup other articles against.
1. __data__ {PlainObject} Optional. A set of key/value pairs that filter the pool of articles returned. See available filters below.
1. __callback__ {Lamdba(data, textStatus, jqXHR)} Optional. Callback that fires upon successful retrieval of data.

##### Example

```javascript
// Returns two articles related to article #157
hubJS.articles.related(157, {
	per_page: 2
});

// Returns articles related to article #157 and fires a callback when returned
hubJS.articles.popular(157, function(data, textStatus, jqXHR) {
	// do stuff with the data
});
```


### hubJS.get(endpoint, data, callback)

Gets a payload from the API.

##### Parameters

1. __endpoint__ {String} Required. Endpoint of the API to query.
1. __data__ {PlainObject} Optional. A set of key/value pairs that filter the pool of articles returned. See available filters below.
1. __callback__ {Lamdba(data, textStatus, jqXHR)} Optional. Callback that fires upon successful retrieval of data.

##### Example

```javascript
// Returns payload from the topics payload
hubJS.get("topics");

// Returns items from the topics payload and fires a callback when returned
hubJS.getr("topics", {
	per_page: 10
}, function(data, textStatus, jqXHR) {
	// do stuff with the data
});
```

## Available filters
1. __id__ {Int} Article ID. If used, only one article will be returned
1. __tags__ {String} Comma-separated list of tag slugs or IDs
1. __topics__ {String} Comma-separated list of topic slugs or IDs
1. __publish_date__ {String} "YYYY-MM-DD" for a single date; "YYYY-MM-DD,YYYY-MM-DD" for a date range
1. __order_by__ {String} [field]|[asc|desc] Default: "publish_date|desc"
1. __source__ {String} Publication source ("hub", "magazine" or "gazette")