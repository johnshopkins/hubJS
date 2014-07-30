var expect = require("chai").expect;
var sinon = require("sinon");
var hubjslib = require("../index");


describe("hubjs", function () {

  var init = {
    version: 0,
    key: "3c862c46d83c108a30c6660c7b91b560e4f76199"
  };

  describe("init", function () {

    it("should setup user settings properly", function () {

      var hubjs = new hubjslib();
      expect(hubjs.userSettings).to.deep.equal({ version: 0, key: null });

      var hubjs = new hubjslib({ version: 0 });
      expect(hubjs.userSettings).to.deep.equal({ version: 0, key: null });

      var hubjs = new hubjslib({ version: 1 });
      expect(hubjs.userSettings).to.deep.equal({ version: 1, key: null });

      var hubjs = new hubjslib({ key :"kitteh" });
      expect(hubjs.userSettings).to.deep.equal({ version: 0, key: "kitteh" });

      var hubjs = new hubjslib({ somethingElse: "value"});
      expect(hubjs.userSettings).to.deep.equal({ key: null, somethingElse: "value", version: 0 });

    });

  });

  describe("extractEmbeddedItemIds", function () {

    it("should extract IDs properly", function () {

      var hubjs = new hubjslib();

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
      var set = hubjs.utility.extractEmbeddedItemIds(testData, "tags");
      expect(set).to.deep.equal(expected);

      var expected = [];
      var set = hubjs.utility.extractEmbeddedItemIds({}, "tags");
      expect(set).to.deep.equal(expected);

      });

  });

  describe("articles", function () {

    var hubjs = new hubjslib(init);
    console.log("tset");

    it("should fetch articles", function (done) {

       hubjs.get("articles", {}).then(function (payload) {
         var length = payload._embedded.articles.length;
         expect(lenth).to.equal(5);
         done();
       });

    });

  });

});
