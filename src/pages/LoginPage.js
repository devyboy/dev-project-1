import React from 'react'
import firebase from "firebase";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

class LoginPage extends React.Component {

  login() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  render() {
    if (this.props.user === false) {
      return(<CircularProgress />);
    }
    if (this.props.user === null) {
      return(
        <div>
          <p>You need to login to proceed</p>
          <Button onClick={this.login}>Login</Button>
        </div>
      );
    }
    else {
      return( 
        <Redirect to={{pathname: "/"}} />
      );
    }
  }
}

export default LoginPage;