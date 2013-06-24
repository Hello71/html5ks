(function () {
  "use strict";
  window.html5ks = {
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
        gotit: false
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
      var height = document.documentElement.clientHeight,
          width = document.documentElement.clientWidth,
          newScale = 1;
      if (height / width <= 0.75) { // widescreen
        newScale = height / 600;
      } else {
        newScale = width / 800;
      }
      html5ks.elements.container.style.webkitTransform = "scale(" + newScale + ")";
      html5ks.elements.container.style.mozTransform = "scale(" + newScale + ")";
      html5ks.elements.container.style.transform = "scale(" + newScale + ")";
    },
    next: function () {},
    loadChars: function () {
      for (var character in this.characters) {
      }
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
    initEvents: function () {
      window.addEventListener("resize", html5ks.scale, false);
      this.elements.container.addEventListener("mouseup", function () {
        html5ks.next();
      }, false);
    },
    onload: function () {
      this.initElements();
      this.loadChars();
      this.load();
      this.scale();
      this.initEvents();
      this.warnUnsupported();
    },
    winload: function () {
      this.elements.img.bg.src = "";
    }
  };
  window.html5ks.data = {};
  document.addEventListener("DOMContentLoaded", function () {
    html5ks.onload();
  }, false);
  window.addEventListener("load", function () {
    html5ks.winload();
  }, false);
}());
