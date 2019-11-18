import React from 'react'
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Menu from '../components/menu';

class LoginPage extends React.Component {

  login() {
    let provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
    //   firebase.auth().signInWithPopup(provider);
    // });
    firebase.auth().signInWithPopup(provider);
  }

  render() {
    if (this.props.user === false) {
      return(null);
    }
    if (this.props.user === null) {
      return (
        <div>
          <Menu />
          <p>You need to login to proceed</p>
          <Button onClick={this.login}>Login</Button>
        </div>
      );
    }
    else {
      return (
        <Redirect to={{ pathname: "/" }} />
      );
    }
  }
}

export default LoginPage;