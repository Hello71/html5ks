html5ks.imachine = (function () {
  "use strict";
  return {
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
          ilabel = typeof label === "string" ? html5ks.data.imachine[label] : label,
          i = 0,
          runInst = function () {
            var inst = ilabel[i++];
            console.log(inst);
            switch (typeof inst) {
              case "undefined":
                break;
              case "string": // jump_out
                this.run(inst);
                break;
              case "object":
                switch (inst[0]) {
                  case "iscene":
                    this.scene_register(inst[1]);
                  case "act_op":
                    switch (inst[1]) {
                      case "op_vid1":
                        html5ks.api.movie_cutscene("op_1").then(runInst);
                        break;
                      default:
                        html5ks.api[inst[0]](inst[1]).then(runInst);
                    }
                    break;
                  case "seen_scene":
                    if (this.seen_scene(inst[1])) {
                      this.run(inst[2]);
                    } else {
                      this.run(inst[3]);
                    }
                    break;
                  case "attraction_sc":
                  case "attraction_hanako":
                  case "attraction_kenji":
                    if (typeof inst[1] === "number") {
                      if (html5ks.persistent.store[inst[0]] > inst[1]) {
                        runInst(inst[3]);
                      } else {
                        runInst(inst[4]);
                      }
                    } else {
                      html5ks.persistent.store[inst[0]]++;
                    }
                    break;
                  case "path_end":
                    // TODO: disp vid
                    deferred.resolve();
                    break;
                  default:
                    console.error("unknown imachine inst");
                    console.error(inst);
                }
            }
          }.bind(this);
      runInst();
      return deferred.promise;
    }
  };
}());
