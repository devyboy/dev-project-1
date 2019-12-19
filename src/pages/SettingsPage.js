import React from 'react';
import Menu from "../components/menu";
import { 
  Switch, 
  FormControl, 
  FormGroup, 
  FormControlLabel,
  Button
} from "@material-ui/core";


class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: false
    }

    this.applySettings = this.applySettings.bind(this);
  }

  componentDidMount() {
    // if the dark stylesheet is already applied, set the switch to active
    if (document.getElementById("dark")) { 
      this.setState({ dark: true });
    }
  }

  darkMode(dark) {
    document.cookie = `dark=${dark}`; // add the darkmode key to the browser cookie
  }

  applySettings() {
    this.darkMode(this.state.dark);
    this.props.update(); // call the update function from App.js to update the entire app
  }

  render() {
    return (
      <div className="App">
        <Menu path={["Settings"]} />

        <FormControl component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={<Switch
                checked={this.state.dark}
                onChange={() => this.setState({ dark: !this.state.dark })}
                color="primary"
              />}
              label="Dark Mode"
            />
          </FormGroup>
        </FormControl>
        <br />
        <Button 
          variant="contained"
          color="primary"
          onClick={this.applySettings}
          style={{display: 'inline-block'}}
        >
          Apply
        </Button>
      </div>
    );
  }

}

export default SettingsPage;