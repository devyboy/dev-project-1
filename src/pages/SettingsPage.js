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
      dark: false,
    }

    this.applySettings = this.applySettings.bind(this);
  }

  componentDidMount() {
    let cookie = document.cookie // parse the browser cookie
      .split(';')
      .reduce((res, c) => {
        const [key, val] = c.trim().split('=').map(decodeURIComponent)
        try {
          return Object.assign(res, { [key]: JSON.parse(val) })
        } catch (e) {
          return Object.assign(res, { [key]: val })
        }
      }, {});
    // if the dark stylesheet is already applied, set the switch to active
    this.setState({ dark: cookie.dark });
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
        <div style={{ marginBottom: '2em' }}>
          <h2>Appearance</h2>
          <hr style={{width: "30%"}}/>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={<Switch
                  checked={this.state.dark}
                  onChange={() => this.setState({ dark: !this.state.dark })}
                  color="primary"
                />}
                labelPlacement="start"
                label="Dark Mode"
              />
              {/* <FormControlLabel
                control={<Switch
                  checked={this.state.dark}
                  onChange={() => this.setState({ dark: !this.state.dark })}
                  color="primary"
                />}
                labelPlacement="start"  
                label="Compact View"
              /> */}
            </FormGroup>
          </FormControl>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.applySettings}
          style={{ display: 'inline-block' }}
        >
          Apply
        </Button>
      </div>
    );
  }

}

export default SettingsPage;