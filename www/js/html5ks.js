(function () {
  "use strict";
  window.html5ks = {
    data: {
      scripts: {}
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
        img: {
          bg: document.getElementById("bg"),
          solid: document.getElementById("solid")
        },
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
      var newScale = 1;
      if (html5ks.persistent.settings.scale) {
        var height = document.documentElement.clientHeight,
            width = document.documentElement.clientWidth;
        if (height / width <= 0.75) { // widescreen
          newScale = height / 600;
        } else {
          newScale = width / 800;
        }
      } else {
        newScale = 1;
      }
      html5ks.elements.container.style.webkitTransform = "scale(" + newScale + ")";
      html5ks.elements.container.style.mozTransform = "scale(" + newScale + ")";
      html5ks.elements.container.style.transform = "scale(" + newScale + ")";
    },
    next: function () {},
    initEvents: function () {
      window.addEventListener("resize", html5ks.scale, false);
      this.elements.container.addEventListener("mouseup", function () {
        html5ks.next();
      }, false);
    },
    warnUnsupported: function () {
      if (!html5ks.persistent.settings.gotit) {
        if (!(/Firefox/.test(navigator.userAgent))) {
          document.getElementById("html-svg-filter").style.display = "block";
        }
        var warn = document.getElementById("warn-container");
        document.getElementById("gotit").addEventListener("mouseup", function () {
          warn.style.mozAnimation = "0.5s dissolveout";
          warn.style.webkitAnimation = "0.5s dissolveout";
          warn.style.animation = "0.5s dissolveout";
          warn.style.opacity = 0;
          html5ks.persistent.settings.gotit = true;
        }, false);
        var warns = document.getElementById("warns").children;
        for (var i = 0; i < warns.length; i++) {
          if (window.getComputedStyle(warns[i]).getPropertyValue("display") !== "none") {
            warn.style.visibility = "visible";
          }
        }
      }
    },
    onload: function () {
      this.initElements();
      this.load();
      this.scale();
      this.initEvents();
      this.warnUnsupported();
    },
    winload: function () {
      this.fetch("script", "a1-monday").then(function () {
        html5ks.api.runScript(html5ks.data.scripts["a1-monday"].en_NOP1)
      });
      this.elements.img.bg.src = "";
    },
    fetch: function (type, name) {
      var deferred = when.defer();
      switch (type) {
        case "script":
          var scripts = html5ks.data.scripts;
          if (typeof scripts[name] === "object") {
            deferred.resolve();
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/scripts/script-" + name + ".json");
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                scripts[name] = JSON.parse(xhr.responseText);
                deferred.resolve();
              }
            };
            xhr.send();
          }
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
  window.addEventListener("load", function () {
    html5ks.winload();
  }, false);
}());
