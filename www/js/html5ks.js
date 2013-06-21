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
      fade: 100
    }
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
      music: new Audio(),
      ambient: new Audio(),
      sound: new Audio()
    },
    say: document.getElementById("say"),
    img: {
      bg: document.getElementById("bg"),
      solid: document.getElementById("solid")
    }
  },
  seen_scene: function (scene) {
    return !!this.persistent.seen_scenes[scene];
  },
  scene_register: function (scene) {
    this.persistent.seen_scenes.scene = true;
  },
  fading: function (audio, dir, fade) {
    var fadeSet = html5ks.persistent.settings.fade,
        step = fadeSet / (fade * 1000),
        over = audio.volume + step * dir;
    console.log(arguments);
    if (over > 1) {
      audio.volume = 1;
    } else if (over < 0) {
      audio.volume = 0;
    } else {
      audio.volume += step * dir;
      setTimeout(function () {
        html5ks.fading(audio, dir, fade);
      }, fadeSet);
    }
  },
  play: function (channel, name, fade) {
    // TODO: fade
    var deferred = when.defer(),
        audio = this.elements.audio[channel];
    audio.src = "/dump/" + (channel === "music" ? "bgm/" + this.music[name] + ".ogg" : this.sfx[name]);
    audio.load();
    if (fade) {
      audio.volume = 0;
    }
    audio.play();
    audio.addEventListener("playing", function () {
      deferred.resolve(this);
      html5ks.fading(audio, 1, fade);
    }, false);
    audio.addEventListener("error", function () {
      deferred.reject(this.error);
    }, false);
    return deferred.promise;
  },
  stop: function (channel, fade) {
    var deferred = when.defer(),
        audio = this.elements.audio[channel],
        fadeSet = html5ks.persistent.settings.fade;
    if (fade) {
      html5ks.fading(audio, -1, fade);
    } else {
      audio.pause();
    }
    deferred.resolve();
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
  imageTypes: {
    "bg": {dir:"bgs",ext:"jpg"}
  },
  // NOT iscene
  scene: function (type, name) {
    var deferred = when.defer(),
        nom = type;
    if (name) {
      nom = type + "_" + name;
    }
    var bg = this.elements.img.bg;
    var image = this.images[nom];
    if (!image) {
      var typ = this.imageTypes[type];
      image = typ.dir + "/" + name + "." + typ.ext;
    }
    this.elements.img.solid.style.backgroundColor = '';
    if (typeof image == "string") {
      if (image.substring(0,1) == "#") {
        this.elements.img.solid.style.backgroundColor = image;
        deferred.resolve();
        return deferred.promise;
      } else {
        image = {image: image};
      }
    }
    bg.onload = function () {
      deferred.resolve(this);
    };
    bg.onerror = function () {
      throw new Error("bg could not load");
    };
    bg.src = "/dump/" + image.image;
    return deferred.promise;
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
    this.elements.container.style.webkitTransform = "scale(" + newScale + ")";
    this.elements.container.style.mozTransform = "scale(" + newScale + ")";
    this.elements.container.style.transform = "scale(" + newScale + ")";
  },
  next: function () {},
  loadChars: function () {
    for (var character in this.characters) {
      this[character] = function (text) {
        var deferred = when.defer();
        this.elements.say.textContent = text;
        this.next = function () {
          deferred.resolve(text);
          this.next = function () {};
        };
        setTimeout(this.next, 1000 + this.persistent.settings.autospeed * text.length);
        return deferred.promise;
      };
    }
  },
  onload: function () {
    this.load();
    this.scale();
    window.addEventListener("resize", function () {
      html5ks.scale();
    }, false);
    this.loadChars();
    this.elements.container.addEventListener("mouseup", function () {
      html5ks.next();
    }, false);
    en_NOP1();
  },
  show: function () {
    var deferred = when.defer();
    deferred.resolve();
    return deferred.promise;
  },
  hide: function () {
    var deferred = when.defer();
    deferred.resolve();
    return deferred.promise;
  }
};
document.addEventListener("DOMContentLoaded", function () {
  html5ks.onload();
}, false);
}());
