import React, { Component } from "react";


class Thread extends Component {
    render() {
        return(
            <div className="App">
                <h1>{this.props.location.pathname} not found.</h1>
            </div>
        );
    }
}

export default Thread;