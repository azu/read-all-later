// LICENSE : MIT
"use strict";
import { Action } from "material-flux";
import {extractItemLinks} from "../../util/extract-item-links";
const ipc = require('electron').ipcRenderer;
export var keys = {
    postLink: Symbol("postLink"),
    loginPocket: Symbol("loginPocket"),
    selectTags: Symbol("selectTags"),
    updateTitle: Symbol("updateTitle"),
    updateURL: Symbol("updateURL"),
    updateComment: Symbol("updateComment")
};
export default class ServiceAction extends Action {
    loginPocket() {
        ipc.once("pocket-login-response", (event, response)=> {
            let {username, accessToken} = response;
            this.dispatch(keys.loginPocket, {username, accessToken});
        });
        ipc.send("pocket-login-request");
    }

    selectTags(tags) {
        this.dispatch(keys.selectTags, tags);
    }

    updateURL(URL) {
        this.dispatch(keys.updateURL, URL);
        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                return console.error("XHR response error: to retry?");
            }
            let document = xhr.response;
            let links = extractItemLinks(URL, document);
            this.dispatch(keys.updateComment, links.join("\n"));
        };
        xhr.open('GET', URL);
        xhr.responseType = 'document';
        xhr.send();
    }

    updateComment(comment) {
        this.dispatch(keys.updateComment, comment);
    }

}