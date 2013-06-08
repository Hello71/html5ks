function STUB() {
  return console.log("STUB: " + arguments.caller);
}
function WARN(msg) {
  return console.log("WARN: " + arguments.caller + ": " + msg);
}
