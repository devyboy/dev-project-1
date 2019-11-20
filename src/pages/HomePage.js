import React from 'react';
import { Redirect } from "react-router-dom";
import Menu from '../components/menu';
import Forms from '../components/forms';
import CustomSnackbar from '../components/customSnackbar';
import '../App.css';
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.openSnackbar = this.openSnackbar.bind(this);
  }

  openSnackbar(success, message) {
    this.setState({ snackSuccess: success, snackMessage: message, snackOpen: true });
    console.log(this.state);
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
            <Menu path={" / Create"}/>
            <Forms openSnackbar={this.openSnackbar} />
            <br />
            <CustomSnackbar
              message={this.state.snackMessage}
              success={this.state.snackSuccess}
              closeSnack={() => this.setState({ snackOpen: false })}
              open={this.state.snackOpen}
            />
          </div>
        }
      </div>
    );
  }
}

export default HomePage;
