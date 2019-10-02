import React from 'react';
import firebase from 'firebase';
import Menu from '../components/menu';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
let reader;

class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "",
      success: true,
    };

    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this);
  }

  handleFileChosen(file) {
    reader = new FileReader();
    reader.onloadend = this.handleFileRead;
    reader.readAsText(file);
  }

  handleFileRead(e) {
    const content = reader.result;
    const jayson = JSON.parse(content);
    for (let i in jayson) {
      this.submitQuestion(jayson[i]);
    }
  }

  submitQuestion(q) {
    let questionsRef = firebase.firestore().collection('questions');
    questionsRef.add({
      question: q.question,
      unit: q.unit,
      course: q.course,
      topic: q.topic,
      answer: q.answer,
      cog: q.cog,
      diff: q.diff,
      type: q.type,
      choices: q.choices,
      SLO: q.SLO,
    }).then(this.showSnackbar(true, "Question(s) saved"))
      .catch(err => {
        this.showSnackbar(false, err);
      })
  }

  showSnackbar(success, message) {
    this.setState({ open: true, success: success, message: message });
  }

  render() {
    return(
      <div className="App">
        <Menu />
        <input type="file" accept=".json" onChange={(e) => this.handleFileChosen(e.target.files[0])} />
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
    )
  }
}

export default UploadPage;