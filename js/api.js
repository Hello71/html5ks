"use strict";
var save = {
  seen_scenes: {},
  attraction: {
    kenji: 0,
    sc: 0,
    hanako: 0
  },
  hdisabled: false
};
var video = document.getElementById("video");
function seen_scene(scene) {
  return !!save.seen_scenes[scene];
}
function scene_register(scene) {
  save.seen_scenes.scene = true;
}
function play_video(vid_src) {
  var deferred = when.defer();
  video.src = "/video/" + vid_src + ".webm";
  video.load();
  video.addEventListener("ended", function () {
    deferred.resolve(video);
  }, false);
  video.addEventListener("error", function () {
    deferred.reject(video.error);
  }, false);
}
function act_op(this_video) {
  // strip off extension
  return play_video(this_video.slice(0,-4));
}
