(function () {
  "use strict";
  html5ks.menu = {
    mainMenu: function () {
      html5ks.api.stop("music");
      html5ks.api.stop("sound");
      html5ks.api.stop("ambient");
      html5ks.api.window("hide");
      html5ks.api.play("music", "music_menus");
      html5ks.api.show("url", "ui/main/bg-main.png");
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
          quit: document.getElementById("quit")
        }
      };
    },

    initOptions: function () {
      var options = document.getElementsByClassName("option"),
          values = html5ks.persistent;

      if (!html5ks.persistent.scaleAll) {
        document.getElementById("scaleVideo").parentNode.className += " button-disabled";
      }

      var change = function (e) {
        var target = e.target;
        values[target.id] = target.type === "checkbox" ? target.checked : target.value;
        switch (target.id) {
          case "fullscreen":
            if (target.checked) {
              html5ks.fullscreen();
            } else {
              html5ks.fullscreen(false);
            }
            break;
          case "scaleAll":
            var scaleVideo = document.getElementById("scaleVideo");
            if (!target.checked) {
              scaleVideo.checked = false;
              scaleVideo.parentNode.className += " button-disabled";
            } else {
              scaleVideo.checked = true;
              scaleVideo.parentNode.className = scaleVideo.parentNode.className.replace("button-disabled", "");
            }
          case "scaleVideo":
            html5ks.scale();
            break;
          case "musicVolume":
          case "soundVolume":
            html5ks.api.set_volume(target.value, 0, target.id.replace("Volume", ""));
            break;
        }
      };

      options[0].parentNode.parentNode.addEventListener("change", change, false);
      options[0].parentNode.parentNode.addEventListener("input", change, false);
      for (var i = options.length - 1; i >= 0; i--) {
        var option = options[i];
        switch (option.type) {
          case "checkbox":
            option.checked = values[option.id];
            break;
          case "range":
            option.value = values[option.id];
            break;
          default:
            console.error("unknown option type %s", option.type);
        }
      }

      this.elements.main.optionsButton.addEventListener("click", function () {
        html5ks.menu.dialog("options");
      }, false);
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
      html5ks.fetch("imachine").then(function () {
        var start = this.elements.main.start;
        start.className = start.className.replace("button-disabled", "");
        this._imachine_loaded = true;
      }.bind(this));

      this.elements.dialog.return.addEventListener("click", function () {
        html5ks.menu.activeDialog.style.display = "none";
        html5ks.menu.elements.dialogs.style.display = "none";
      }, false);

      ["AppleWebKit", "MSIE", "Trident"].forEach(function (ua) {
        if (navigator.userAgent.indexOf(ua) > -1) {
          var quit = this.elements.main.quit;
          quit.className = quit.className.replace("button-disabled", "");
          this.elements.main.quit.addEventListener("click", function () {
            window.close();
            top.open('','_self','');
            top.close();
          }, false);
          return false;
        }
      }, this);
    }
  };
}());
