var expect = require("chai").expect;
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

});
