import React from "react";
import Menu from '../components/menu';

function FourOhFour(props) {
  return (
    <div className="App">
      <Menu path={["404"]} />
      <h1>{props.location.pathname} not found</h1>
    </div>
  );
}

export default FourOhFour;