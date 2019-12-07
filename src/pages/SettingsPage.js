import React from 'react';
import { Redirect } from "react-router-dom";
import Menu from "../components/menu";

const SettingsPage = (props) => {

  if (props.user === false) {
    return (null);
  }
  return (
    <div className="App">
      {!props.user ?
        <Redirect to={"/login"} />
        :
        <Menu path={["Settings"]} />
      }
    </div>
  );
}

export default SettingsPage;