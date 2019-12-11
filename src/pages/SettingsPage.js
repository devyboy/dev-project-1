import React from 'react';
import Menu from "../components/menu";
import { Switch, 
  FormControl, 
  FormLabel, 
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
    if (document.getElementById("dark")) {
      this.setState({ dark: true });
    }
  }

  darkMode(dark) {
    if (dark) {
      if (!document.getElementById("dark")) {
        let sheet = document.createElement('link');
        sheet.id = "dark";
        sheet.rel = 'stylesheet';
        sheet.href = "./dark.css";
        sheet.type = 'text/css';
        document.head.appendChild(sheet);
      }   
    }
    else {
      let sheet = document.getElementById("dark")
      if (sheet) {
        sheet.remove();
      }
    }
  }

  applySettings() {
    this.darkMode(this.state.dark);
  }

  render() {
    return (
      <div className="App">
        <Menu path={["Settings"]} />

        <FormControl component="fieldset">
          <FormLabel component="legend">Settings</FormLabel>
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