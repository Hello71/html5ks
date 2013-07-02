"use strict";
window.html5ks.api = {
  init: function () {
    var chars = html5ks.data.characters;
    for (var ch in chars) {
      var char = chars[ch];
      if (char.name) {
        char.name = this.tag(char.name);
      }
    }
  },
  set_volume: function (volume, delay, channel) {
    var deferred = when.defer(),
        audio = html5ks.elements.audio[channel],
        chg = volume - audio.volume,
        step = chg / (delay * 10);
    var f = setInterval(function () {
      var newv = audio.volume + step;
      if (newv > 1) {
        audio.volume = 1;
        clearInterval(f);
      } else if (newv < 0) {
        audio.volume = 0;
        clearInterval(f);
      } else {
        audio.volume = newv;
      }
    }, 100);
    deferred.resolve();
    return deferred.promise;
  },
  play: function (channel, name, fade) {
    // TODO: fade
    var deferred = when.defer(),
        audio = html5ks.elements.audio[channel];
    audio.src = "dump/" + (channel === "music" ? "bgm/" + html5ks.data.music[name] + ".ogg" : html5ks.data.sfx[name]);
    audio.load();
    audio.volume = fade ? 0 : 1;
    audio.play();
    audio.addEventListener("playing", function playing() {
      audio.removeEventListener("playing", playing, false);
      deferred.resolve();
      if (fade) {
        html5ks.api.set_volume(1, fade, channel);
      }
    }, false);
    audio.addEventListener("error", function error() {
      audio.removeEventListener("error", error, false);
      deferred.reject(this.error);
    }, false);
    return deferred.promise;
  },
  stop: function (channel, fade) {
    if (channel === "all") {
      this.stop("music");
      this.stop("sound");
      return this.stop("ambient");
    }
    var deferred = when.defer(),
        audio = html5ks.elements.audio[channel],
        fadeSet = html5ks.persistent.settings.fade;
    if (fade) {
      this.set_volume(0, fade, channel);
    } else {
      audio.pause();
    }
    deferred.resolve();
    return deferred.promise;
  },

  movie_cutscene: function (vid_src) {
    var deferred = when.defer(),
        video = html5ks.elements.video,
        src = "dump/video/" + vid_src + ".";

    if (Modernizr.video.webm) {
      video.src = src + "webm";
    } else if (Modernizr.video.ogg) {
      video.src = src + "ogg";
    } else if (Modernizr.video.h264) {
      video.src = src + "mp4";
    }

    this.stop("all");

    video.load();
    video.style.display = "block";
    video.play();
    var done = function () {
      this.style.display = "none";
      this.pause();
      deferred.resolve();
    };
    video.addEventListener("click", function (e) {
      if (e.button === 0) {
        done.call(this);
      }
    }, false);
    video.addEventListener("ended", done, false);
    video.addEventListener("error", function () {
      deferred.reject(this.error);
    }, false);
    return deferred.promise;
  },
  act_op: function (this_video) {
    // strip off extension
    return this.movie_cutscene(this_video.slice(0,-4));
  },
  iscene: function (target, is_h, is_end) {
    var deferred = when.defer(),
        label = html5ks.data.script[target],
        i = 0;
    (function run() {
      if (label[i]) {
        html5ks.api.runInst(label[i]).then(run, console.error);
        i++;
      } else {
        deferred.resolve();
      }
    }());
    return deferred.promise;
  },

  with: function (transition, action) {
    return this.runInst(action);
  },

  runInst: function (inst) {
    var cmd = inst[0],
        args = inst.slice(1);
    if (html5ks.data.characters[cmd]) {
      return this.character(cmd, args[0]);
    } else {
      if (this[cmd]) {
        return this[cmd].apply(this, args);
      } else if (/^[A-Z]/.test(cmd)) {
        console.log("cmd starts with caps, probably character");
        return this.character(cmd, args[0]);
      } else {
        console.error("no such cmd " + cmd);
        var deferred = when.defer();
        deferred.resolve();
        return deferred.promise;
      }
    }
  },

  window: function (action, transition) {
    var windw = html5ks.elements.window,
        deferred = when.defer();
    if (action === "show") {
      windw.style.display = "block";
    } else {
      windw.style.display = "none";
    }
    deferred.resolve(action);
    return deferred.promise;
  }, 
  // NOT iscene
  scene: function (type, name) {
    var deferred = when.defer(),
        nom = type;
    if (name) {
      nom = type + "_" + name;
    }
    var img = new Image();
    var image = html5ks.data.images[nom];
    if (!image) {
      var typ = {
        "bg": {dir:"bgs",ext:"jpg"}
      }[type];
      image = typ.dir + "/" + name + "." + typ.ext;
    }
    if (typeof image == "string") {
      if (image.substring(0,1) == "#") {
        html5ks.elements.bg.style.background = image;
        deferred.resolve();
        return deferred.promise;
      } else {
        image = {image: image};
      }
    }
    img.onload = function () {
      console.debug("setting bg " + img.src);
      var bg = html5ks.elements.bg;
      bg.style.background = "url(" + img.src + ") no-repeat 0 0 / cover black";
      deferred.resolve();
    };
    img.onerror = function () {
      throw new Error("bg could not load");
    };
    if (Modernizr.webp) {
      image.image = image.image.replace(/\.[a-z]+$/, ".webp");
    }
    img.src = "dump/" + image.image;
    return deferred.promise;
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
  },

  tag: function (str) {
    var tags = [
      /&/g, "&amp;",
      /</g, "&lt;",
      />/g, "&gt;",
      /{b}/g, "<b>",
      /{\/b}/g, "</b>",
      /{s}/g, "<s>",
      /{\/s}/g, "</s>",
      /{size=(\d*)}/g, "<span style='color: $1'>",
      /{\/size}/g, "</span>",
      /{color=(\d*)}/g, "<span style='color: $1'>",
      /{\/color}/g, "</span>",
      /{w(=\d*\.\d*)?}.*/, "",
      /{nw}/, "",
      /{fast}/, "",
      /\n/g, "<br>"
    ];
    for (var i = 0; i < tags.length - 1; i += 2) {
      str = str.replace(tags[i], tags[i+1]);
    }
    return str;
  },

  nvlsay: function (text) {
    var deferred = when.defer();
    html5ks.elements.nvlsay.innerHTML += "<span class='nvl-block'>" + text + "</span>";
    html5ks.elements.nvlctc.style.display = "block";
    html5ks.next = function () {
      html5ks.elements.nvlctc.style.display = "none";
      deferred.resolve();
      html5ks.next = function () {};
    };
    return deferred.promise;
  },


  character: function (name, str, extend) {
    var deferred = when.defer(),
        text = this.tag(str),
        char = html5ks.data.characters[name],
        w = /{w(=\d*\.\d*)?}/.exec(str);

    if (!char) {
      char = { name: name };
    }
    if (!extend && char.what_prefix) {
      text = char.what_prefix + text;
    }
    if ((!w || !w[1] || extend) && char.what_suffix) {
      text = text + char.what_suffix;
    }

    if (char.kind === "nvl") {
      this.nvlsay(text).then(function () {
        deferred.resolve();
      });
    } else {
      var who = html5ks.elements.who;
      if (!extend) {
        who.innerHTML = char.name;
        if (char.color) {
          who.style.color = char.color;
        } else {
          who.style.color = "#ffffff";
        }
      }

      if (extend) {
        html5ks.elements.say.innerHTML += text;
      } else {
        html5ks.elements.say.innerHTML = text;
      }

      if (w) {
        html5ks.next = function () {
          html5ks.next = function () {};
          html5ks.api.extend(str.substring(w.index + w[0].length)).then(function () {
            deferred.resolve();
          });
        };
        if (w[1]) {
          setTimeout(html5ks.next, parseFloat(w[1].substring(1), 10) * 1000);
          return deferred.promise;
        }
      } else {
        html5ks.next = function () {
          html5ks.elements.ctc.style.display = "none";
          deferred.resolve(text);
          html5ks.next = function () {};
        };
      }
      html5ks.elements.ctc.style.display = "block";
    }
    if (html5ks.state.skip || str.indexOf("{nw}") > -1) {
      html5ks.next();
    } else if (html5ks.state.auto) {
      setTimeout(html5ks.next, 1000 + html5ks.persistent.settings.autospeed * text.length);
    }
    return deferred.promise;
  },

  extend: function (str) {
    return this.character(null, str, true);
  },

  Pause: function (duration) {
    var deferred = when.defer();
    setTimeout(function () {
      deferred.resolve();
    }, duration * 1000);
    return deferred.promise;
  },

  nvl: function (action, transition) {
    var deferred = when.defer(),
        nvl = html5ks.elements.nvl;
    switch (action) {
      case "show":
        nvl.style.display = "block";
        deferred.resolve();
        break;
      case "hide":
        nvl.style.display = "none";
        deferred.resolve();
        break;
      case "clear":
        html5ks.elements.nvlsay.innerHTML = "";
        deferred.resolve();
        break;
      default:
        console.error("no such nvl action " + action);
    }
    return deferred.promise;
  },

  centered: function (text) {
    var deferred = when.defer(),
        centered = document.getElementById("centered");
    centered.innerHTML = this.tag(text);
    html5ks.next = function () {
      centered.innerHTML = "";
      deferred.resolve();
    };
    return deferred.promise;
  },

  menu: function (char, str, choices) {
    var deferred = when.defer();
    this.character(char, str).then(function () {
      var menu = html5ks.elements.choices,
          frag = document.createDocumentFragment(),
          choice = document.createElement("div");

      choice.className = "choice";

      for (var i in choices) {
        choice.innerHTML = i;
        choice.addEventListener("click", function () {
          deferred.resolve(choices[i]);
        }, false);
        frag.appendChild(choice);
        choice = choice.cloneNode(false);
      }

      html5ks.elements.choices.innerHTML = "";
      html5ks.elements.choices.appendChild(frag);
    });
  }
};
