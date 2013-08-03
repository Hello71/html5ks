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
      html5ks.state.status = "menu";
    },

    activeDialog: null,

    dialog: function (name) {
      this.activeDialog = this.elements.dialog[name];
      this.activeDialog.style.display = "block";
      this.elements.dialogs.style.display = "block";
      this.elements.context.style.display = "none";
      html5ks.elements.gray.style.display = "block";
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
          start: document.getElementById("start")
        },
        context: document.getElementById("context"),
        contextMenu: document.getElementById("context-menu"),
        contextInfo: document.getElementById("context-info")
      };
    },

    initEvents: function () {
      var options = document.getElementsByClassName("option");
      var change = function (e) {
        var target = e.target;
        html5ks.persistent[target.id] = target.type === "checkbox" ? target.checked : target.value;
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
              scaleVideo.parentNode.className += " disabled";
            } else {
              scaleVideo.checked = true;
              scaleVideo.parentNode.className = scaleVideo.parentNode.className.replace("disabled", "");
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

      var optionsButton = document.getElementsByClassName("options-button");

      for (var i = optionsButton.length - 1; i >= 0; i--) {
        optionsButton[i].addEventListener("click", function (e) {
          html5ks.menu.dialog("options");
          e.stopPropagation();
        }, false);
      }

      html5ks.elements.container.addEventListener("contextmenu", function (e) {
        switch (html5ks.state.status) {
          case "scene":
          case "context":
            this.context();
        }
        e.preventDefault();
      }.bind(this), false);

      this.elements.dialog.return.addEventListener("click", function (e) {
        html5ks.menu.activeDialog.style.display = "none";
        html5ks.menu.activeDialog = null;
        html5ks.menu.elements.dialogs.style.display = "none";
        if (html5ks.state.status === "context") {
          html5ks.menu.context(true);
        } else {
          html5ks.elements.gray.style.display = "none";
        }
        e.stopPropagation();
      }, false);

      var close = function () {
        window.close();
        top.open('','_self','');
        top.close();
      };
      ["AppleWebKit", "MSIE", "Trident"].forEach(function (ua) {
        if (navigator.userAgent.indexOf(ua) > -1) {
          var quit = document.getElementsByClassName("quit");
          for (var i = quit.length - 1; i >= 0; i--) {
            quit[i].className = quit[i].className.replace("disabled", "");
            quit[i].addEventListener("click", close, false);
          }
          return false;
        }
      }, this);

      document.getElementById("context-return").addEventListener("click", function () {
        html5ks.menu.context(false);
      }, false);

      document.getElementById("show-image").addEventListener("click", function () {
        html5ks.menu.context(false);
        html5ks.elements.window.style.display = "none";
        html5ks.elements.container.addEventListener("click", function click() {
          this.removeEventListener("click", click, true);
          html5ks.menu.context(true);
        }, true);
      }, false);

      document.getElementById("skip-mode").addEventListener("click", function () {
        html5ks.menu.context(false);
        html5ks.api.speed("skip", true);
        html5ks.next();
      }, false);

      document.getElementById("auto-mode").addEventListener("click", function () {
        html5ks.menu.context(false);
        html5ks.api.speed("auto", true);
        html5ks.next();
      }, false);

      document.getElementById("goto-main-menu").addEventListener("click", function () {
        html5ks.next = function () {};
        html5ks.menu.context(false);
        html5ks.menu.mainMenu();
      }, false);
    },

    initOptions: function () {
      var options = document.getElementsByClassName("option"),
          values = html5ks.persistent;

      if (!html5ks.persistent.scaleAll) {
        document.getElementById("scaleVideo").parentNode.className += " disabled";
      }

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
    },

    init: function () {
      this.initElements();
      this.initEvents();
      this.initOptions();

      this.elements.main.start.addEventListener("click", function () {
        if (this._imachine_loaded) {
          this.elements.mainMenu.style.display = "none";
          html5ks.imachine.start().then(this.mainMenu.bind(this));
        }
      }.bind(this), false);
      html5ks.fetch("imachine").then(function () {
        var start = this.elements.main.start;
        start.className = start.className.replace("disabled", "");
        this._imachine_loaded = true;
      }.bind(this));
    },

    context: function (show) {
      switch (show) {
        case true:
          this._hadWindow = html5ks.elements.window.style.display !== "none";
          html5ks.state.status = "context";
          html5ks.elements.gray.style.display = "block";
          html5ks.elements.window.style.display = "none";
          this.elements.context.style.display = "block";
          break;
        case false:
          html5ks.state.status = "scene";
          html5ks.elements.gray.style.display = "none";
          if (html5ks.state.status === "scene" && this._hadWindow) {
            html5ks.elements.window.style.display = "block";
          }
          this.elements.context.style.display = "none";
          break;
        default:
          this.context(this.elements.context.style.display !== "block");
      }
    }
  };
}());
