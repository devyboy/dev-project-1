import React, { Component } from "react";
import firebase from "firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from './pages/HomePage';
import FourOhFour from "./pages/FourOhFour";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <Router>
                <Switch>
                        <Route exact path="/" render={(props) => <HomePage {...props} />} />
                        <Route component={FourOhFour} />
                </Switch>
            </Router>
        );
    }
}

export default App;