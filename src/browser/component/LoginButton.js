// LICENSE : MIT
"use strict";
import React from "react"
export default class LoginButton extends React.Component {
    render() {
        return <div className="LoginButton">
            {this.props.isLogin
                ? <button onClick={this.props.onSubmit}>Re-login to Pocket</button>
                : <button onClick={this.props.onSubmit}>Login to Pocket</button>}
        </div>
    }
}