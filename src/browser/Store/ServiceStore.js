// LICENSE : MIT
"use strict";
import { Store } from "material-flux";
import { keys } from "../Action/ServiceAction";
export default class ServiceStore extends Store {
    constructor(...args) {
        super(...args);
        this.state = {
            URL: "",
            comment: "",
            tags: [],
            selectedTags: ["All-later"],
            username: localStorage.getItem("username"),
            accessToken: localStorage.getItem("accessToken")
        };
        this.register(keys.selectTags, (selectedTags) => {
            this.setState({
                selectedTags
            });
        });
        this.register(keys.loginPocket, ({username, accessToken}) => {
            localStorage.setItem("username", username);
            localStorage.setItem("accessToken", accessToken);
            this.setState({username, accessToken});
        });
        this.register(keys.updateURL, (URL) => {
            this.setState({
                URL
            });
        });
        this.register(keys.updateComment, (comment) => {
            this.setState({
                comment
            });
        })
    }

    hasAccessToken() {
        return this.state.accessToken != null;
    }
}