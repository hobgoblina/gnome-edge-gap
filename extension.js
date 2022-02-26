const Main = imports.ui.main;
const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let bottomPanel = null;
let topPanel = null;
let leftPanel = null;
let rightPanel = null;
let settings = null;
let topSizeChangedSignal = null;
let bottomSizeChangedSignal = null;
let leftSizeChangedSignal = null;
let rightSizeChangedSignal = null;

function init () {}

function enable() {
  settings = ExtensionUtils.getSettings();
  let monitor = Main.layoutManager.primaryMonitor;

  bottomPanel = new St.Bin({
    reactive: false,
    can_focus: false,
    track_hover: false,
    height: settings.get_int('bottom-gap-size'),
    width: monitor.width,
  });

  topPanel = new St.Bin({
    reactive: false,
    can_focus: false,
    track_hover: false,
    height: settings.get_int('top-gap-size'),
    width: monitor.width,
  });

  leftPanel = new St.Bin({
    reactive: false,
    can_focus: false,
    track_hover: false,
    height: monitor.height,
    width: settings.get_int('left-gap-size'),
  });

  rightPanel = new St.Bin({
    reactive: false,
    can_focus: false,
    track_hover: false,
    height: monitor.height,
    width: settings.get_int('right-gap-size'),
  });

  bottomPanel.set_position(0, monitor.height - settings.get_int('bottom-gap-size'));
  topPanel.set_position(0, 0);
  leftPanel.set_position(0, 0);
  rightPanel.set_position(monitor.width - settings.get_int('right-gap-size'), 0);


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
  
  topSizeChangedSignal = settings.connect('changed::top-gap-size', function (k, b) {
    disable();
    enable();
  });

  bottomSizeChangedSignal = settings.connect('changed::bottom-gap-size', function (k, b) {
    disable();
    enable();
  });

  leftSizeChangedSignal = settings.connect('changed::left-gap-size', function (k, b) {
    disable();
    enable();
  });

  rightSizeChangedSignal = settings.connect('changed::right-gap-size', function (k, b) {
    disable();
    enable();
  });
}

function disable() {
  Main.layoutManager.removeChrome(bottomPanel);
  Main.layoutManager.removeChrome(topPanel);
  Main.layoutManager.removeChrome(leftPanel);
  Main.layoutManager.removeChrome(rightPanel);
  settings.disconnect(topSizeChangedSignal);
  settings.disconnect(bottomSizeChangedSignal);
  settings.disconnect(leftSizeChangedSignal);
  settings.disconnect(rightSizeChangedSignal);
  
  bottomPanel.destroy();
  topPanel.destroy();
  leftPanel.destroy();
  rightPanel.destroy();
  
  settings.run_dispose();
  
  topSizeChangedSignal = null;
  bottomSizeChangedSignal = null;
  leftSizeChangedSignal = null;
  rightSizeChangedSignal = null;
  bottomPanel = null;
  topPanel = null;
  leftPanel = null;
  rightPanel = null;
  settings = null;
}
