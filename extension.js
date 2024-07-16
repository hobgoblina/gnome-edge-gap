const Main = imports.ui.main;
const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let panels = [];
let settings = null;
let sizeChangedSignals = [];

function init() {}

function enable() {
    settings = ExtensionUtils.getSettings();
    applyGaps();

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
        sizeChangedSignals.push(
            settings.connect(`changed::${key}`, () => {
                disable();
                enable();
            }),
        );
    });
}

function disable() {
    panels.forEach((panel) => {
        Main.layoutManager.removeChrome(panel);
        panel.destroy();
    });
    panels = [];

    sizeChangedSignals.forEach((signal) => settings.disconnect(signal));
    sizeChangedSignals = [];

    settings.run_dispose();
    settings = null;
}

function applyGaps() {
    const primaryMonitor = Main.layoutManager.primaryMonitor;
    const monitors = Main.layoutManager.monitors;

    monitors.forEach((monitor) => {
        const isPrimary = monitor.index === primaryMonitor.index;
        const topGapSize = settings.get_int(
            isPrimary ? "top-gap-size" : "secondary-top-gap-size",
        );
        const bottomGapSize = settings.get_int(
            isPrimary ? "bottom-gap-size" : "secondary-bottom-gap-size",
        );
        const leftGapSize = settings.get_int(
            isPrimary ? "left-gap-size" : "secondary-left-gap-size",
        );
        const rightGapSize = settings.get_int(
            isPrimary ? "right-gap-size" : "secondary-right-gap-size",
        );

        const topPanel = new St.Bin({
            reactive: false,
            can_focus: false,
            track_hover: false,
            height: topGapSize,
            width: monitor.width,
        });
        const bottomPanel = new St.Bin({
            reactive: false,
            can_focus: false,
            track_hover: false,
            height: bottomGapSize,
            width: monitor.width,
        });
        const leftPanel = new St.Bin({
            reactive: false,
            can_focus: false,
            track_hover: false,
            height: monitor.height,
            width: leftGapSize,
        });
        const rightPanel = new St.Bin({
            reactive: false,
            can_focus: false,
            track_hover: false,
            height: monitor.height,
            width: rightGapSize,
        });

        topPanel.set_position(monitor.x, monitor.y);
        bottomPanel.set_position(
            monitor.x,
            monitor.y + monitor.height - bottomGapSize,
        );
        leftPanel.set_position(monitor.x, monitor.y);
        rightPanel.set_position(
            monitor.x + monitor.width - rightGapSize,
            monitor.y,
        );

        panels.push(topPanel, bottomPanel, leftPanel, rightPanel);

        Main.layoutManager.addChrome(topPanel, {
            affectsInputRegion: true,
            affectsStruts: true,
        });
        Main.layoutManager.addChrome(bottomPanel, {
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
    });
}
