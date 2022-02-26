const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

const Gettext = imports.gettext.domain('gnome-edge-gap');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let settings;

function init() {
  settings = ExtensionUtils.getSettings();
  ExtensionUtils.initTranslations("gnome-edge-gap");
}

function buildPrefsWidget() {
  const isGtk4 = Gtk.get_major_version() >= '4';

  let frame = new Gtk.ScrolledWindow(
      { hscrollbar_policy: Gtk.PolicyType.NEVER });
  let builder = new Gtk.Builder();
  builder.set_translation_domain("gnome-edge-gap");
  builder.add_from_file(Me.path + '/Settings-40.ui');

  let notebook = builder.get_object("settings_notebook");
  if (isGtk4) {
      frame.set_child(notebook);
  } else {
      frame.add(notebook);
  }

  let top_settings_spin = builder.get_object("spin_top_gap_size");
  top_settings_spin.set_value(settings.get_int('top-gap-size'));
  top_settings_spin.connect('value-changed', function (w) {
      settings.set_int('top-gap-size', w.get_value());
  });
  settings.connect('changed::top-gap-size', function (k, b) {
      top_settings_spin.set_value(settings.get_int(b));
  });

  let bottom_settings_spin = builder.get_object("spin_bottom_gap_size");
  bottom_settings_spin.set_value(settings.get_int('bottom-gap-size'));
  bottom_settings_spin.connect('value-changed', function (w) {
      settings.set_int('bottom-gap-size', w.get_value());
  });
  settings.connect('changed::bottom-gap-size', function (k, b) {
      bottom_settings_spin.set_value(settings.get_int(b));
  });

  let left_settings_spin = builder.get_object("spin_left_gap_size");
  left_settings_spin.set_value(settings.get_int('left-gap-size'));
  left_settings_spin.connect('value-changed', function (w) {
      settings.set_int('left-gap-size', w.get_value());
  });
  settings.connect('changed::left-gap-size', function (k, b) {
      left_settings_spin.set_value(settings.get_int(b));
  });

  let right_settings_spin = builder.get_object("spin_right_gap_size");
  right_settings_spin.set_value(settings.get_int('right-gap-size'));
  right_settings_spin.connect('value-changed', function (w) {
      settings.set_int('right-gap-size', w.get_value());
  });
  settings.connect('changed::right-gap-size', function (k, b) {
      right_settings_spin.set_value(settings.get_int(b));
  });

  if (!isGtk4) {
      frame.show_all();
  }
  return frame;
}
