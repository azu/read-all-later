// LICENSE : MIT
"use strict";
const ipcMain = require('electron').ipcMain;
import Serve from "./pocket-server";
export default class ServiceManger {
    constructor(application) {
        this.application = application;
    }

    start() {
        ipcMain.on("pocket-login-request", function (event, arg) {
            const sender = event.sender;
            Serve().then(result => {
                let {username, accessToken} = result;
                sender.send("pocket-login-response", {username, accessToken});
                this.application.show();
            }).catch(error => {
                sender.send("pocket-login-error", error);
            })
        });
    }
}
