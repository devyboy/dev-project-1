import React, { Component } from 'react';
import '../App.css';
import Menu from '../components/menu';
import Forms from '../components/forms';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      success: true,
    };

    this.openSnackbar = this.openSnackbar.bind(this);
  }

  openSnackbar(success, message) {
    this.setState({ message: message, success: success, open: true });
  }

  // fetchQuestions() {
  //   let questionArray= [];
  //   let questionsRef = firebase.firestore().collection('questions');
  //   questionsRef.get().then(snapshot => {
  //     snapshot.forEach(doc => {
  //       questionArray.push(doc.data().content);
  //       this.setState({ questions: questionArray });
  //     });
  //   }).catch(err => {
  //       console.log(err);
  //   })
  // }

  componentDidMount() {
    //this.fetchQuestions();
  }

  render() {
    return (
      <div className="App">
        <Menu />
        <h2>Create A Question</h2>
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
