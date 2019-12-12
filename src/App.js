import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreatePage from './pages/CreatePage';
import ViewEditPage from './pages/ViewEditPage';
import GeneratePage from './pages/GeneratePage';
import FourOhFour from "./pages/FourOhFour";
import LoginPage from "./pages/LoginPage";
import ExamPage from "./pages/ExamPage";
import SettingsPage from "./pages/SettingsPage";
import { firebaseConfig } from "./config.js";
import './css/App.css';
import './css/bootstrap.min.css';

// Firebase Credentials

var config = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  databaseURL: firebaseConfig.databaseURL,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
};

firebase.initializeApp(config);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userObject: false,
    };

    // When the user logs in, set userObject to them
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ userObject: user });
    });

    this.update = this.update.bind(this);
  }

  update() {
    this.forceUpdate();
  }

  darkMode() {
    let dark = document.cookie.slice(5, document.cookie.length);
    if (dark === "true") {
      if (!document.getElementById("dark")) {
        let sheet = document.createElement('link');
        sheet.id = "dark";
        sheet.rel = 'stylesheet';
        sheet.href = "./dark.css";
        sheet.type = 'text/css';
        document.head.appendChild(sheet);
      }   
    }
    else {
      let sheet = document.getElementById("dark")
      if (sheet) {
        sheet.remove();
      }
    }
  }

  render() {
    this.darkMode();

    return (
      !this.state.userObject
        ?
        <LoginPage user={this.state.userObject} />
        :
        <Router>
          <Switch>
            <Route exact path="/" render={(props) => <CreatePage {...props} user={this.state.userObject} />} />
            <Route exact path="/create" render={(props) => <CreatePage {...props} user={this.state.userObject} />} />
            <Route exact path="/view-edit" render={(props) => <ViewEditPage {...props} user={this.state.userObject} />} />
            <Route exact path="/generate" render={(props) => <GeneratePage {...props} user={this.state.userObject} />} />
            <Route exact path="/exam" render={(props) => <ExamPage {...props} user={this.state.userObject} />} />
            <Route exact path="/settings" render={(props) => <SettingsPage {...props} user={this.state.userObject} update={this.update} />} />
            <Route render={(props) => <FourOhFour {...props} user={this.state.userObject} />} />
          </Switch>
        </Router >
    );
  }
}

export default App;