import React from 'react';
import Menu from '../components/menu';

class Generate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <div className="App">
        <Menu />
        <h2>Generate Exam</h2>
      </div>
    );
  }
}

export default Generate;