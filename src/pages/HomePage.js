import React from 'react';
import { Redirect } from "react-router-dom";
import Menu from '../components/menu';
import Forms from '../components/forms';
import CustomSnackbar from '../components/customSnackbar';
import OfflineNotify from "../components/offlineNotify";
import '../App.css';
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.openSnackbar = this.openSnackbar.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
    this.closeOfflineNotify = this.closeOfflineNotify.bind(this);
  }

  componentDidMount() {
    if (!navigator.onLine && !this.state.notified) {
      this.setState({ offlineNotify: true, notified: true });
    }
  }
  
  closeOfflineNotify() {
    this.setState({ offlineNotify: false });
  }

  openSnackbar(success, message) {
    this.setState({ snackSuccess: success, snackMessage: message, snackOpen: true });
    console.log(this.state);
  }

  closeSnackbar() {
    this.setState({ snackOpen: false });
  }

  render() {
    if (this.props.user === false) {
      return (null);
    }
    return (
      <div className="App">
        {!this.props.user ?
          <Redirect to={"/login"} />
          :
          <div>
            <Menu />
            <h2>Create A Question</h2>
            <hr style={{ width: "80%" }} />
            <Forms openSnackbar={this.openSnackbar} />
            <br />
            <CustomSnackbar
              message={this.state.snackMessage}
              success={this.state.snackSuccess}
              closeSnack={this.closeSnackbar}
              open={this.state.snackOpen}
            />
            <OfflineNotify open={this.state.offlineNotify} closeNotify={this.closeOfflineNotify} />
          </div>
        }
      </div>
    );
  }
}

export default HomePage;
