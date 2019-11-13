import React from 'react';
import '../App.css';
import Menu from '../components/menu';
import Forms from '../components/forms';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      success: true,
      currentPage: 1,
    };

    this.openSnackbar = this.openSnackbar.bind(this);
  }

  openSnackbar(success, message) {
    this.setState({ message: message, success: success, open: true });
  }

  render() {

    return (
      <div className="App">
        <Menu />
        <h2>Create A Question</h2>
        <hr style={{width: "80%"}} />
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
    );
  }
}

export default HomePage;
