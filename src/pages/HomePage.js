import React from 'react';
import { Redirect } from "react-router-dom";
import Menu from '../components/menu';
import Forms from '../components/forms';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import '../App.css';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.openSnackbar = this.openSnackbar.bind(this);
  }

  openSnackbar(success, message) {
    this.setState({ message: message, success: success, open: true });
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
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={this.state.open}
              autoHideDuration={6000}
              onClose={() => this.setState({ open: false })}
              message={<span id="message-id">{this.state.message}</span>}
              action={
                this.state.success ? <CheckIcon /> : <CloseIcon />
              }
            />
          </div>
        }
      </div>
    );
  }
}

export default HomePage;
