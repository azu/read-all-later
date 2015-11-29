// LICENSE : MIT
"use strict";
import React from "react";
import {render} from "react-dom";
import Editor from "./component/Editor";
import URLInput from "./component/URLInput";
import SubmitButton from "./component/SubmitButton";
import LoginButton from "./component/LoginButton";
import AppContext from "./AppContext";
const appContext = new AppContext();
import Pocket from "./pocket/pocket"
class App extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = Object.assign({}, appContext.ServiceStore.state);
    }

    componentWillMount() {
        appContext.ServiceStore.onChange(() => {
            let newState = Object.assign({}, this.state, appContext.ServiceStore.state);
            this.setState(newState);
        });
    }

    postLink() {
        const { ServiceAction } = appContext;
        let postData = {
            url: this.state.URL,
            comment: this.state.comment,
            tags: this.state.selectedTags
        };
        let savedLinks = postData.comment.split("\n").filter(url => url.trim().length > 0);
        if (this.state.accessToken) {
            const pocket = new Pocket({
                consumerKey: "48525-82583e7ef8e1387ab6cca593",
                accessToken: this.state.accessToken
            });
            let addPromises = savedLinks.map(url => {
                return pocket.add({
                    url
                });
            });
            Promise.all(addPromises).then(res => {
                console.log(res);
                console.log("Success");
            }).catch(error => {
                console.error(error);
            })
        }

    }

    render() {
        const { ServiceAction, ServiceStore } = appContext;
        const updateURL = ServiceAction.updateURL.bind(ServiceAction);
        const updateComment = ServiceAction.updateComment.bind(ServiceAction);
        const loginPocket = ServiceAction.loginPocket.bind(ServiceAction);
        return <div className="App">
            <URLInput URL={this.state.URL} updateURL={updateURL}/>
            <Editor value={this.state.comment} onChange={updateComment}/>
            <SubmitButton onSubmit={this.postLink.bind(this)}/>
            <LoginButton onSubmit={loginPocket} isLogin={ServiceStore.hasAccessToken()}/>
        </div>;
    }
}
render(<App />, document.getElementById("js-main"));
