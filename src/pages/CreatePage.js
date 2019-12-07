import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Menu from '../components/menu';
import Forms from '../components/forms';
import CustomSnackbar from '../components/customSnackbar';
import Import from '../components/import';
import '../App.css';


class CreatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
  }

  openSnackbar(success, message) {
    this.setState({ snackSuccess: success, snackMessage: message, snackOpen: true });
  }

  handleChange(evt, val) {
    this.setState({ value: val });
  }


  render() {
    return (
      <div className="App">

        <Menu path={["Create"]} />
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Create" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
          <Tab label="Import" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
        </Tabs>
        {this.state.value === 0
          ?
          <Forms openSnackbar={this.openSnackbar} />
          :
          <Import openSnackbar={this.openSnackbar} />
        }
        <br />
        <CustomSnackbar
          message={this.state.snackMessage}
          success={this.state.snackSuccess}
          closeSnack={() => this.setState({ snackOpen: false })}
          open={this.state.snackOpen}
        />
      </div>
    );
  }
}

export default CreatePage;
