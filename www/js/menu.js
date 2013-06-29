(function () {
  "use strict";
  html5ks.menu = {
    mainMenu: function () {
      html5ks.api.stop("music");
      html5ks.api.stop("sound");
      html5ks.api.stop("ambient");
      html5ks.api.window("hide");
      html5ks.api.play("music", "music_menus");
      html5ks.elements.bg.style.background = "url(dump/ui/main/bg-main.png) 0 0 / cover";
      this.elements.mainMenu.style.display = "block";
    },

    activeDialog: null,

    dialog: function (name) {
      this.activeDialog = html5ks.elements.dialog[name];
      this.activeDialog.style.display = "block";
      html5ks.elements.dialogs.style.display = "block";
    },

    initElements: function () {
      this.elements = {
        dialogs: document.getElementById("dialogs"),
        dialog: {
          return: document.getElementById("return")
        },
        mainMenu: document.getElementById("main-menu"),
        main: {
          start: document.getElementById("start"),
          optionsButton: document.getElementById("options-button"),
        }
      };
    },

    init: function () {
      this.initElements();
      this.elements.main.start.addEventListener("click", function () {
        if (this._imachine_loaded) {
          this.elements.mainMenu.style.display = "none";
          html5ks.imachine.start().then(this.mainMenu.bind(this));
        }
      }.bind(this), false);
      this.elements.main.optionsButton.addEventListener("click", function () {
        html5ks.menu.dialog("options");
      }, false);
      this.elements.dialog.return.addEventListener("click", function (e) {
        html5ks.menu.activeDialog.style.display = "none";
        html5ks.elements.dialogs.style.display = "none";
      }, false);
      html5ks.fetch("imachine").then(function () {
        var start = this.elements.main.start;
        start.className = start.className.replace("button-disabled", "button-enabled");
        this._imachine_loaded = true;
      }.bind(this));
    }
  };
}());
