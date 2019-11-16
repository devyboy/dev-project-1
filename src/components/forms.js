import React from 'react';
import firebase from "firebase";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Editor from 'for-editor'
import Chip from '@material-ui/core/Chip';


const styles = {
  multChoice: {
    width: "300px"
  }
}

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      value: "",
      questions: [],
      SLOarray: props.editingQuestion ? props.editingQuestion[1].SLO : [],
      choices: props.editingQuestion ? props.editingQuestion[1].choices : [],

      question: props.editingQuestion ? props.editingQuestion[1].question : "",
      unit: props.editingQuestion ? props.editingQuestion[1].unit : "",
      topic: props.editingQuestion ? props.editingQuestion[1].topic : "",
      answer: props.editingQuestion ? props.editingQuestion[1].answer : "",
      cog: props.editingQuestion ? props.editingQuestion[1].cog : "",
      diff: props.editingQuestion ? props.editingQuestion[1].diff : "",
      SLO: "",
      isMult: props.editingQuestion ? (props.editingQuestion[1].type === "Multiple Choice") : "",
      type: props.editingQuestion ? props.editingQuestion[1].type : "",
      course: props.editingQuestion ? props.editingQuestion[1].course : "",
      pre: props.editingQuestion ? props.editingQuestion[1].pre : "",
    }

    this.submitQuestion = this.submitQuestion.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleCogChange = this.handleCogChange.bind(this);
    this.handleDiffChange = this.handleDiffChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleChoicesChange = this.handleChoicesChange.bind(this);
    this.handleSLOChange = this.handleSLOChange.bind(this);
    this.handleCourseChange = this.handleCourseChange.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.addSLO = this.addSLO.bind(this);
    this.deleteSLO = this.deleteSLO.bind(this);
    this.handlePreChange = this.handlePreChange.bind(this);
  }

  handleQuestionChange(value) {
    this.setState({ question: value });
  }

  addSLO(event) {
    if (event.keyCode === 13) { // If they press the Enter key (which is number 13), add to SLO list
      if (!this.state.SLOarray.includes(event.target.value)) {
        this.setState({ SLOarray: this.state.SLOarray.concat(event.target.value), SLO: "" });
      }
    }
  }

  handleUnitChange(event) {
    this.setState({ unit: event.target.value });
  }

  handleTopicChange(event) {
    this.setState({ topic: event.target.value });
  }

  deleteSLO(label) {
    this.setState({
      SLOarray: this.state.SLOarray.filter((slo) =>
        slo !== label
      )
    });
  }

  handleAnswerChange(value) {
    this.setState({ answer: value });
  }

  handleCogChange(event) {
    this.setState({ cog: event.target.value });
  }

  handleDiffChange(event) {
    this.setState({ diff: event.target.value });
  }

  handleTypeChange(event) {
    this.setState({ isMult: event.target.value === "Multiple Choice" });
    this.setState({ type: event.target.value });
  }

  handleSLOChange(event) {
    this.setState({ SLO: event.target.value });
  }

  handleCourseChange(event) {
    this.setState({ course: event.target.value });
  }

  handleChoicesChange(letter, event) {
    let temp = this.state.choices;
    switch (letter) {
      case "A":
        temp[0] = event.target.value;
        break;
      case "B":
        temp[1] = event.target.value;
        break;
      case "C":
        temp[2] = event.target.value;
        break;
      case "D":
        temp[3] = event.target.value;
        break;
      default:
        break;
    }
    this.setState({ choices: temp });
  }

  resetState(success, message) {
    this.setState({
      questions: [],
      choices: [],
      isMult: false,

      question: "",
      unit: "",
      topic: "",
      answer: "",
      cog: "",
      diff: "",
      SLO: "",
      SLOarray: [],
      type: "",
      course: "",
      pre: "",
    });

    this.props.openSnackbar(success, message);
  }

  submitQuestion() {
    let questionsRef = firebase.firestore().collection('questions');
    if (!this.state.isMult) {
      this.setState({ choices: [] });
    }
    questionsRef.add({
      question: this.state.question,
      unit: this.state.unit,
      pre: this.state.pre,
      course: this.state.course,
      topic: this.state.topic,
      answer: this.state.answer,
      cog: this.state.cog,
      diff: this.state.diff,
      type: this.state.type,
      choices: this.state.choices,
      SLO: this.state.SLOarray
    })
      .then(this.resetState(true, "Question saved"))
      .catch(err => {
        this.resetState(false, err);
      })
  }

  updateQuestion(state) {
    let questionsRef = firebase.firestore().collection('questions');
    if (!state.isMult) {
      state.choices = [];
    }
    questionsRef.doc(this.props.editingQuestion[0]).update({
      question: state.question,
      unit: state.unit,
      course: state.course,
      topic: state.topic,
      answer: state.answer,
      cog: state.cog,
      pre: state.pre,
      diff: state.diff,
      type: state.type,
      choices: state.choices,
      SLO: state.SLOarray,
    })
      .then(this.resetState(true, "Question updated"))
      .catch(err => {
        this.resetState(false, err);
      });
  }

  handlePreChange(event) {
    this.setState({ pre: event.target.value })
  }

  render() {
    return (
      <div style={{ width: "65%", margin: '0 auto', marginTop: this.props.isEditing ? "0em" : "2.5em" }}>
        <form>
          <div>
            <TextField
              style={{ width: 75 }}
              label="Course"
              margin="normal"
              onChange={this.handlePreChange}
              value={this.state.pre}
              select
            >
              <MenuItem value="CISC">CISC</MenuItem>
              <MenuItem value="CPEG">CPEG</MenuItem>
              <MenuItem value="MISY">MISY</MenuItem>
            </TextField>
            <TextField
              style={{ width: 50, marginLeft: 10 }}
              label="#"
              margin="normal"
              type="number"
              onChange={this.handleCourseChange}
              value={this.state.course}
            />

            <TextField
              style={{ width: 150, marginLeft: "1em" }}
              label="Question Type"
              margin="normal"
              onChange={this.handleTypeChange}
              value={this.state.type}
              select
            >
              <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
              <MenuItem value="Free Response">Free Response</MenuItem>
              <MenuItem value="Programming">Programming</MenuItem>
            </TextField>

            <TextField
              style={{ width: 150, marginLeft: "1em" }}
              label="Difficulty"
              margin="normal"
              onChange={this.handleDiffChange}
              value={this.state.diff}
              select
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Challenging">Challenging</MenuItem>
            </TextField>
          </div>

          <div>
            <TextField
              style={{ width: 157 }}
              label="Topic"
              margin="normal"
              onChange={this.handleTopicChange}
              value={this.state.topic}
            />

            <TextField
              style={{ width: 130, marginLeft: "1em" }}
              label="Unit"
              margin="normal"
              onChange={this.handleUnitChange}
              value={this.state.unit}
            />

            <TextField
              style={{ width: 150, marginLeft: "1em" }}
              label="Cognitive Level"
              margin="normal"
              onChange={this.handleCogChange}
              value={this.state.cog}
              select
            >
              <MenuItem value="Remembering">Remembering</MenuItem>
              <MenuItem value="Understanding">Understanding</MenuItem>
              <MenuItem value="Applying">Applying</MenuItem>
              <MenuItem value="Analyzing">Analyzing</MenuItem>
              <MenuItem value="Evaluating">Evaluating</MenuItem>
              <MenuItem value="Creating">Creating</MenuItem>
            </TextField>

          </div>

          <div>
            <TextField
              style={{ width: 470 }}
              label="SLO(s)"
              margin="normal"
              onChange={this.handleSLOChange}
              onKeyDown={this.addSLO}
              value={this.state.SLO}
            />
          </div>
        </form>

        {this.state.SLOarray ? this.state.SLOarray.map((slo, key) => {
          return (
            <Chip
              style={{ margin: '5px' }}
              key={key}
              onDelete={() => this.deleteSLO(slo)}
              label={slo}
            />
          );
        })
          :
          null
        }

        <h5 style={{ textAlign: "left", marginTop: "2em" }}>Question:</h5>
        <Editor
          placeholder="Enter question here..."
          onChange={this.handleQuestionChange}
          value={this.state.question}
          toolbar={{
            h1: true,
            h2: true,
            h3: true,
            img: true,
            code: true,
            preview: true,
            expand: true,
            undo: true,
            redo: true,
            subfield: true
          }}
          style={{ height: '300px', width: '100%' }}
          language="en"
          subfield
          lineNum
          preview
        />

        <br />

        <h5 style={{ textAlign: "left", marginTop: "1em" }}>Answer:</h5>

        <div style={{ width: '100%' }}>
          <Editor
            placeholder="Enter answer here..."
            onChange={this.handleAnswerChange}
            value={this.state.answer}
            toolbar={{
              h1: true,
              h2: true,
              h3: true,
              code: true,
              preview: true,
              expand: true,
              undo: true,
              redo: true,
              subfield: true
            }}
            style={{ height: '300px', width: '100%' }}
            language="en"
            subfield
            lineNum
            preview
          />
        </div>
        {this.state.isMult ?
          <div style={{width: "300px"}}>
            <h5 style={{ textAlign: "left", marginTop: "2em" }}>Answer Choices:</h5>

            <div style={{marginRight: "auto"}}>
              <TextField
                style={styles.multChoice}
                onChange={(e) => this.handleChoicesChange("A", e)}
                value={this.state.choices[0]}
                InputProps={{
                  startAdornment: <InputAdornment position="start">A.</InputAdornment>
                }}
              />
            </div>

            <div>
              <TextField
                style={styles.multChoice}
                onChange={(e) => this.handleChoicesChange("B", e)}
                value={this.state.choices[1]}
                InputProps={{
                  startAdornment: <InputAdornment position="start">B.</InputAdornment>
                }}
              />
            </div>

            <div>
              <TextField
                style={styles.multChoice}
                onChange={(e) => this.handleChoicesChange("C", e)}
                value={this.state.choices[2]}
                InputProps={{
                  startAdornment: <InputAdornment position="start">C.</InputAdornment>
                }}
              />
            </div>

            <div>
              <TextField
                style={styles.multChoice}
                onChange={(e) => this.handleChoicesChange("D", e)}
                value={this.state.choices[3]}
                InputProps={{
                  startAdornment: <InputAdornment position="start">D.</InputAdornment>
                }}
              />
            </div>
          </div>
          :
          null
        }

        <Button
          variant="contained"
          color="primary"
          onClick={this.props.isEditing ? () => { this.updateQuestion(this.state); this.props.closeFn(); } : this.submitQuestion}
          style={{ marginTop: '2em' }}
        >
          {this.props.isEditing ? 'Update' : 'Submit'}
        </Button>

      </div >
    )
  }
}

export default Forms;