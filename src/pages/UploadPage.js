import React from 'react';
import firebase from 'firebase';
import Menu from '../components/menu';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import YAML from 'yaml';

let reader;

class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "",
      success: true,
      fileName: "",
      questions: [],
    };

    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.handleJSONRead = this.handleJSONRead.bind(this);
    this.handleYAMLRead = this.handleYAMLRead.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this);
    this.approveQuestions = this.approveQuestions.bind(this);
  }

  handleFileChosen(file) {
    this.setState({ fileName: file.name, questions: [] });
    let ext = file.name.split('.').pop();
    reader = new FileReader();

    switch (ext) {
      case "json":
        reader.onloadend = this.handleJSONRead;
        break;
      case "yaml":
        reader.onloadend = this.handleYAMLRead;
        break;
      default:
        reader.onloadend = this.handleJSONRead;
        break;
    }
    reader.readAsText(file);
  }

  handleJSONRead() {
    const content = reader.result;
    let jayson;
    try {
      jayson = JSON.parse(content);
    }
    catch(e) {
      this.showSnackbar(false, e.message);
    }
    for (let i in jayson) {
      let yeet = this.state.questions;
      this.setState({ questions: yeet.concat(jayson[i])});
    }
  }

  handleYAMLRead() {
    const content = reader.result;
    let yaml;
    try {
      yaml = YAML.parse(content);
    }
    catch(e) {
      this.showSnackbar(false, e.message);
    }
    for (let i in yaml) {
      let yeet = this.state.questions;
      this.setState({ questions: yeet.concat(yaml[i])});
    }
  }

  approveQuestions() {
    this.state.questions.forEach((q) => {
      this.submitQuestion(q);
    });
    this.setState({ questions: [] });
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

        <input
          onChange={(e) => this.handleFileChosen(e.target.files[0])}
          style={{display: "none"}}
          accept=".json, .yaml"
          id="outlined-button-file"
          multiple
          type="file"
        />

        <label htmlFor="outlined-button-file">
          <Button variant="outlined" component="span">
            Upload 
            <PublishIcon />
          </Button>
        </label>

        <br />

        {this.state.questions.length !== 0 ? 
          <div>
            <h3>Approve questions to upload:</h3>
            {this.state.questions.map((q, key) => 
              <div key={key}>
                {q.question}
              </div>
            )}
            <br />
            <Button onClick={this.approveQuestions} variant="outlined" component="span">
              Approve
              <CheckIcon />
            </Button>
          </div>
        :
          null
        }

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