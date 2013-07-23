"use strict";
window.html5ks = {
  data: {
    script: {}
  },
  persistent: {
    seen_scenes: {},
    settings: {
      fade: 100,
      gotit: false,
      hdisable: false,
      skipUnread: false,
      skipAfterChoices: false,
      useWebP: null,
      fullscreen: false,
      scaleAll: true,
      scaleVideo: true,
      textSpeed: 0.5,
      autoModeDelay: 0.2,
      musicVolume: 1,
      sfxVolume: 1,
      language: "en"
    }
  },
  store: {
    seen_scenes: {},
    attraction: {
      kenji: 0,
      sc: 0,
      hanako: 0
    },
  },
  state: {},
  next: function () {},
  initElements: function () {
    this.elements = {
      all: document.getElementById("all"),
      container: document.getElementById("container"),
      video: document.getElementById("vid"),
      audio: {
        music: new Audio(),
        ambient: new Audio(),
        sound: new Audio()
      },
      who: document.getElementById("who"),
      say: document.getElementById("say"),
      window: document.getElementById("window"),
      ctc: document.getElementById("ctc"),
      nvl: document.getElementById("nvl"),
      nvlsay: document.getElementById("nvlsay"),
      nvlctc: document.getElementById("nvlctc"),
      choices: document.getElementById("choices"),
      show: document.getElementById("show")
    };
  },
  load: function () {
    if (localStorage.persistent) {
      this.persistent = JSON.parse(localStorage.persistent);
      this.loaded = true;
    }
  },
  save: function () {
    localStorage.persistent = JSON.stringify(this.persistent);
  },
  scale: function () {
    if (html5ks.persistent.settings.scaleAll) {
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
      if (container.className.indexOf("scale") === -1) {
        container.className += " scale";
      }

      var applyScale = function (el, scale) {
        el.style.height = scale * 600 + "px";
        el.style.marginTop = "-" + scale * 300 + "px";
        el.style.width = scale * 800 + "px";
        el.style.marginLeft = "-" + scale * 400 + "px";
        if (el.className.indexOf("scale") === -1) {
          el.className += " scale";
        }
      };

      if (html5ks.persistent.settings.scaleVideo) {
        applyScale(html5ks.elements.video, newScale);
      }
    }
  },
  fullscreen: function () {
    var all = html5ks.elements.all;
    if (all.requestFullscreen) {
      all.requestFullscreen();
    } else if (all.mozRequestFullScreen) {
      all.mozRequestFullScreen();
    } else if (all.webkitRequestFullscreen) {
      all.webkitRequestFullscreen();
    }
  },
  initEvents: function () {
    window.onresize = html5ks.scale;
    this.elements.container.addEventListener("mouseup", function () {
      html5ks.next();
    }, false);
    window.addEventListener("dragstart", function (e) {
      e.preventDefault();
    }, false);
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
    this.api.init();
    this.menu.init();
    if (this.persistent.settings.fullscreen) {
      document.body.addEventListener("click", function onclick() {
        this.removeEventListener("click", onclick, false);
        html5ks.fullscreen();
      }, false);
    }
  },
  winload: function () {
    if (!this.loaded) {
      this.persistent.settings.useWebP = Modernizr.webp;
    }
    if (!Modernizr.webp && this.persistent.settings.useWebP) {
      var webpjs = document.createElement("script");
      webpjs.src = "js/webpjs-0.0.2.min.js";
      document.head.appendChild(webpjs);
    }
  },
  start: function () {
    this.fetch("script", "a1-monday").then(function () {
      html5ks.api.movie_cutscene("4ls", true).then(function () {
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
window.addEventListener("onload", function () {
  html5ks.winload();
}, false);
