import React, { Suspense, lazy } from "react";
import { firebaseConfig } from "../config.js";
import firebase from "firebase/app";
import "firebase/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./LoginPage";
import '../css/App.css';
import '../css/strapboot.css';

// Lazy load the pages for better performance

const CreatePage = lazy(() => import('./CreatePage'));
const ViewEditPage = lazy(() => import('./ViewEditPage'));
const GeneratePage = lazy(() => import('./GeneratePage'));
const ExamPage = lazy(() => import('./ExamPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));
const FourOhFour = lazy(() => import('./FourOhFour'));

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
        sheet.href = "css/dark.css";
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
          <Suspense
            fallback={null}
          >
            <Switch>
              <Route exact path="/" render={(props) => <CreatePage {...props} user={this.state.userObject} />} />
              <Route exact path="/create" render={(props) => <CreatePage {...props} user={this.state.userObject} />} />
              <Route exact path="/view-edit" render={(props) => <ViewEditPage {...props} user={this.state.userObject} />} />
              <Route exact path="/generate" render={(props) => <GeneratePage {...props} user={this.state.userObject} />} />
              <Route exact path="/exam" render={(props) => <ExamPage {...props} user={this.state.userObject} />} />
              <Route exact path="/settings" render={(props) => <SettingsPage {...props} user={this.state.userObject} update={this.update} />} />
              <Route render={(props) => <FourOhFour {...props} user={this.state.userObject} />} />
            </Switch>
          </Suspense>
        </Router >
    );
  }
}

export default App;