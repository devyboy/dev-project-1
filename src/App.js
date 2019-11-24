import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from './pages/HomePage';
import ViewEditPage from './pages/ViewEditPage';
import UploadPage from './pages/UploadPage';
import GeneratePage from './pages/GeneratePage';
import FourOhFour from "./pages/FourOhFour";
import LoginPage from "./pages/LoginPage";
import ExamPage from "./pages/ExamPage";
import { firebaseConfig } from "./config.js";
import './App.css';
import './bootstrap.min.css';

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
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={(props) => <HomePage {...props} user={this.state.userObject} />} />
                    <Route exact path="/create" render={(props) => <HomePage {...props} user={this.state.userObject} />} />
                    <Route exact path="/view-edit" render={(props) => <ViewEditPage {...props} user={this.state.userObject} />} />
                    <Route exact path="/upload" render={(props) => <UploadPage {...props} user={this.state.userObject} />} />
                    <Route exact path="/generate" render={(props) => <GeneratePage {...props} user={this.state.userObject} />} />
                    <Route exact path="/exam" render={(props) => <ExamPage {...props} user={this.state.userObject} />} />
                    <Route exact path="/login" render={(props) => <LoginPage {...props} user={this.state.userObject} />} />
                    <Route render={(props) => <FourOhFour {...props} user={this.state.userObject} />} />
                </Switch>
            </Router>
        );
    }
}

export default App;