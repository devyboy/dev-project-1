import React from 'react';
import firebase from 'firebase/app';
import "firebase/firestore";
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import YAML from 'yaml';

let reader;
let styles = {
  page: {
    marginTop: '3em'
  }
}

class Import extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
    };

    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.handleJSONRead = this.handleJSONRead.bind(this);
    this.handleYAMLRead = this.handleYAMLRead.bind(this);
    this.approveQuestions = this.approveQuestions.bind(this);
  }

  handleFileChosen(file) {
    this.setState({ questions: [] });
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
    catch (e) {
      this.showSnackbar(false, e.message);
    }
    for (let i in jayson) {
      let yeet = this.state.questions;
      this.setState({ questions: yeet.concat(jayson[i]) });
    }
  }

  handleYAMLRead() {
    const content = reader.result;
    let yaml;
    try {
      yaml = YAML.parse(content);
    }
    catch (e) {
      this.showSnackbar(false, e.message);
    }
    for (let i in yaml) {
      let yeet = this.state.questions;
      this.setState({ questions: yeet.concat(yaml[i]) });
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
      pre: q.pre,
    })
      .then(
        this.props.openSnackbar(true, "Question(s) saved"))
      .catch(err => {
        this.props.openSnackbar(false, err.message);
      });
  }

  render() {
    return (
      <div style={styles.page}>
        {this.state.questions.length !== 0 ?
          <div>
            <h4>Approve the following questions for upload:</h4>
            {this.state.questions.map((q, key) =>
              <div key={key}>
                {q.question}
              </div>
            )}

            <br />

            <Button style={{ marginRight: "1em" }} onClick={this.approveQuestions} variant="contained" color="primary">
              Approve
              <CheckIcon />
            </Button>
            <Button onClick={() => this.setState({ questions: [] })} variant="contained" color="secondary">
              Try Again
              <CloseIcon />
            </Button>
          </div>
          :
          <div>
            <div style={{ display: 'inline-block' }}>
              <p>Supported file types: <strong>.json and .yaml</strong></p>
              <input
                onChange={(e) => this.handleFileChosen(e.target.files[0])}
                style={{ display: "none" }}
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
            </div>

            <div style={{ display: 'inline-block', marginLeft: "3em" }}>
              <p>Example JSON File</p>
              <Button variant="outlined" component="a" href="./test.json">
                View Example JSON
              </Button>
            </div>

          </div>
        }
      </div>
    )
  }
}

export default Import;