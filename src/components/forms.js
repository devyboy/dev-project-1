import React from 'react';
import firebase from "firebase/app";
import "firebase/firestore";
import {
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Chip,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import Editor from 'for-editor'


const styles = {
  multChoice: {
    width: "350px",
    margin: '.25em',
  },
  container: {
    width: "65%",
    margin: '0 auto',
    marginBottom: "3em",
    marginTop: "1.5em"
  }
}

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // if the form is being used to edit questions from View-Edit, use the props to supply the question data
      // otherwise, just make everything blank when creating a new question 
      SLOarray: props.editingQuestion ? props.editingQuestion.SLO : [],
      choices: props.editingQuestion ? props.editingQuestion.choices : [],
      question: props.editingQuestion ? props.editingQuestion.question : "",
      unit: props.editingQuestion ? props.editingQuestion.unit : "",
      topic: props.editingQuestion ? props.editingQuestion.topic : "",
      answer: props.editingQuestion ? props.editingQuestion.answer : "",
      cog: props.editingQuestion ? props.editingQuestion.cog : "",
      diff: props.editingQuestion ? props.editingQuestion.diff : "",
      isMult: props.editingQuestion ? (props.editingQuestion.type === "Multiple Choice") : "",
      type: props.editingQuestion ? props.editingQuestion.type : "",
      course: props.editingQuestion ? props.editingQuestion.course : "",
      pre: props.editingQuestion ? props.editingQuestion.pre : "",
      // this correct field is the index of the answer choices array that holds the correct answer
      // it corresponds to the 'correct answer' dropdown at the bottom of a multiple choice question
      correct: props.editingQuestion ? props.editingQuestion.choices.indexOf(props.editingQuestion.answer).toString() : ""
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
    this.handleCourseChange = this.handleCourseChange.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.handleSLOChange = this.handleSLOChange.bind(this);
    this.addSLO = this.addSLO.bind(this);
    this.deleteSLO = this.deleteSLO.bind(this);
    this.handlePreChange = this.handlePreChange.bind(this);
    this.handleCorrectChange = this.handleCorrectChange.bind(this);
    this.handleTrueFalseChange = this.handleTrueFalseChange.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentWillUnmount() {
    // once this component mounts, it starts pulling data from firebase, if you render it then
    // derender or navigate away, firebase retains this connection even though it's not being used
    // so this terminates that once the component is not needed anymore
    firebase.firestore().terminate();
  }

  handleQuestionChange(value) {
    this.setState({ question: value });
  }

  handleUnitChange(event) {
    this.setState({ unit: event.target.value });
  }

  handleTopicChange(event) {
    this.setState({ topic: event.target.value });
  }

  handleAnswerChange(value) {
    this.setState({ answer: value });
  }

  handleSLOChange(event) {
    this.setState({ SLO: event.target.value });
  }

  handlePreChange(event) {
    this.setState({ pre: event.target.value })
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

  handleCourseChange(event) {
    this.setState({ course: event.target.value });
  }

  handleCorrectChange(event) {
    // once you choose which answer is correct, this sets the answer field to that choice
    // and also the correct field to the index of that choice, this is just for the dropdown 
    this.setState({ answer: this.state.choices[event.target.value], correct: event.target.value });
  }

  handleTrueFalseChange(event) {
    this.setState({ answer: event.target.value });
  }

  handleChoicesChange(letter, event) {
    // everytime you edit a choice, it sends the letter and the text
    // switch just updates the correct one in the choices array
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

  addSLO(event) {
    // If they press the Enter key (which is key number 13), or leave the text box, add to SLO list
    if (event.keyCode === 13 || event.type === "blur") {
      // no duplicates or empty strings
      if (!this.state.SLOarray.includes(event.target.value) && event.target.value !== "") {
        this.setState(state => ({
          SLOarray: state.SLOarray.concat(this.state.SLO), // append the new SLO to the SLO array field
          SLO: ""
        })
        )
      }
    }
  }

  deleteSLO(label) {
    this.setState(state => ({
      SLOarray: state.SLOarray.filter((slo) => // filter out the SLO's that aren't the one you want to delete
        slo !== label
      )
    }));
  }

  resetState(success, message) {
    this.setState({
      SLOarray: [],
      SLO: "",
      choices: [],
      question: "",
      unit: "",
      topic: "",
      answer: "",
      cog: "",
      diff: "",
      isMult: null,
      type: "",
      course: "",
      pre: "",
      correct: ""
    }, () => this.props.openSnackbar(success, message));
  }

  validateInputs() { // There's probably a better way to do this...
    // if any field is empty, set an error flag to false and record which ones are missing in the state
    let flag = true;
    if (!this.state.course) {
      this.setState({ courseErr: true });
      flag = false;
    }
    else {
      this.setState({ courseErr: false });
    }
    if (!this.state.pre) {
      this.setState({ preErr: true });
      flag = false;
    }
    else {
      this.setState({ preErr: false });
    }
    if (!this.state.type) {
      this.setState({ typeErr: true });
      flag = false;
    }
    else {
      this.setState({ typeErr: false });
    }
    if (!this.state.diff) {
      this.setState({ diffErr: true });
      flag = false;
    }
    else {
      this.setState({ diffErr: false });
    }
    if (!this.state.topic) {
      this.setState({ topicErr: true });
      flag = false;
    }
    else {
      this.setState({ topicErr: false });
    }
    if (!this.state.unit) {
      this.setState({ unitErr: true });
      flag = false;
    }
    else {
      this.setState({ unitErr: false });
    }
    if (!this.state.cog) {
      this.setState({ cogErr: true });
      flag = false;
    }
    else {
      this.setState({ cogErr: false });
    }
    if (this.state.SLOarray.length === 0) {
      this.setState({ sloErr: true });
      flag = false;
    }
    else {
      this.setState({ sloErr: false });
    }
    if (!this.state.question) {
      this.setState({ questionErr: true });
      flag = false;
    }
    else {
      this.setState({ questionErr: false });
    }
    if (!this.state.answer) {
      this.setState({ answerErr: true });
      flag = false;
    }
    else {
      this.setState({ answerErr: false });
    }
    if (this.state.isMult && (this.state.choices.includes(undefined) || this.state.choices.length === 0)) {
      this.setState({ multErr: true });
      flag = false;
    }
    else {
      this.setState({ multErr: false });
    }
    if (this.state.isMult && !this.state.correct) {
      this.setState({ multCorrectErr: true });
      flag = false;
    }
    else {
      this.setState({ multCorrectErr: false });
    }
    if (this.state.type === "True/False" && !this.state.answer) {
      this.setState({ truefalseErr: true });
      flag = false;
    }
    else {
      this.setState({ truefalseErr: false });
    }
    return flag;
  }

  submitQuestion() {
    // this is the reference to the questions collection in firebase
    let questionsRef = firebase.firestore().collection('questions');

    if (!this.validateInputs()) { // if an input isnt filled, go to top and throw error
      window.scrollTo(0, 0);
      this.props.openSnackbar(false, "Please fill every input before submitting");
      return;
    }

    if (!this.state.isMult) {
      this.setState({ choices: [] }); // if the question isnt multiple choice, clear the choices
      // if someone chose multiple choice and filled out the choices but then changed to free response,
      // the choices would still be in the array and sent to the database which is not what we want
    }

    questionsRef.add({
      // send the question to the database
      question: this.state.question,
      unit: this.state.unit,
      pre: this.state.pre,
      course: this.state.course,
      topic: this.state.topic,
      // if multiple choice, find the correct answer in choices and send, else just send the answer
      answer: this.state.isMult ? this.state.choices[this.state.correct] : this.state.answer,
      cog: this.state.cog,
      diff: this.state.diff,
      type: this.state.type,
      choices: this.state.choices,
      SLO: this.state.SLOarray
    })
      .then(() => {
        // once it's done sending, reset the state and show a success message
        this.resetState(true, "Question saved");
        window.scrollTo(0, 0);
      })
      .catch(err => {
        // if a problem happens, reset and show the error 
        this.resetState(false, err.message);
      })
  }

  updateQuestion(newState) { // this is for editing a question in View-Edit
    let questionsRef = firebase.firestore().collection('questions');

    if (!newState.isMult) {
      newState.choices = [];
    }

    questionsRef.doc(this.props.editingID).update({ // update the question using it's unique ID
      question: newState.question,
      unit: newState.unit,
      course: newState.course,
      topic: newState.topic,
      answer: newState.isMult ? newState.choices[newState.correct] : newState.answer,
      cog: newState.cog,
      pre: newState.pre,
      diff: newState.diff,
      type: newState.type,
      choices: newState.choices,
      SLO: newState.SLOarray,
    })
      .then(() => this.props.callback(true, "Question Updated"))
      .catch((err) => this.props.callback(false, err.message));
  }

  render() {
    return (
      <div style={styles.container}>
        <form noValidate autoComplete="off">
          <div>
            <TextField
              style={{ width: 75 }}
              label="Course"
              margin="normal"
              onChange={this.handlePreChange}
              value={this.state.pre}
              error={this.state.preErr}
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
              error={this.state.courseErr}
            />

            <TextField
              style={{ width: 150, marginLeft: "1em" }}
              label="Question Type"
              margin="normal"
              onChange={this.handleTypeChange}
              value={this.state.type}
              error={this.state.typeErr}
              select
            >
              <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
              <MenuItem value="True/False">True/False</MenuItem>
              <MenuItem value="Free Response">Free Response</MenuItem>
              <MenuItem value="Programming">Programming</MenuItem>
            </TextField>

            <TextField
              style={{ width: 150, marginLeft: "1em" }}
              label="Difficulty"
              margin="normal"
              onChange={this.handleDiffChange}
              value={this.state.diff}
              error={this.state.diffErr}
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
              error={this.state.topicErr}
            />

            <TextField
              style={{ width: 130, marginLeft: "1em" }}
              label="Unit"
              margin="normal"
              onChange={this.handleUnitChange}
              value={this.state.unit}
              error={this.state.unitErr}
            />

            <TextField
              style={{ width: 150, marginLeft: "1em" }}
              label="Cognitive Level"
              margin="normal"
              onChange={this.handleCogChange}
              value={this.state.cog}
              error={this.state.cogErr}
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
              value={this.state.SLO}
              onBlur={this.addSLO}
              onChange={this.handleSLOChange}
              onKeyDown={this.addSLO}
              error={this.state.sloErr}
            />
          </div>
        </form>

        {this.state.SLOarray && this.state.SLOarray.map((slo, key) => { // render the SLO's
          return (
            <Chip
              style={{ margin: '5px' }}
              variant="outlined"
              color="primary"
              key={key}
              onDelete={() => this.deleteSLO(slo)}
              label={slo}
            />
          );
        })}

        <h5 style={{ textAlign: "left", marginTop: "2em" }}>Question:</h5>
        <Editor
          placeholder="Enter question here..."
          onChange={this.handleQuestionChange}
          value={this.state.question}
          toolbar={{ // show icons in toolbar
            h1: true,
            h2: true,
            h3: true,
            code: true,
            link: true,
            preview: true,
            expand: true,
            subfield: true
          }}
          style={{ height: '300px', width: '100%', borderColor: this.state.questionErr ? "red" : "#ddd" }}
          language="en"
          subfield // split the editor
          lineNum // show line numbers
          preview // show markdown preview to the right
        />

        <br />

        {this.state.isMult && // if the question is multiple choice, show choices input
          <div style={{ width: "100%" }}>
            <h5 style={{ textAlign: "left", marginTop: "2em" }}>Answer Choices:</h5>
            <div style={{ display: "inline-block" }}>
              <div>
                <TextField
                  style={styles.multChoice}
                  onChange={(e) => this.handleChoicesChange("A", e)}
                  value={this.state.choices[0]}
                  error={this.state.multErr}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">A.</InputAdornment>,
                  }}
                />
              </div>

              <div>
                <TextField
                  style={styles.multChoice}
                  onChange={(e) => this.handleChoicesChange("B", e)}
                  value={this.state.choices[1]}
                  error={this.state.multErr}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">B.</InputAdornment>,
                  }}
                />
              </div>

              <div>
                <TextField
                  style={styles.multChoice}
                  onChange={(e) => this.handleChoicesChange("C", e)}
                  value={this.state.choices[2]}
                  error={this.state.multErr}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">C.</InputAdornment>,
                  }}
                />
              </div>

              <div>
                <TextField
                  style={styles.multChoice}
                  onChange={(e) => this.handleChoicesChange("D", e)}
                  value={this.state.choices[3]}
                  error={this.state.multErr}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">D.</InputAdornment>,
                  }}
                />
              </div>
            </div>
            <div id="correct" style={{ display: 'inline-block', marginLeft: "2em", verticalAlign: 'top' }}>
              <TextField
                // don't show this field until all the answers are filled in, idiot proofing in case they
                // select an answer that they haven't filled in yet or something
                style={{
                  width: 150,
                  marginLeft: "1em",
                  display: (this.state.choices.includes(undefined) || this.state.choices.length !== 4) && "none"
                }}
                label="Correct Answer"
                margin="normal"
                onChange={this.handleCorrectChange}
                value={this.state.correct}
                error={this.state.multCorrectErr}
                select
              >
                <MenuItem value="0">A</MenuItem>
                <MenuItem value="1">B</MenuItem>
                <MenuItem value="2">C</MenuItem>
                <MenuItem value="3">D</MenuItem>
              </TextField>
            </div>
          </div>
        }

        {this.state.type === "True/False" &&
          <div>
            <FormControl
              component="fieldset"
              style={this.state.truefalseErr ? { border: "1px solid red", borderRadius: "8px", padding: ".5em" } : {}}
            >
              <RadioGroup
                aria-label="truefalse"
                name="truefalse"
                value={this.state.answer}
                onChange={this.handleTrueFalseChange}
              >
                <FormControlLabel value="True" control={<Radio />} label="True" />
                <FormControlLabel value="False" control={<Radio />} label="False" />
              </RadioGroup>
            </FormControl>
          </div>
        }

        {(this.state.type === "Programming" || this.state.type === "Free Response") &&
          <div style={{ width: '100%' }}>
            <h5 style={{ textAlign: "left", marginTop: "1em" }}>Answer:</h5>
            <Editor
              placeholder="Enter answer here..."
              onChange={this.handleAnswerChange}
              value={this.state.answer}
              toolbar={{
                h1: true,
                h2: true,
                h3: true,
                code: true,
                link: true,
                preview: true,
                expand: true,
                subfield: true
              }}
              style={{ height: '300px', width: '100%', borderColor: this.state.answerErr ? "red" : "#ddd" }}
              language="en"
              subfield
              lineNum
              preview
            />
          </div>
        }
        <div style={{marginTop: '3em'}}>
          <Button
            variant="contained"
            color="primary"
            // change the button's function depending if they're editing or creating
            onClick={this.props.isEditing ? () => this.updateQuestion(this.state) : this.submitQuestion}
          >
            {this.props.isEditing ? 'Update' : 'Submit Question'}
          </Button>
        </div>
      </div >
    )
  }
}

export default Forms;