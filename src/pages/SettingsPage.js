import React from 'react';
import { Redirect } from "react-router-dom";
import Menu from "../components/menu";

const SettingsPage = () => {

  if (this.props.user === false) {
    return (null);
  }
  this.fetchData();
  return (
    <div className="App">
      {!this.props.user ?
        <Redirect to={"/login"} />
        :
        <Menu path="Settings" />
      }
    </div>
  );
}

export default SettingsPage;