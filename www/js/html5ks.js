(function () {
"use strict";
window.html5ks = {
  STUB: function (fn) {
    return console.log("STUB: " + fn);
  },
  WARN: function (msg) {
    return console.log("WARN: " + msg);
  },
  persistent: {
    seen_scenes: {},
    attraction: {
      kenji: 0,
      sc: 0,
      hanako: 0
    },
    hdisabled: false
  },
  save: function () {
    localStorage.persistent = JSON.stringify(this.persistent);
  },
  load: function () {
    if (localStorage.persistent) this.persistent = JSON.parse(localStorage.persistent);
  },
  elements: {
    container: document.getElementById("container"),
    video: document.getElementById("video"),
    audio: {
      music: document.getElementById("music"),
      ambient: document.getElementById("ambient"),
      sound: document.getElementById("sound")
    },
    say: document.getElementById("say")
  },
  seen_scene: function (scene) {
    return !!this.persistent.seen_scenes[scene];
  },
  scene_register: function (scene) {
    this.persistent.seen_scenes.scene = true;
  },
  play: function (channel, name, fade) {
    if (fade) this.WARN("fade not implemented");
    var deferred = when.defer(),
        audio = this.elements.audio[channel];
    audio.src = "/dump/" + (channel === "music" ? "bgm/" + this.music[name] + ".ogg" : this.sfx[name]);
    audio.load();
    audio.play();
    if (channel !== "music") {
      audio.addEventListener("ended", function () {
        deferred.resolve(this);
      }, false);
    } else {
      audio.addEventListener("playing", function () {
        deferred.resolve(this);
      }, false);
    }
    audio.addEventListener("error", function () {
      deferred.reject(this.error);
    }, false);
    return deferred.promise;
  },
  play_video: function (vid_src) {
    var deferred = when.defer(),
        video = this.elements.video;
    video.src = "/dump/video/" + vid_src + ".webm";
    video.load();
    video.play();
    video.addEventListener("ended", function () {
      deferred.resolve(this);
    }, false);
    video.addEventListener("error", function () {
      deferred.reject(this.error);
    }, false);
    return deferred.promise;
  },
  act_op: function (this_video) {
    // strip off extension
    return this.play_video(this_video.slice(0,-4));
  },
  iscene: function (target, is_h, is_end) {
    this.scene_register(target);
    return window.script[target]();
  },
  window: function (action, transition) {
    var deferred = when.defer();
    setTimeout(function () {
      deferred.resolve(action);
    }, 100);
    return deferred.promise;
  },
  sceneTypes: {
    "ev": "event",
    "evh": "event",
    "ovl": "event",
    "bg": "bgs",
    "": "vfx"
  },
  // NOT iscene
  scene: function (type, name) {
    var deferred = when.defer();
    if (typeof name == "undefined") name = type;
    var bg = document.getElementById("bg");
    if (name == "black") {
      bg.src = "";
      bg.style.background = "black";
      deferred.resolve(this);
      return deferred.promise;
    }
    this.WARN("don't know extension, trying all");
    var img = "/dump/" + this.sceneTypes[type] + "/" + name;
    bg.onerror = function () {
      bg.onerror = function () {
        bg.onerror = function () {
          deferred.reject(this.error);
        };
        bg.src = img + ".jpg";
      };
      bg.src = img + ".png";
    };
    bg.onload = function () {
      deferred.resolve(this);
    };
    bg.src = img + ".webp";
    return deferred.promise;
  },
  scale: function () {
    var newScale = 1,
        height = document.documentElement.clientHeight,
        width = document.documentElement.clientWidth;
    if (height / width <= 0.75) { // widescreen
      newScale = height / 600;
    } else {
      newScale = width / 800;
    }
    this.elements.container.style.transform = "scale(" + newScale + ")";
  },
  loadChars: function () {
    for (var character in this.characters) {
      this[character] = function (text) {
        var deferred = when.defer();
        this.elements.say.textContent = text;
        setTimeout(function () {
          deferred.resolve(text);
        }, 1000);
        return deferred.promise;
      };
    };
  },
  onload: function () {
    this.load();
    this.scale();
    window.addEventListener("resize", function () {
      html5ks.scale();
    }, false);
    this.loadChars();
  }
};
document.addEventListener("DOMContentLoaded", function () {
  html5ks.onload();
}, false);
}());
