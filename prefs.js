const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

const Gettext = imports.gettext.domain("gnome-edge-gap");
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let settings;

function init() {
    settings = ExtensionUtils.getSettings();
    ExtensionUtils.initTranslations("gnome-edge-gap");
}

function buildPrefsWidget() {
    const isGtk4 = Gtk.get_major_version() >= "4";

    let frame = new Gtk.ScrolledWindow({
        hscrollbar_policy: Gtk.PolicyType.NEVER,
    });
    let builder = new Gtk.Builder();
    builder.set_translation_domain("gnome-edge-gap");
    builder.add_from_file(Me.path + "/Settings-40.ui");

    let notebook = builder.get_object("settings_notebook");
    if (isGtk4) {
        frame.set_child(notebook);
    } else {
        frame.add(notebook);
    }

    const gapKeys = [
        "top-gap-size",
        "bottom-gap-size",
        "left-gap-size",
        "right-gap-size",
        "secondary-top-gap-size",
        "secondary-bottom-gap-size",
        "secondary-left-gap-size",
        "secondary-right-gap-size",
    ];

    gapKeys.forEach((key) => {
        const spinButton = builder.get_object(`spin_${key.replace(/-/g, "_")}`);
        spinButton.set_value(settings.get_int(key));
        spinButton.connect("value-changed", (w) =>
            settings.set_int(key, w.get_value()),
        );
        settings.connect(`changed::${key}`, (k, b) =>
            spinButton.set_value(settings.get_int(b)),
        );
    });

    if (!isGtk4) {
        frame.show_all();
    }
    return frame;
}
