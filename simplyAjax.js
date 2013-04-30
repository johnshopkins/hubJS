var Deferred = (function() {

	var deferred = {

		resolve: function(responseText, status, statusText) {
			deferred.fulfilled(responseText, status, statusText);
		},

		reject: function(status, statusText) {
			deferred.error(status, statusText);
		},

		fulfilled: function(responseText, status, statusText) { },

		error: function(status, statusText) { },

		// what arguments, when does this fire?
		progress: function() { },

		promise: {

			then: function(fulfilled, error, progress) {

				deferred.fulfilled = typeof fulfilled == "function" ? fulfilled : function() {};
				deferred.error = typeof error == "function" ? error : function() {};
				deferred.progress = typeof progress == "function" ? progress: function() {};

				// return a new promise that will resolve with the return value of the previous handler.
			}
		}
	}

	return deferred;

});

var simplyAjax = (function () {

	/**
	 * Sets _xhr to either XMLHttpRequest or
	 * the correct version ofActiveXObject
	 * 
	 * @return {Object}
	 */
	function getXHR() {
		var xhr;

		if (typeof XMLHttpRequest !== 'undefined') {
			xhr = new XMLHttpRequest();
		
		} else {
			var versions = ["Microsoft.XmlHttp", "MSXML2.XmlHttp", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.5.0"];
			
			for (var i = 0, len = versions.length; i < len; i++) {
				try {
					xhr = new ActiveXObject(versions[i]);
					break;
				}
				catch (e) {}
			}
		}
		return xhr;
	}

	function random() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	function randomCallbackName() {
		return "simplyAjax_" + random()+random()+random()+random()+random();
	}

	/**
	 * Attach a script element to the current page
	 * referencing the URL we need to make a GET
	 * request to
	 * @param  {string} url Full URL (with query string)
	 * @return null
	 */
	function crossDomainRequest(url) {
		var script = document.createElement("script");
		script.src = url;
		document.body.appendChild(script);
	}

	/**
	 * Create a query string from an object
	 * containing key: value pairs
	 * @param  {Object} object
	 * @return {string} Query string
	 */
	function createQueryString(object) {

		var queryString = "";
		var amp = false;

		for (var key in object) {
			if (amp) {
				queryString += "&";
			}
			queryString += key + "=" + object[key];

			// start adding the ampersand from now on
			amp = true;
		}

		return "?" + queryString;
	}

	return {

		/**
		 * Make a GET request
		 * 
		 * @param  {Object} obj
		 *         url: URL to make the request to
		 *         data: Plain object of key: value pairs to send with the request
		 *         dataType: right now, specifiying jsonp is the only thing that does anything
		 *         success: callback function to fire upon a successful GET request (data, statusCode, statusText)
		 *         fail: callback function to fire upon a failed GET request (statusCode, statusText)
		 * @return null
		 */
		get: function(obj) {

			var deferred = new Deferred();

			if (obj.dataType && obj.dataType.toLowerCase() == "jsonp") {

				// assign success callback to a function on ajax object
				var cb = randomCallbackName();
				simplyAjax[cb] = deferred.resolve;

				// assign callback in URL
				obj.data.callback = "simplyAjax." + cb;
				var url = obj.url + createQueryString(obj.data);
				
				crossDomainRequest(url);

			} else {

				var url = obj.url + createQueryString(obj.data);

				var xhr = getXHR();
				
				xhr.onreadystatechange = function() {

					if (xhr.readyState === 4) {

						if (xhr.status == 200) {
							deferred.resolve(xhr.responseText, xhr.status, xhr.statusText);
						} else {
							deferred.reject(xhr.status, xhr.statusText);
						}
					}	
				}
				
				xhr.open("GET", url, true);
				xhr.send(null);
			}

			return deferred.promise;
		
		}
	}
})();