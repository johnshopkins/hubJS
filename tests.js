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

	hub.init({version: 1});
	hub.articles.related(785, callbacks);

});