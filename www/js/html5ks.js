"use strict";
window.html5ks = {
  data: {
    script: {}
  },
  persistent: {},
  init: function () {
    var defaultPersistent = {
      version: 0,
      fade: 100,
      gotit: false,
      hdisable: false,
      skipUnread: false,
      skipAfterChoices: false,
      useWebP: false,
      fullscreen: false,
      scaleAll: true,
      scaleVideo: true,
      textSpeed: 0.5,
      autoModeDelay: 0.2,
      musicVolume: 1,
      ambientVolume: 1,
      soundVolume: 1,
      language: "en"
    };
    var loaded = localStorage.persistent ? JSON.parse(localStorage.persistent) : {};
    html5ks.state._loaded = typeof loaded.version !== undefined;
    var defProp = function (v) {
      Object.defineProperty(html5ks.persistent, k, {
        get: function () {
          return v;
        },
        set: function (value) {
          v = value;
          localStorage.persistent = JSON.stringify(html5ks.persistent);
        },
        enumerable: true
      });
    };
    for (var k in defaultPersistent) {
      defProp(typeof loaded[k] === "undefined" ? defaultPersistent[k] : loaded[k]);
    }

    document.addEventListener("DOMContentLoaded", function () {
      html5ks.onload();
    }, false);

    if (html5ks.state._loaded) {
      var img = new Image();
      img.onload = function () {
        html5ks.persistent.useWebP = img.width === 4;
      };
      img.src = 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAAAQAgCdASoEAAQAAAcIhYWIhYSIgIIADA1gAAUAAAEAAAEAAP7%2F2fIAAAAA';
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
      gray: document.getElementById("gray"),
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
  scale: function () {
    var newScale = 1;
    if (html5ks.persistent.scaleAll) {
      var height = document.documentElement.clientHeight,
          width = document.documentElement.clientWidth;
      if (height / width <= 0.75) { // widescreen
        newScale = height / 600;
      } else {
        newScale = width / 800;
      }
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

    if (html5ks.persistent.scaleVideo) {
      applyScale(html5ks.elements.video, newScale);
    }
  },
  fullscreen: function (onoff) {
    if (onoff !== false) {
      var all = html5ks.elements.all;
      if (all.requestFullscreen) {
        all.requestFullscreen();
      } else if (all.mozRequestFullScreen) {
        all.mozRequestFullScreen();
      } else if (all.webkitRequestFullscreen) {
        all.webkitRequestFullscreen();
      } else {
        return false;
      }
    } else {
      if (document.requestFullscreen) {
        document.requestFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullscreen) {
        document.webkitCancelFullscreen();
      } else {
        return false;
      }
    }
    return true;
  },
  initEvents: function () {
    window.onresize = html5ks.scale;
    this.elements.container.addEventListener("mouseup", function (e) {
      if (html5ks.state.status === "scene") {
        html5ks.api.speed("skip", false);
        html5ks.api.speed("auto", false);
        switch (e.button) {
          case 0:
            html5ks.next();
            break;
          case 1:
            html5ks.menu.showImage();
            break;
        }
      }
    }, false);
    window.addEventListener("dragstart", function (e) {
      e.preventDefault();
    }, false);
    if (html5ks.persistent.fullscreen) {
      window.addEventListener("click", function click() {
        window.removeEventListener("click", click, false);
        html5ks.fullscreen();
      }, false);
    }
    var fullscreenchange = function () {
      if (!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement)) {
        html5ks.persistent.fullscreen = false;
        document.getElementById("fullscreen").checked = false;
      }
    };
    document.addEventListener("mozfullscreenchange", fullscreenchange, false);
    document.addEventListener("webkitfullscreenchange", fullscreenchange, false);
    document.addEventListener("fullscreenchange", fullscreenchange, false);
  },
  warnUnsupported: function () {
    if (!html5ks.persistent.gotit) {
      var warn = document.getElementById("warn-container");
      document.getElementById("gotit").addEventListener("mouseup", function () {
        warn.style.mozAnimation = "0.5s dissolveout";
        warn.style.webkitAnimation = "0.5s dissolveout";
        warn.style.animation = "0.5s dissolveout";
        warn.style.opacity = 0;
        html5ks.persistent.gotit = true;
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
    this.scale();
    this.initEvents();
    if (!this.warnUnsupported()) {
      this.start();
    }
    this.api.init();
    this.menu.init();
    if (this.persistent.fullscreen) {
      document.body.addEventListener("click", function onclick() {
        this.removeEventListener("click", onclick, false);
        html5ks.fullscreen();
      }, false);
    }
    this.i18n.init();
  },
  start: function () {
    this.fetch("json", "script").then(function () {
      html5ks.api.movie_cutscene("4ls", true).then(function () {
        html5ks.menu.mainMenu();
      });
    });
  },
  fetch: function (type, name) {
    var deferred = when.defer();
    var xhr = new XMLHttpRequest();
    switch (type) {
      case "json":
        if (html5ks.data[name]) {
          deferred.resolve();
        } else {
          xhr.open("GET", "json/" + name + ".json");
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              html5ks.data[name] = JSON.parse(xhr.responseText);
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
html5ks.init();
