(function () {
  "use strict";
  html5ks.menu = {
    mainMenu: function () {
      html5ks._next = function () {};
      this.context(false);
      html5ks.api.stop("all");
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
          retn: document.getElementById("return")
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
          case "musicVolume":
          case "soundVolume":
            html5ks.api.set_volume(target.value, 0, target.id.replace("Volume", ""));
            break;
        }
      };

      options[0].parentNode.parentNode.addEventListener("change", change, false);
      options[0].parentNode.parentNode.addEventListener("input", change, false);

      var optionsButton = document.getElementsByClassName("options-button");

      var showOptions = function (e) {
        html5ks.menu.dialog("options");
        e.stopPropagation();
      };

      for (var i = optionsButton.length - 1; i >= 0; i--) {
        optionsButton[i].addEventListener("click", showOptions, false);
      }

      this.elements.dialog.retn.addEventListener("click", function (e) {
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

      // quit
      var close = function () {
        window.close();
        top.open('','_self','');
        top.close();
      };
      ["AppleWebKit", "MSIE", "Trident"].forEach(function (ua) {
        if (navigator.userAgent.indexOf(ua) > -1) {
          var quit = document.getElementsByClassName("quit");
          for (var i = quit.length - 1; i >= 0; i--) {
            quit[i].classList.remove("disabled");
            quit[i].addEventListener("click", close, false);
          }
          return false;
        }
      }, this);

      // context menu
      html5ks.elements.container.addEventListener("contextmenu", function (e) {
        switch (html5ks.state.status) {
          case "scene":
          case "context":
            this.context();
            e.stopPropagation();
        }
        e.preventDefault();
      }.bind(this), true);

      var contextButtonFactory = function (id, fn, nooff) {
        document.getElementById(id).addEventListener("click", function (e) {
          if (!nooff) html5ks.menu.context(false);
          if (fn) fn(e);
        }, false);
      };

      contextButtonFactory("context-return");

      contextButtonFactory("show-image", function () {
        html5ks.menu.context("showImage");
        var done = function () {
          this.removeEventListener("click", done, true);
          html5ks.menu.context(true);
        };
        html5ks.elements.container.addEventListener("click", done, true);
      }, true);

      contextButtonFactory("skip-mode", function () {
        html5ks.api.speed("skip", true);
        html5ks.next();
      });

      contextButtonFactory("auto-mode", function () {
        html5ks.api.speed("auto", true);
        html5ks.next();
      });

      contextButtonFactory("goto-main-menu", function () {
        html5ks.menu.mainMenu();
      });
    },

    initOptions: function () {
      var options = document.getElementsByClassName("option"),
          values = html5ks.persistent;

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

      when.all([html5ks.fetch("json", "imachine"),
                html5ks.fetch("json", "script").then(function (d) {
                  for (var k in d) {
                    if (k.slice(0, 3) === (html5ks.persistent.language === "en" ? "fr_" : "en_")) {
                      delete d[k];
                    }
                  }
                }, console.error)]).then(function () {
                  var start = this.elements.main.start;
                  start.addEventListener("click", function () {
                    this.elements.mainMenu.style.display = "none";
                    html5ks.imachine.start().then(this.mainMenu.bind(this), console.error);
                  }.bind(this), false);
                  start.classList.remove("disabled");
                }.bind(this), console.error);
    },

    _state: null,

    context: function (show) {
      switch (show) {
        case true:
          // return early if context already on
          if (this.context("status")) return;
          this._state = this._state || {
            window: html5ks.state.window,
            nvl: html5ks.state.nvl,
            status: html5ks.state.status
          };
          html5ks.api.window("hide");
          html5ks.api.nvl("hide");
          html5ks.state.status = "context";
          html5ks.elements.gray.style.display = "block";
          this.elements.context.style.display = "block";
          break;
        case "showImage":
          this.elements.context.style.display = "none";
          html5ks.elements.gray.style.display = "none";
          /* falls through */
        case false:
          if (!this._state) return;
          html5ks.api.window(this._state.window);
          html5ks.api.nvl(this._state.nvl);
          html5ks.state.status = this._state.status;
          break;
        case "status":
          return this.elements.context.style.display === "block";
        default:
          this.context(!this.context("status"));
      }
    }
  };
}());
