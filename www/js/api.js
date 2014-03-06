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
    var audio = html5ks.elements.audio[channel],
        step = (target - audio.volume) / (delay * 20);
    if (!delay) {
      audio.volume = target;
    } else {
      this._fading[channel] = setInterval(function () {
        // clamp new volume 0-1
        audio.volume = Math.min(Math.max(audio.volume + step, 0), 1);
        switch (audio.volume) {
          case 0:
            audio.pause();
            /* falls through */
          case 1:
            clearInterval(this._fading[channel]);
            delete this._fading[channel];
        }
      }.bind(this), 50);
    }
    return when.resolve();
  },

  _loadMedia: function (el, src, types) {
    var i = 0;
    var _nextType = function () {
      for (; i < types.length; i++) {
        var type = types[i];
        if (el.canPlayType(type[0])) {
          el.src = src + "." + type[1];
          el.load();
          return true;
        }
      }
    };

    html5ks.spin(1);

    el.oncanplaythrough = function () {
      el.oncanplaythrough = null;
      el.play();
      html5ks.spin(-1);
    };

    setTimeout(function () {
      if (el.oncanplaythrough) {
        console.warn("video not playing after 3 seconds");
        el.oncanplaythrough();
      }
    }, 3000);

    el.onerror = function (e) {
      if (e.code === e.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        if (_nextType(++i)) {
          console.warn("browser claimed support for " + types[i-1][0] + " but failed");
        } else {
          console.error("no media formats supported");
        }
      } else {
        console.error("unknown audio error");
      }
    };

    _nextType();
  },

  play: function (channel, name, _, fade) {
    this.stop(channel);
    var deferred = when.defer(),
        audio = html5ks.elements.audio[channel];
    if (channel === "music" || channel === "ambient") {
      audio.loop = true;
    }
    html5ks.elements.audio[channel] = audio;
    html5ks.store[channel] = name;

    var src = "dump/", volume;

    switch (channel) {
      case "music":
        var fname = html5ks.data.music[name];
        src += "bgm/" + fname;
        volume = html5ks.persistent.musicVolume;
        document.getElementById("current-music-track").innerHTML = fname.replace(/_/g, " ");
        break;
      case "ambient":
      case "sound":
        src += "sfx/" + html5ks.data.sfx[name];
        volume = html5ks.persistent.sfxVolume;
    }

    audio.addEventListener("playing", function playing() {
      audio.removeEventListener("playing", playing, false);
      if (fade) {
        html5ks.api.set_volume(volume, fade, channel);
      }
      deferred.resolve();
    }, false);

    audio.volume = fade ? 0 : volume;
    this._loadMedia(audio, src, [
      ['audio/ogg; codecs="opus"', "opus"],
      ['audio/ogg; codecs="vorbis"', "ogg"],
      ['audio/x-m4a', "m4a"],
      ['audio/aac', "aac"],
      ['audio/wav; codecs="1"', "wav"]]);

    return deferred.promise;
  },

  stop: function (channel, ignore, fade) {
    if (channel === "all") {
      return ["music", "sound", "ambient"].forEach(function (channel) {
        html5ks.api.stop(channel, ignore, fade);
      });
    }
    var audio = html5ks.elements.audio[channel];
    if (this._fading[channel]) {
      clearInterval(this._fading[channel]);
    }
    if (fade) {
      this.set_volume(0, fade, channel);
    } else {
      audio.pause();
    }
    return when.resolve();
  },


  movie_cutscene: function (vid_src, skippable) {
    var deferred = when.defer(),
        video = html5ks.elements.video,
        src = "dump/video/" + vid_src;

    this.stop("all");
    clearInterval(html5ks._nextTimeout);

    if (html5ks.api.skip()) {
      return deferred.resolve();
    }

    this._loadMedia(video, src, [
      ['video/webm; codecs="vp9,opus"', "vp9.webm"],
      ['video/webm; codecs="vp8,vorbis"', "webm"],
      ['video/ogg; codecs="theora,vorbis"', "ogv"],
      ['video/mp4; codecs="avc1.42E01E,mp4a.40.2"']]);
    video.style.display = "block";
    video.volume = html5ks.persistent.musicVolume;
    var done = function () {
      video.style.display = "none";
      video.src = "";
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
      if (e.button === 0) {
        if (video.paused) video.play();
        else if (skippable) done();
      }
    };
    video.onended = done;
    return deferred.promise;
  },

  act_op: function (this_video) {
    // strip off extension
    return this.movie_cutscene(this_video.slice(0,-4));
  },


  iscene: function (target, is_h, is_end) {
    html5ks.store.status = "scene";
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
        return when.resolve();
      }
    }
  },


  window: function (action) {
    var windw = html5ks.elements.window;
    switch (action) {
      case true:
      case "show":
        html5ks.store.window = true;
        windw.style.display = "block";
        break;
      case false:
      case "hide":
        html5ks.store.window = false;
        windw.style.display = "none";
        break;
    }
    return when.resolve();
  },


  scene: function () {
    html5ks.elements.show.innerHTML = "";
    return this.show.apply(this, arguments);
  },


  _positions: {
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
        var pos = html5ks.api._positions[location];
        if (pos) {
          el.style.left = pos.xpos * 800 + "px";
          el.style.top = pos.ypos * 600 + "px";
          el.style.marginLeft = "-" + pos.xanchor * el.width + "px";
          el.style.marginTop = "-" + pos.yanchor * el.height + "px";
        }
        el.style.display = "block";
      }
      html5ks.spin(-1);
      deferred.resolve();
    };
    el.onerror = function () {
      el.parentNode.removeChild(el);
      html5ks.spin(-1);
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
    if (Modernizr.webp) {
      src = image.image.replace(/\.[a-z]+$/, ".webp");
    } else {
      src = image.image;
    }
    el.id = name;
    el.src = "dump/" + src;
    html5ks.spin(1);
    // prevent FOUIPC (flash of incorrectly placed content)
    if (!lookup) {
      el.style.display = "none";
      html5ks.elements.show.appendChild(el);
    }
    return deferred.promise;
  },
  hide: function (name) {
    var show = html5ks.elements.show.children;
    for (var i = show.length - 1; i >= 0; i--) {
      if (show[i].id === name) {
        html5ks.elements.show.removeChild(show[i]);
      }
    }
    return when.resolve();
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


  dlgTag: function (str) {
    var text = [];
    for (var i = 0; i < str.length; i++) {
      switch (str[i]) {
      case '{':
        var close = str.indexOf('}', i),
            tag = str.slice(i, close);
        i = close;
        if (tag[1] === '/') {
          text.push('');
        } else {
          text.push(tag);
        }
        break;
      default:
        text.push(str[i]);
      }
    }
    var br = document.createElement("br");
    var span = document.createElement("span");
    span.style.visibility = "hidden";
    return text.map(function (txt) {
      if (txt == '\n') {
        return br.cloneNode(false);
      } else {
        span = span.cloneNode(false);
        span.appendChild(document.createTextNode(txt));
        return span;
      }
    });
  },

  say: function (chrName, str, extend) {
    var deferred = when.defer(),
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

    this._lastchar = chr;

    if (!extend && chr.what_prefix) {
      str = chr.what_prefix + str;
    }
    if ((!w || !w[1]) && chr.what_suffix) {
      str = str + chr.what_suffix;
    }

    var text = this.dlgTag(str),
        say, ctc;

    if (chr.kind === "nvl") {
      say = document.createElement("span");
      say.className = "nvl-block";
      html5ks.elements.nvlsay.appendChild(say);
      ctc = html5ks.elements.nvlctc;
    } else {
      var who = html5ks.elements.who;
      if (!extend) {
        who.innerHTML = chr.name;
        who.style.color = chr.color || "#ffffff";
      }

      say = html5ks.elements.say;
      if (!extend) say.innerHTML = "";
      ctc = html5ks.elements.ctc;
    }

    text.forEach(say.appendChild.bind(say));

    var tm, done;

    var ptxt = function (immed) {
      var txt = text.shift();
      if (typeof txt !== 'undefined') {
        txt.removeAttribute("style");
        if (immed) return ptxt(immed);
        else tm = setTimeout(ptxt, 1000 / html5ks.persistent.textSpeed);
      } else {
        done = true;
        ctc.style.display = "block";
        ctc.class = "";
        ctc.class = "ctc";
      }
    };

    ptxt();

    html5ks.next = function () {
      if (!done) {
        clearTimeout(tm);
        ptxt(true);
      } else {
        ctc.style.display = "none";
        deferred.resolve();
      }
      html5ks.api._setNextTimeout(str, true);
    };

    if (html5ks.persistent.textSpeed == 200) {
      ptxt(true);
    }

    this._setNextTimeout(str, false);

    return deferred.promise;
  },

  _setNextTimeout: function (str, done) {
    if (done) {
      if (this.auto()) {
        setTimeout(html5ks.next, str.length + 3.5 * html5ks.persistent.autoModeDelay);
      }
    } else if (html5ks.api.skip() || str.indexOf("{nw}") > -1) {
      html5ks.next();
      html5ks._nextTimeout = setTimeout(html5ks.next, 50);
    }
  },

  extend: function (str) {
    return this.say(this._lastchar, str, true);
  },

  Pause: function (duration) {
    var deferred = when.defer();
    setTimeout(function () {
      deferred.resolve();
    }, duration * 1000);
    return deferred.promise;
  },

  nvl: function (action) {
    var nvl = html5ks.elements.nvl;
    switch (action) {
    case true:
    case "show":
      html5ks.store.nvl = true;
      nvl.style.display = "block";
      break;
    case false:
    case "hide":
      html5ks.store.nvl = false;
      nvl.style.display = "none";
      break;
    case "clear":
      html5ks.elements.nvlsay.innerHTML = "";
      break;
    default:
      console.error("no such nvl action " + action);
    }
    return when.resolve();
  },

  centered: function (text) {
    var deferred = when.defer(),
        centered = document.getElementById("centered");
    centered.innerHTML = this.tag(text);
    html5ks._next = function () {
      centered.innerHTML = "";
      deferred.resolve();
    };
    this._setNextTimeout(text, false);
    this._setNextTimeout(text, true);
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

  auto: function (arg) {
    if (arg) {
      return this.speed("auto");
    } else {
      return html5ks.store.speed === "auto";
    }
  },

  skip: function (arg) {
    if (arg) {
      return this.speed("skip");
    } else {
      return html5ks.store.speed === "skip";
    }
  },

  speed: function (state) {
    switch (state) {
    case "skip":
    case "auto":
      this.speed();
      html5ks.store.speed = state;
      document.getElementById(state).style.display = "block";
      break;
    default:
      html5ks.store.speed = "";
      document.getElementById("auto").style.display = "none";
      document.getElementById("skip").style.display = "none";
    }
  }
};
