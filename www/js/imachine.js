"use strict";
html5ks.imachine = {
  seen_scene: function (scene) {
    return !!html5ks.store.seen_scenes[scene];
  },
  scene_register: function (scene) {
    html5ks.store.seen_scenes[scene] = true;
  },
  start: function () {
    return this.run("imachine");
  },
  run: function (label) {
    var deferred = when.defer(),
        cmds = typeof label === "string" ? html5ks.data.imachine[label] : label,
        i = 0,
        runInst = function () {
          var inst = cmds[i++];
          switch (typeof inst) {
            case "undefined":
              deferred.resolve();
              break;
            case "object":
              var cmd = inst[0];
              var args = inst.slice(1);
              switch (inst[0]) {
                case "jump_out":
                  var newlabel = args[0];
                  if (newlabel === "restart") {
                    html5ks.menu.mainMenu();
                  } else if (!html5ks.data.imachine[newlabel]) {
                    deferred.reject(new Error("label does not exist"));
                  } else {
                    this.run(newlabel);
                  }
                  break;
                case "iscene":
                  this.scene_register(inst[1]);
                  /* falls through */
                case "act_op":
                  switch (inst[1]) {
                    case "op_vid1":
                      html5ks.api.movie_cutscene("op_1").then(runInst, deferred.reject);
                      break;
                    default:
                      html5ks.api[cmd].apply(html5ks.api, args).then(runInst, deferred.reject);
                  }
                  break;
                case "imenu":
                  html5ks.api.iscene(args[0]).then(function (choice) {
                    this._return = choice;
                    runInst();
                  }.bind(this), console.error);
                  break;
                case "if":
                  var cpy = inst.slice(0),
                      type = '',
                      next = null;
                  el: while ((type = cpy.shift())) {
                    switch (type) {
                      case "if":
                      case "elif":
                        var cond = cpy.shift();
                        next = cpy.shift();
                        switch (cond[0]) {
                          case "_return":
                            if (this._return == cond[1]) {
                              break el;
                            }
                            break;
                          case "seen_scene":
                            if (this.seen_scene(cond[1])) {
                              break el;
                            }
                            break;
                          case "attraction_sc":
                          case "attraction_hanako":
                          case "attraction_kenji":
                            if (html5ks.store.attraction[cond[0]] > cond[1]) {
                              break el;
                            }
                            break;
                          default:
                            throw new Error("unhandled if statement");
                        }
                        break;
                      case "else":
                        next = cpy.shift();
                        break el;
                    }
                  }
                  return html5ks.imachine.run(next).then(runInst, console.error);
                case "path_end":
                  console.error("TODO: disp vid + add to persistent, args:");
                  console.log(args);
                  deferred.resolve();
                  break;
                default:
                  deferred.reject(new Error("unknown imachine inst: " + inst));
              }
          }
        }.bind(this);
    runInst();
    return deferred.promise;
  }
};
