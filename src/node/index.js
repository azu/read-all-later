// LICENSE : MIT
"use strict";
import app from "app";
import Application from "./Application";
import ServiceManger from "./service-manager";
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
app.on('ready', function () {
    require("electron-template-menu")();
    const application = new Application();
    application.launch();
    const manager = new ServiceManger(application);
    manager.start();
});
