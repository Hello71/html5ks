"use strict";
html5ks.i18n = {
  init: function () {
    html5ks.fetch("json", html5ks.persistent.language === "en" ?
                          "ui-strings" : "ui-strings_FR").then(function (uiStrings) {
      for (var k in uiStrings) {
        var e = document.getElementsByClassName(k);
        for (var i = e.length - 1; i >= 0; i--) {
          e[i].textContent = uiStrings[k];
        }
      }
    });
  }
};
