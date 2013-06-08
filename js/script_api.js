function windw(action, transition) {
  var deferred = when.defer();
  setTimeout(function () {
    deferred.resolve(action);
  }, 100);
  return deferred.promise;
}
var types = {
  "ev": "event",
  "evh": "event",
  "ovl": "event",
  "bg": "bgs",
  "": "vfx"
}
// NOT iscene
function scene(type, name) {
  if (typeof name == "undefined") name = type;
  WARN("don't know extension, trying all");
  var bg = document.getElementById("bg");
  var img = "/" + types[type] + "/" + name;
  bg.onerror = function () {
    bg.onerror = function () {
      bg.src = img + ".jpg";
    };
    bg.src = img + ".png";
  };
  bg.src = img + ".webp";
}
