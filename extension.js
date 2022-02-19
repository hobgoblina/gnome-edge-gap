const Main = imports.ui.main;
const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let bottomPanel = null;
let topPanel = null;
let leftPanel = null;
let rightPanel = null;
let settings = null;
let sizeChangedSignal = null;

function init () {}

function enable() {
  settings = ExtensionUtils.getSettings();
  let monitor = Main.layoutManager.primaryMonitor;

  bottomPanel = new St.Bin({
    reactive: false,
    can_focus: false,
    track_hover: false,
    height: settings.get_int('gap-size'),
    width: monitor.width,
  });

  topPanel = new St.Bin({
    reactive: false,
    can_focus: false,
    track_hover: false,
    height: settings.get_int('gap-size'),
    width: monitor.width,
  });

  leftPanel = new St.Bin({
    reactive: false,
    can_focus: false,
    track_hover: false,
    height: monitor.height,
    width: settings.get_int('gap-size'),
  });

  rightPanel = new St.Bin({
    reactive: false,
    can_focus: false,
    track_hover: false,
    height: monitor.height,
    width: settings.get_int('gap-size'),
  });

  bottomPanel.set_position(0, monitor.height - settings.get_int('gap-size'));
  topPanel.set_position(0, 0);
  leftPanel.set_position(0, 0);
  rightPanel.set_position(monitor.width - settings.get_int('gap-size'), 0);


  Main.layoutManager.addChrome(bottomPanel, {
    affectsInputRegion: true,
    affectsStruts: true,
  });

  Main.layoutManager.addChrome(topPanel, {
    affectsInputRegion: true,
    affectsStruts: true,
  });

  Main.layoutManager.addChrome(leftPanel, {
    affectsInputRegion: true,
    affectsStruts: true,
  });

  Main.layoutManager.addChrome(rightPanel, {
    affectsInputRegion: true,
    affectsStruts: true,
  });
  
  sizeChangedSignal = settings.connect('changed::gap-size', function (k, b) {
    disable();
    enable();
  });
}

function disable() {
  Main.layoutManager.removeChrome(bottomPanel);
  Main.layoutManager.removeChrome(topPanel);
  Main.layoutManager.removeChrome(leftPanel);
  Main.layoutManager.removeChrome(rightPanel);
  settings.disconnect(sizeChangedSignal);
  
  bottomPanel.destroy();
  topPanel.destroy();
  leftPanel.destroy();
  rightPanel.destroy();
  
  settings.run_dispose();
  
  sizeChangedSignal = null;
  bottomPanel = null;
  topPanel = null;
  leftPanel = null;
  rightPanel = null;
  settings = null;
}
