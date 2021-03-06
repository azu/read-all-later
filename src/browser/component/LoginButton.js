// LICENSE : MIT
"use strict";
import React from "react"
export default class LoginButton extends React.Component {
    render() {
        return <div className="LoginButton">
            {this.props.isLogin
                ? <button onClick={this.props.onSubmit} className="btn btn-default">Re-login to Pocket</button>
                : <button onClick={this.props.onSubmit} className="btn btn-primary">Login to Pocket</button>}
        </div>
    }
}