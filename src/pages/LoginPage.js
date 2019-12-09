import React from 'react'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
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
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "2em"
  }
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersArr: []
    };

    this.login = this.login.bind(this);
  }

  componentDidMount() {
    let temp = [];
    firebase.firestore().collection('users').get().then(snapshot => {
      snapshot.forEach(doc => {
        temp.push(doc.id);
      });
      this.setState({ usersArr: temp });
    }).catch(err => {
      console.log(err.message);
    });
  }

  componentWillUnmount() {
    firebase.firestore().terminate();
  }

  login() {
    let kapp = this.state.usersArr;
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function () {
      firebase.auth().signInWithPopup(provider)
        .then((authObj) => {
          if (!kapp.includes(authObj.user.email)) {
            alert("You are unauthorized to access this application. Please contact an administrator.");
            firebase.auth().signOut();
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  }

  render() {
    if (this.props.user === null) {
      return (
        <div
          style={styles.container}
        >
          <img src={UDLogo} alt="logo" style={styles.logo} />
          <h2>To proceed, please login below</h2>
          <Button
            style={styles.button}
            color="primary"
            variant="contained"
            onClick={() => this.login()}
          >
            Login
            </Button>
        </div>
      );
    }
    else {
      return(
        () => window.location.href = "/"
      );
    }
  }
}

export default LoginPage;