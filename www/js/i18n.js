"use strict";
html5ks.i18n = {
  init: function () {
    html5ks.fetch("json", "ui-strings").then(function () {
      var uiStrings = html5ks.data["ui-strings"];
      for (var k in uiStrings) {
        var e = document.getElementsByClassName(k);
        for (var i = e.length - 1; i >= 0; i--) {
          var t = document.createTextNode(uiStrings[k]);
          e[i].appendChild(t);
        }
      }
    });
  }
};
