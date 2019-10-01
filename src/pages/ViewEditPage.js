import React from 'react';
import Menu from '../components/menu'

class ViewEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <div className="App">
        <Menu />
        <h2>View/Edit Questions</h2>
      </div>
    );
  }
}

export default ViewEdit;