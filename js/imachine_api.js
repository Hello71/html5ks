function iscene(target, is_h, is_end) {
  scene_register(target);
  return window.script[target]();
}
