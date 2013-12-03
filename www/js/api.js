"use strict";
window.html5ks.api = {
  init: function () {
    var chrs = html5ks.data.characters;
    for (var ch in chrs) {
      var chr = chrs[ch];
      if (chr.name) {
        chr.name = this.tag(chr.name);
      }
    }
  },

  _fading: {},

  set_volume: function (target, delay, channel) {
    var deferred = when.defer(),
        audio = html5ks.elements.audio[channel],
        step = (target - audio.volume) / (delay * 20);
    if (!delay) {
      audio.volume = target;
    } else {
      this._fading[channel] = setInterval(function () {
        // clamp new volume 0-1
        audio.volume = Math.min(Math.max(audio.volume + step, 0), 1);
        if (audio.volume === 0 || audio.volume === 1) {
          clearInterval(this._fading);
        }
      }.bind(this), 50);
    }
    deferred.resolve();
    return deferred.promise;
  },

  play: function (channel, name, ignore, fade) {
    this.stop(channel);
    var deferred = when.defer(),
        audio = html5ks.elements.audio[channel];
    if (channel === "music" || channel === "ambient") {
      audio.loop = true;
    }
    html5ks.elements.audio[channel] = audio;

    var src = "dump/";

    switch (channel) {
      case "music":
        src += "bgm/" + html5ks.data.music[name];
        break;
      case "ambient":
      case "sound":
        src += "sfx/" + html5ks.data.sfx[name];
    }

    ["opus", "ogg", "m4a", "wav"].some(function (type) {
      if (Modernizr.audio[type]) {
        audio.src = src + "." + type;
        return true;
      }
    });

    audio.load();
    var volume = html5ks.persistent[channel + "Volume"];
    audio.volume = fade ? 0 : volume;
    audio.play();
    audio.addEventListener("playing", function playing() {
      audio.removeEventListener("playing", playing, false);
      if (fade) {
        html5ks.api.set_volume(volume, fade, channel);
      }
      deferred.resolve();
    }, false);
    audio.onerror = function () {
      throw new Error();
    };
    return deferred.promise;
  },

  stop: function (channel, ignore, fade) {
    if (channel === "all") {
      this.stop("music", ignore, fade);
      this.stop("sound", ignore, fade);
      return this.stop("ambient", ignore, fade);
    }
    var deferred = when.defer(),
        audio = html5ks.elements.audio[channel];
    if (this._fading[channel]) {
      clearInterval(this._fading[channel]);
    }
    if (fade) {
      this.set_volume(0, fade, channel);
    } else {
      audio.pause();
    }
    deferred.resolve();
    return deferred.promise;
  },


  movie_cutscene: function (vid_src, skippable) {
    var deferred = when.defer(),
        video = html5ks.elements.video,
        src = "dump/video/" + vid_src + ".";

    this.stop("all");
    this.speed("auto", false);
    this.speed("skip", false);

    var types = {
      "webm": "webm",
      "ogg": "ogv",
      "h264": "mp4",
    };
    for (var type in types) {
      if (Modernizr.video[type]) {
        video.src = src + types[type];
        break;
      }
    }

    video.load();
    video.style.display = "block";
    video.volume = html5ks.persistent.musicVolume;
    video.play();
    var done = function () {
      video.style.display = "none";
      video.pause();
      deferred.resolve();
    };
    document.addEventListener("keyup", function keyupListener(e) {
      document.removeEventListener("keyup", keyupListener, false);
      if (e.keyCode === 27) {
        done();
        e.preventDefault();
      }
    }, false);
    video.onclick = function (e) {
      if (e.button === 0 && skippable) {
        done();
      }
    };
    video.onended = done;
    video.onerror = function () {
      deferred.reject(this.error);
    };
    return deferred.promise;
  },

  act_op: function (this_video) {
    // strip off extension
    return this.movie_cutscene(this_video.slice(0,-4));
  },


  iscene: function (target, is_h, is_end) {
    html5ks.state.status = "scene";
    var deferred = when.defer(),
        label = html5ks.data.script[html5ks.persistent.language + "_" + target],
        i = 0;
    (function run(ret) {
      if (label[i]) {
        html5ks.api.runInst(label[i]).then(run, console.error);
        i++;
      } else {
        deferred.resolve(ret);
      }
    }());
    return deferred.promise;
  },


  runInst: function (inst) {
    var cmd = inst[0].replace(/"/g, ''),
        args = inst.slice(1);
    if (html5ks.data.characters[cmd]) {
      return this.say(cmd, args[0]);
    } else {
      if (this[cmd]) {
        return this[cmd].apply(this, args);
      } else if (inst.length === 1) {
        return this.say("name_only", cmd);
      } else if (/^[A-Z]/.test(cmd)) {
        return this.say(cmd, args[0]);
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
    switch (action) {
      case "show":
        windw.style.display = "block";
        break;
      case "hide":
        windw.style.display = "none";
        break;
      default:
        return windw.style.display !== "none";
    }
    deferred.resolve(action);
    return deferred.promise;
  },


  scene: function () {
    html5ks.elements.show.innerHTML = "";
    return this.show.apply(this, arguments);
  },


  show: function (name, type, location) {
    var deferred = when.defer();
    var lookup = document.getElementById(name),
        el = lookup || document.createElement("img");
    if (!location && !lookup) location = "center";
    el.onload = function () {
      if (location) {
        // calculate position
        // we don't actually know how big the image is till we fetch it
        var positions = {
          left: { xpos: 0.0, xanchor: 0.0, ypos: 1.0, yanchor: 1.0 },
          right: { xpos: 1.0, xanchor: 1.0, ypos: 1.0, yanchor: 1.0 },
          center: { xpos: 0.5, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          truecenter: { xpos: 0.5, xanchor: 0.5, ypos: 0.5, yanchor: 0.5 },
          topleft: { xpos: 0.0, xanchor: 0.0, ypos: 0.0, yanchor: 0.0 },
          topright: { xpos: 1.0, xanchor: 1.0, ypos: 0.0, yanchor: 0.0 },
          top: { xpos: 0.5, xanchor: 0.5, ypos: 0.0, yanchor: 0.0 },
          twoleft: { xpos: 0.3, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          tworight: { xpos: 0.7, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          closeleft: { xpos: 0.25, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          closeright: { xpos: 0.75, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          twoleftoff: { xpos: 0.32, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          tworightoff: { xpos: 0.68, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          centeroff: { xpos: 0.52, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          bgleft: { xpos: 0.4, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 },
          bgright: { xpos: 0.6, xanchor: 0.5, ypos: 1.0, yanchor: 1.0 }
        };
        var pos = positions[location];
        // TODO: implement transitions
        if (pos) {
          el.style.left = pos.xpos * 800 + "px";
          el.style.top = pos.ypos * 600 + "px";
          el.style.marginLeft = "-" + pos.xanchor * el.width + "px";
          el.style.marginTop = "-" + pos.yanchor * el.height + "px";
        }
        el.style.display = "block";
      }
      deferred.resolve();
    };
    el.onerror = function () {
      deferred.resolve();
    };
    var nom = name;
    if (type && type !== "None") {
      nom = name + "_" + type;
    }
    var image = html5ks.data.images[nom];
    switch (typeof image) {
      case "string":
        if (image.substring(0, 1) === "#") {
          el = document.createElement("div");
          el.style.backgroundColor = image;
          el.style.height = "100%";
          html5ks.elements.show.appendChild(el);
          deferred.resolve();
          return deferred.promise;
        }
        break;
      case "undefined":
        switch (name) {
          case "bg":
            image = "bgs/" + type + ".jpg";
            break;
          case "url":
            name = type;
            image = type;
            break;
          default:
            image = "sprites/" + name + "/" + (type && type.indexOf("_close") > -1 ? "close/" : "") + name + "_" + type + ".png";
        }
    }
    if (typeof image === "string") {
      image = {image: image};
    }
    var src = "";
    if (html5ks.persistent.useWebP) {
      src = image.image.replace(/\.[a-z]+$/, ".webp");
    } else {
      src = image.image;
    }
    el.id = name;
    el.src = "dump/" + src;
    // prevent FOUIPC (flash of incorrectly placed content)
    if (!lookup) {
      el.style.display = "none";
      html5ks.elements.show.appendChild(el);
    }
    return deferred.promise;
  },
  hide: function (name) {
    var deferred = when.defer();
    var show = html5ks.elements.show.children;
    for (var i = show.length - 1; i >= 0; i--) {
      if (show[i].id === name) {
        html5ks.elements.show.removeChild(show[i]);
      }
    }
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


  say: function (chrName, str, extend) {
    var deferred = when.defer(),
        text = this.tag(str),
        chr = typeof chrName === "string" ? html5ks.data.characters[chrName] : chrName,
        w = /{w=?(\d*\.\d*)?}(.*)/.exec(str);

    if (!chr) {
      chr = {
        name: chrName
      };
    }
    if (typeof chr.what_prefix === "undefined") {
      chr.what_prefix = "“";
      chr.what_suffix = "”";
    }

    this._lastchr = chr;

    if (!extend && chr.what_prefix) {
      text = chr.what_prefix + text;
    }
    if ((!w || !w[1]) && chr.what_suffix) {
      text = text + chr.what_suffix;
    }

    if (chr.kind === "nvl") {
      html5ks.elements.nvlsay.innerHTML += "<span class='nvl-block'>" + text + "</span>";
      html5ks.elements.nvlctc.style.display = "block";
      html5ks._next = function () {
        html5ks.elements.nvlctc.style.display = "none";
        deferred.resolve();
      };
    } else {
      var who = html5ks.elements.who;
      if (!extend) {
        who.innerHTML = chr.name;
        if (chr.color) {
          who.style.color = chr.color;
        } else {
          who.style.color = "#ffffff";
        }
      }

      var newText = extend ?
                    html5ks.elements.say.innerHTML + text :
                    text;

      html5ks.elements.say.innerHTML = newText;

      if (w) {
        html5ks._next = function () {
          html5ks.api.extend(w[2]).then(function () {
            deferred.resolve();
          });
        };
        if (w[1]) {
          setTimeout(function () {
            html5ks.next();
          }, parseFloat(w[1], 10) * 1000);
          return deferred.promise;
        }
      } else {
        html5ks._next = function () {
          html5ks.elements.ctc.style.display = "none";
          deferred.resolve(text);
        };
      }
      html5ks.elements.ctc.style.display = "block";
    }
    if (html5ks.state.skip || str.indexOf("{nw}") > -1) {
      html5ks.next();
    } else if (html5ks.state.auto) {
      setTimeout(html5ks.next, 3.5 * html5ks.persistent.autoModeDelay * (3000 + text.length));
    }
    return deferred.promise;
  },

  extend: function (str) {
    return this.character(this._lastchar, str, true);
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
    html5ks._next = function () {
      centered.innerHTML = "";
      deferred.resolve();
    };
    return deferred.promise;
  },

  menu: function (choices) {
    var deferred = when.defer();
    var menu = html5ks.elements.choices,
        frag = document.createDocumentFragment(),
        choice = document.createElement("div");

    choice.className = "choice button";

    for (var i in choices) {
      choice.innerHTML = i;
      choice.id = choices[i];
      frag.appendChild(choice);
      choice = choice.cloneNode(false);
    }

    menu.addEventListener("click", function (e) {
      html5ks.elements.choices.innerHTML = "";
      deferred.resolve(e.target.id);
    }, false);

    html5ks.elements.choices.appendChild(frag);
    return deferred.promise;
  },

  speed: function (type, status) {
    html5ks.state[type] = status;
    document.getElementById(type).style.display = status ? "block" : "none";
  }
};
