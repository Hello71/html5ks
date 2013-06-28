html5ks.menu = {
  mainMenu: function () {
    html5ks.api.stop("music");
    html5ks.api.stop("sound");
    html5ks.api.stop("ambient");
    html5ks.api.window("hide");
    html5ks.api.play("music", "music_menus");
    html5ks.elements.bg.style.background = "url(dump/ui/main/bg-main.png) 0 0 / cover";
    html5ks.elements.mainMenu.style.display = "block";
  },

  activeDialog: null,

  dialog: function (name) {
    this.activeDialog = html5ks.elements.dialog[name];
    this.activeDialog.style.display = "block";
    html5ks.elements.dialogs.style.display = "block";
  },

  initEvents: function () {
    document.getElementById("start").addEventListener("click", function () {
      html5ks.elements.mainMenu.style.display = "none";
      html5ks.api.iscene("en_NOP1");
    }, false);
    document.getElementById("options-button").addEventListener("click", function () {
      html5ks.menu.dialog("options");
    }, false);
    html5ks.elements.dialog.return.addEventListener("click", function (e) {
      html5ks.menu.activeDialog.style.display = "none";
      html5ks.elements.dialogs.style.display = "none";
    }, false);
  }
};
