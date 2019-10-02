import React from "react";
import firebase from "firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from './pages/HomePage';
import ViewEditPage from './pages/ViewEditPage';
import UploadPage from './pages/UploadPage';
import GeneratePage from './pages/GeneratePage';
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

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/create" render={(props) => <HomePage {...props} />} />
                <Route exact path="/" render={(props) => <HomePage {...props} />} />
                <Route exact path="/view-edit" render={(props => <ViewEditPage {...props} />)} />
                <Route exact path="/upload" render={(props => <UploadPage {...props} />)} />
                <Route exact path="/generate" render={(props => <GeneratePage {...props} />)} />
                <Route render={(props) => <FourOhFour {...props} />} />
            </Switch>
        </Router>
    );
}

export default App;