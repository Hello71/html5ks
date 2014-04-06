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
          switch (inst._type) {
            case 'Call':
              switch (inst.label) {
                case "act_op":
                case "iscene":
                  html5ks.api[inst.label].call(html5ks.api, inst['arguments'][0][0][1]).then(runInst, deferred.reject);
                default:
                  throw new Error('unknown Call label');
              }
              break;
            case 'UserStatement':
              inst = inst.parsed;
              switch (inst[0][0]) {
                case "jump_out":
                  html5ks.api.nvl("clear");
                  /* falls through */
                case "jump_in":
                  return this.run(inst[1].label);
                default:
                  throw new Error('not implemented');
              }
            case 'If':
              throw new Error('not implemented');
            case 'Pass':
              break;
            default:
              throw new Error('unknown imachine inst');
          }
        }.bind(this);
    runInst();
    return deferred.promise;
  }
};
