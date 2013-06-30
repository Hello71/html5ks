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
      this.activeDialog = this.elements.dialog[name];
      this.activeDialog.style.display = "block";
      this.elements.dialogs.style.display = "block";
    },

    initElements: function () {
      this.elements = {
        dialogs: document.getElementById("dialogs"),
        dialog: {
          options: document.getElementById("options"),
          return: document.getElementById("return")
        },
        mainMenu: document.getElementById("main-menu"),
        main: {
          start: document.getElementById("start"),
          optionsButton: document.getElementById("options-button"),
        }
      };
    },

    initOptions: function () {
      var options = document.getElementsByClassName("option"),
          values = html5ks.persistent.settings;

      for (var i = options.length - 1; i >= 0; i--) {
        var option = options[i];
        switch (option.type) {
          case "checkbox":
            option.checked = values[option.id];
            option.addEventListener("change", function () {
                    values[this.id] = this.checked;
            }, false);
            break;
          case "range":
            option.value = values[option.id];
            option.addEventListener("change", function () {
                    values[this.id] = this.value;
            }, false);
            break;
          default:
            console.error("unknown option type %s", option.type);
        }
      }
    },

    init: function () {
      this.initElements();
      this.initOptions();
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
        html5ks.menu.elements.dialogs.style.display = "none";
      }, false);
      html5ks.fetch("imachine").then(function () {
        var start = this.elements.main.start;
        start.className = start.className.replace("button-disabled", "button-enabled");
        this._imachine_loaded = true;
      }.bind(this));
    }
  };
}());
