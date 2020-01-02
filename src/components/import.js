import React from 'react';
import firebase from 'firebase/app';
import "firebase/firestore";
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import YAML from 'yaml';
import "../css/import.css";

let reader; // declare the file reader globally

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
    this.setState({ questions: [] }); // reset the questions everytime they choose a file
    let ext = file.name.split('.').pop(); // get the file extension
    reader = new FileReader();

    switch (ext) { // use the various reading functions depending on the type of file it is
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
      this.setState(state => ({
        questions: state.questions.concat(jayson[i])
      }));
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
      this.setState(state => ({
        questions: state.questions.concat(yaml[i])
      }));
    }
  }

  approveQuestions() {
    this.state.questions.forEach((q) => {
      this.submitQuestion(q); // loop through the questions and submit each one to firebase
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
        {this.state.questions.length !== 0 ? // show approve message when they upload questions
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
              <p>
                You can import multiple questions at a time by uploading a data file containing the question objects
                <br />
                Supported file types: <strong>.json and .yaml</strong>
              </p>
              <input
                onChange={(e) => this.handleFileChosen(e.target.files[0])}
                style={{ display: "none" }}
                accept=".json, .yaml"
                id="outlined-button-file"
                multiple
                type="file"
              />

              <label htmlFor="outlined-button-file">
                <Button component="div" variant="contained" color="primary">
                  Upload
                  <PublishIcon />
                </Button>
              </label>
            </div>

            <div id="stackedit__html" style={{ marginTop: "3em" }}>
              <h2>API Reference</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>question</td>
                    <td>String</td>
                    <td>The actual text content of the question</td>
                    <td>"What is 2+2?"</td>
                  </tr>
                  <tr>
                    <td>answer</td>
                    <td>String</td>
                    <td>The answer of the question</td>
                    <td>"4"</td>
                  </tr>
                  <tr>
                    <td>topic</td>
                    <td>String</td>
                    <td>The overarching topic or subject the question is related to</td>
                    <td>"Addition"</td>
                  </tr>
                  <tr>
                    <td>unit</td>
                    <td>String</td>
                    <td>The chapter and/or section the question is related to</td>
                    <td>"Chapter 6"</td>
                  </tr>
                  <tr>
                    <td>SLO</td>
                    <td>String[*]</td>
                    <td>Student Learning Objectives: short phrases detailing what the question aims to teach the student</td>
                    <td>["Demonstrates understanding of addition", "Can add two numbers together", "Knows how numbers work"]</td>
                  </tr>
                  <tr>
                    <td>type</td>
                    <td>String</td>
                    <td>The type of question: Multiple Choice, True/False, Programming, or Free Response</td>
                    <td>"Multiple Choice"</td>
                  </tr>
                  <tr>
                    <td>diff</td>
                    <td>String</td>
                    <td>The difficulty of the question: Easy, Medium, or Challenging</td>
                    <td>"Medium"</td>
                  </tr>
                  <tr>
                    <td>pre</td>
                    <td>String</td>
                    <td>The course prefix without the number</td>
                    <td>"CISC"</td>
                  </tr>
                  <tr>
                    <td>course</td>
                    <td>String</td>
                    <td>The course number</td>
                    <td>"108"</td>
                  </tr>
                  <tr>
                    <td>cog</td>
                    <td>String</td>
                    <td>The cognitive level of the question, see <a href="http://www.celt.iastate.edu/teaching/effective-teaching-practices/revised-blooms-taxonomy/">Bloom's Taxonomy</a></td>
                    <td>"Applying"</td>
                  </tr>
                  <tr>
                    <td>choices</td>
                    <td>String[4]</td>
                    <td>The answer choices if the question type is multiple choice. Currently only supports 4 choices</td>
                    <td>["10", "12", "4", "999"]</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'inline-block', margin: "3em" }}>
                <Button variant="contained" color="primary" component="a" href="./test.json" download>
                  Example JSON file
                </Button>
              </div>

            </div>
          </div >
        }
      </div>
    )
  }
}

export default Import;