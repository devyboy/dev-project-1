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

// initialize the firebase portion of the app 

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
    this.forceUpdate(); // called when someone applies settings from the Settings page, updates the entire app
  }

  darkMode() {
    let dark = document.cookie.slice(5, document.cookie.length); 
    if (dark === "true") { // check if the cookie has darkmode set to true
      if (!document.getElementById("dark")) { // if there isn't a darkmode stylesheet already existing, make it
        let sheet = document.createElement('link');
        sheet.id = "dark";
        sheet.rel = 'stylesheet';
        sheet.href = "css/dark.css";
        document.head.appendChild(sheet); // add it to the head of the html file
      }
    }
    else { // if the darkmode cookie is set to false
      let sheet = document.getElementById("dark") // if the stylesheet does exist
      if (sheet) {
        sheet.remove(); // remove it because that means they're turning darkmode off
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
          {/* // runs when lazily loading pages */}
          <Suspense
            fallback={null} // fallback is an element to show while loading like a spinner or something
          >
            <Switch>
              <Route exact path="/" render={(props) => <CreatePage {...props} user={this.state.userObject} />} />
              <Route exact path="/create" render={(props) => <CreatePage {...props} user={this.state.userObject} />} />
              <Route exact path="/view-edit" render={(props) => <ViewEditPage {...props} user={this.state.userObject} />} />
              <Route exact path="/generate" render={(props) => <GeneratePage {...props} user={this.state.userObject} />} />
              <Route exact path="/exam" render={(props) => <ExamPage {...props} user={this.state.userObject} />} />
              <Route exact path="/settings" render={(props) => <SettingsPage {...props} user={this.state.userObject} update={this.update} />} />
              <Route render={(props) => <FourOhFour {...props} user={this.state.userObject} />} /> 
              {/* the last route in the switch is the 404 since nothing else matched */}
            </Switch>
          </Suspense>
        </Router >
    );
  }
}

export default App;