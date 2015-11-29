// LICENSE : MIT
"use strict";
const ipcMain = require('electron').ipcMain;
import Serve from "./pocket-server";
export default class ServiceManger {
    start() {
        ipcMain.on("pocket-login-request", function (event, arg) {
            const sender = event.sender;
            Serve().then(result => {
                let {username, accessToken} = result;
                console.log({username, accessToken});
                sender.send("pocket-login-response", {username, accessToken});
            }).catch(error => {
                sender.send("pocket-login-error", error);
            })
        });
    }
}
