(function () {
  "use strict";
  window.html5ks = {
    data: {
      script: {}
    },
    persistent: {
      seen_scenes: {},
      attraction: {
        kenji: 0,
        sc: 0,
        hanako: 0
      },
      hdisabled: false,
      settings: {
        // ms per character
        autospeed: 20,
        fade: 100,
        gotit: false,
        scale: true
      }
    },
    state: {
      auto: false
    },
    initElements: function () {
      this.elements = {
        container: document.getElementById("container"),
        video: document.getElementById("vid"),
        audio: {
          music: new Audio(),
          ambient: new Audio(),
          sound: new Audio()
        },
        who: document.getElementById("who"),
        say: document.getElementById("say"),
        bg: document.getElementById("bg"),
        window: document.getElementById("window")
      };
      this.elements.audio.music.loop = true;
      this.elements.audio.ambient.loop = true;
    },
    load: function () {
      if (localStorage.persistent) this.persistent = JSON.parse(localStorage.persistent);
    },
    save: function () {
      localStorage.persistent = JSON.stringify(this.persistent);
    },
    scale: function () {
      if (html5ks.persistent.settings.scale) {
        var newScale = 1;
        var height = document.documentElement.clientHeight,
            width = document.documentElement.clientWidth;
        if (height / width <= 0.75) { // widescreen
          newScale = height / 600;
        } else {
          newScale = width / 800;
        }

        var container = html5ks.elements.container;
        container.style.webkitTransform = "scale(" + newScale + ")";
        container.style.mozTransform = "scale(" + newScale + ")";
        container.style.transform = "scale(" + newScale + ")";

        var applyScale = function (el, scale) {
          el.style.height = scale * 600 + "px";
          el.style.marginTop = "-" + scale * 300 + "px";
          el.style.width = scale * 800 + "px";
          el.style.marginLeft = "-" + scale * 400 + "px";
        };

        applyScale(html5ks.elements.bg, newScale);
        applyScale(html5ks.elements.video, newScale);
      }
    },
    next: function () {},
    initEvents: function () {
      window.addEventListener("resize", html5ks.scale, false);
      this.elements.container.addEventListener("mouseup", function () {
        html5ks.next();
      }, false);
      var deselect = function () {
        window.getSelection().collapse(this, 0);
      };
      document.body.addEventListener("mousemove", deselect, true);
      document.body.addEventListener("mouseup", deselect, true);
      document.body.addEventListener("keyup", deselect, true);
    },
    warnUnsupported: function () {
      if (!html5ks.persistent.settings.gotit) {
        var warn = document.getElementById("warn-container");
        document.getElementById("gotit").addEventListener("mouseup", function () {
          warn.style.mozAnimation = "0.5s dissolveout";
          warn.style.webkitAnimation = "0.5s dissolveout";
          warn.style.animation = "0.5s dissolveout";
          warn.style.opacity = 0;
          html5ks.persistent.settings.gotit = true;
          html5ks.start();
        }, false);
        var warns = document.getElementById("warns").children;
        if (/MSIE/.test(navigator.userAgent)) {
          document.getElementById("ie").style.display = "block";
        }
        if (!(/Firefox/.test(navigator.userAgent))) {
          document.getElementById("html-svg-filter").style.display = "block";
        }
        for (var i = 0; i < warns.length; i++) {
          if (window.getComputedStyle(warns[i]).getPropertyValue("display") !== "none") {
            warn.style.visibility = "visible";
            return true;
          }
        }
      }
    },
    onload: function () {
      this.initElements();
      this.load();
      this.scale();
      this.initEvents();
      if (!this.warnUnsupported()) {
        this.start();
      }
      this.menu.init();
    },
    start: function () {
      this.fetch("script", "a1-monday").then(function () {
        html5ks.api.movie_cutscene("4ls").then(function () {
          html5ks.menu.mainMenu();
        });
      });
    },
    fetch: function (type, name) {
      var deferred = when.defer();
      var xhr = new XMLHttpRequest();
      switch (type) {
        case "script":
          var script = html5ks.data.script;
          if (script[name]) {
            deferred.resolve();
          } else {
            xhr.open("GET", "scripts/script-" + name + ".json");
            xhr.onreadystatechange = function () {
              script[name] = true;
              if (xhr.readyState === 4) {
                var resp = JSON.parse(xhr.responseText);
                for (var label in resp) {
                  script[label] = resp[label];
                }
                deferred.resolve();
              }
            };
            xhr.send();
          }
          break;
        case "imachine":
          xhr.open("GET", "scripts/imachine.json");
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              html5ks.data.imachine = JSON.parse(xhr.responseText);
              deferred.resolve();
            }
          };
          xhr.send();
          break;
        default:
          throw new Error("fetchtype " + type + " not implemented");
      }
      return deferred.promise;
    }
  };
  document.addEventListener("DOMContentLoaded", function () {
    html5ks.onload();
  }, false);
}());
