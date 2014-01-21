"use strict";
window.html5ks = {
  data: {},
  persistent: {},
  init: function () {
    var defaultPersistent = {
      version: 0,
      fade: 100,
      gotit: false,
      hdisable: false,
      skipUnread: false,
      skipAfterChoices: false,
      scaleAll: true,
      scaleVideo: true,
      textSpeed: 100,
      autoModeDelay: 0.2,
      musicVolume: 1,
      ambientVolume: 1,
      sfxVolume: 1,
      language: "en"
    };
    try {
      var loaded = localStorage.persistent ? JSON.parse(localStorage.persistent) : {};
    } catch (e) {
      var loaded = {};
    }
    var defProp = function (v) {
      Object.defineProperty(html5ks.persistent, k, {
        get: function () {
          return v;
        },
        set: function (value) {
          v = '' + value;
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
  },
  store: {
    seen_scenes: {},
    attraction: {
      kenji: 0,
      sc: 0,
      hanako: 0
    }
  },
  state: {},
  next: function () {
    var _next = html5ks._next;
    html5ks._next = function () {};
    _next();
  },
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
  initEvents: function () {
    window.onresize = html5ks.scale;
    this.elements.container.addEventListener("mouseup", function (e) {
      if (html5ks.state.status === "scene") {
        switch (e.button) {
          case 0:
            html5ks.api.speed("all", false);
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
  },
  warnUnsupported: function () {
    if (!html5ks.persistent.gotit) {
      var interstitial = document.getElementById("interstitial");
      document.getElementById("gotit").addEventListener("mouseup", function () {
        interstitial.style.mozAnimation = "1s dissolveout";
        interstitial.style.webkitAnimation = "1s dissolveout";
        interstitial.style.animation = "1s dissolveout";
        interstitial.style.opacity = 0;
        html5ks.persistent.gotit = true;
        html5ks.start();
      }, false);
      var warns = document.getElementById("warns").children;
      if (/MSIE/.test(navigator.userAgent)) {
        document.getElementById("ie").style.display = "block";
      }
      if (!Modernizr.audio.opus) {
        document.getElementById("opus").style.display = "block";
      }
      for (var i = 0; i < warns.length; i++) {
        var warn = warns[i];
        if (window.getComputedStyle(warns[i]).getPropertyValue("display") !== "none") {
          warn.style.visibility = "visible";
          return true;
        }
      }
    }
  },
  onload: function () {
    FastClick.attach(document.body);
    this.initElements();
    this.scale();
    this.initEvents();
    if (!this.warnUnsupported()) {
      this.start();
    }
    this.api.init();
    this.menu.init();
    this.i18n.init();
  },
  start: function () {
    this.fetch("json", "script").then(function (d) {
      for (var k in d) {
        if (k.slice(0, 3) === (html5ks.persistent.language === "en" ? "fr_" : "en_")) {
          delete d[k];
        }
      }
    }, console.error);
    html5ks.api.movie_cutscene("4ls", true).then(function () {
      html5ks.menu.mainMenu();
    }, console.error);
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
          xhr.onload = function () {
            var d = JSON.parse(xhr.responseText);
            html5ks.data[name] = d;
            deferred.resolve(d);
          };
          xhr.onerror = function () {
            deferred.reject();
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
