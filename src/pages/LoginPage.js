import React from 'react'
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import UDLogo from "../UDMonogram.jpg";


let styles = {
  container: {
    position: "absolute",
    top: "35%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  },
  button: {
    margin: "auto",
    display: "block",
    marginTop: "2em",
    fontSize: "1.2em"
  },
  logo: {
    maxWidth: "200px", 
    display: "block", 
    marginLeft: "auto", 
    marginRight: "auto",
    marginBottom: "2em"
  }
}

const LoginPage = (props) => {

  const login = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
    //   firebase.auth().signInWithPopup(provider);
    // });
    firebase.auth().signInWithPopup(provider);
  }

    if (props.user === false) {
      return (null);
    }
    if (props.user === null) {
      return (
        <div
          style={styles.container}
        >
          <img src={UDLogo} alt="logo" style={styles.logo}/>
          <h2>To proceed, please login below</h2>
          <Button
            style={styles.button}
            color="primary"
            variant="contained"
            onClick={() => login()}
          >
            Login
          </Button>
        </div>
      );
    }
    else {
      return (
        <Redirect to={{ pathname: "/" }} />
      );
    }
}

export default LoginPage;