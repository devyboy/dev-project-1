import React from "react";
import firebase from "firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from './pages/HomePage';
import ViewEditPage from './pages/ViewEditPage';
import UploadPage from './pages/UploadPage';
import GeneratePage from './pages/GeneratePage';
import FourOhFour from "./pages/FourOhFour";
import LoginPage from "./pages/LoginPage";
import './App.css';
import './bootstrap.min.css';

// Firebase Credentials
var config = {
    apiKey: "AIzaSyA-PcLom0MmPjP-rc9WL2dxs8HsD9QFdag",
    authDomain: "ayylmao-5b8f8.firebaseapp.com",
    databaseURL: "https://ayylmao-5b8f8.firebaseio.com",
    projectId: "ayylmao-5b8f8",
    storageBucket: "ayylmao-5b8f8.appspot.com",
    messagingSenderId: "1060743996645",
    appId: "1:1060743996645:web:7d96b40912d25ffb84e00c"
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
                    <Route exact path="/login" render={(props) => <LoginPage {...props} user={this.state.userObject} />} />
                    <Route render={(props) => <FourOhFour {...props} user={this.state.userObject} />} />
                </Switch>
            </Router>
        );
    }
}

export default App;