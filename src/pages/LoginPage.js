import React from 'react'
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


let styles = {
  menu: {
      marginBottom: "2em",
      flexGrow: "1"
  },
  icon: {
      marginRight: ".5em",
  },
  link: {
      textDecoration: "none",
      color: "black",
  },
  login: {
      marginLeft: "auto"
  }
}

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
        <div style={styles.menu}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" >
                    UDel PAPER
                </Typography>
            </Toolbar>
        </AppBar>
        <p>You need to login to proceed</p>
        <Button variant="contained" size="large" onClick={this.login}>Login</Button>
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