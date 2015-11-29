// LICENSE : MIT
"use strict";
import app from 'app';
import BrowserWindow  from 'browser-window';
import path from "path";
export default class Application {
    launch() {
        this.mainWindow = new BrowserWindow({width: 600, height: 600});
        var index = {
            html: path.join(__dirname, "..", "browser", "index.html")
        };
        this.mainWindow.loadURL('file://' + index.html);
    }
}
