jQuery(document).ready(function ($) {

	var settings = {
		success: function (payload, status, jqXHR) {
			console.log("custom success callback.");
		}
	};

	payload = hubster.getArticles.byId(157, settings);

});