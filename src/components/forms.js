import React from 'react';
import firebase from "firebase";
import Form from 'react-bootstrap/Form';
import Button from '@material-ui/core/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
var isEnabled = false;
var count = 0;

class Forms extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      choices: props.editingQuestion ? props.editingQuestion[1].choices : [],
      isMult: props.editingQuestion ? props.editingQuestion[1].type === "Multiple Choice" : false,

      question: props.editingQuestion ? props.editingQuestion[1].question : "",
      unit: props.editingQuestion ? props.editingQuestion[1].unit : "",
      topic: props.editingQuestion ? props.editingQuestion[1].topic : "",
      answer: props.editingQuestion ? props.editingQuestion[1].answer : "",
      cog: props.editingQuestion ? props.editingQuestion[1].cog : "",
      diff: props.editingQuestion ? props.editingQuestion[1].diff : "",
      SLO: props.editingQuestion ? props.editingQuestion[1].SLO : "",
      type: props.editingQuestion ? props.editingQuestion[1].type : "",
      course: props.editingQuestion ? props.editingQuestion[1].course : "",
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
  }

  enableButton(num){
    count += num;
    console.log(count)
  }

  handleQuestionChange(event) {
    if(event.target.value === ""){
      this.enableButton(-1);
    }
    else {
      if(event.target.value.length === 1){
        this.enableButton(1);
      }
    }
    this.setState({ question: event.target.value });
  }

  handleUnitChange(event) {
    if(event.target.value === ""){
      this.enableButton(-1);
    }else{
      this.enableButton(1);
    }
    this.setState({ unit: event.target.value });
  }

  handleTopicChange(event) {
    if(event.target.value === ""){
      this.enableButton(-1);
    }else{
      this.enableButton(1);
    }
    this.setState({ topic: event.target.value });
  }

  handleAnswerChange(event) {
    if(event.target.value === ""){
      this.enableButton(-1);
    }else{
      this.enableButton(1);
    }
    this.setState({ answer: event.target.value });
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
    if(event.target.value === ""){
      this.enableButton(-1);
    }else{
      this.enableButton(1);
    }
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
      type: "",
      course: "",
    });
    this.props.openSnackbar(success, message);
  }

  submitQuestion() {
    let questionsRef = firebase.firestore().collection('questions');
    questionsRef.add({
      question: this.state.question,
      unit: this.state.unit.toLowerCase(),
      course: this.state.course,
      topic: this.state.topic.toLowerCase(),
      answer: this.state.answer,
      cog: this.state.cog,
      diff: this.state.diff,
      type: this.state.type,
      choices: this.state.choices,
      SLO: this.state.SLO.toLowerCase(),
    })
      .then(this.resetState(true, "Question saved"))
      .catch(err => {
        this.resetState(false, err);
      })
  }

  updateQuestion(state) {
    let questionsRef = firebase.firestore().collection('questions');
    questionsRef.doc(this.props.editingQuestion[0]).update({
      question: state.question,
      unit: state.unit.toLowerCase(),
      course: state.course,
      topic: state.topic.toLowerCase(),
      answer: state.answer,
      cog: state.cog,
      diff: state.diff,
      type: state.type,
      choices: state.choices,
      SLO: state.SLO.toLowerCase(),
    })
    .then(this.resetState(true, "Question updated"))
    .catch(err => {
      this.resetState(false, err);
    });
  }

  render() {
    return (
      <div style={{ width: "65%", margin: '0 auto', marginTop: this.props.isEditing ? "0em" : "2.5em" }}>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Question</Form.Label>
              <Form.Control 
                onChange={this.handleQuestionChange} 
                value={this.state.question} 
                placeholder="What's 2+2?"/>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Answer</Form.Label>
              <Form.Control 
                onChange={this.handleAnswerChange} 
                value={this.state.answer} 
                placeholder="4" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Topic</Form.Label>
              <Form.Control 
                onChange={this.handleTopicChange} 
                value={this.state.topic} 
                placeholder="Addition" />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Unit</Form.Label>
              <Form.Control 
                onChange={this.handleUnitChange} 
                value={this.state.unit} 
                placeholder="Chapter 2" />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>SLO</Form.Label>
              <Form.Control 
                onChange={this.handleSLOChange} 
                value={this.state.SLO} 
                placeholder="" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Question Type</Form.Label>
              <Form.Control onChange={this.handleTypeChange} as="select" value={this.state.type}>
                <option>Select a Question Type</option>
                <option>Multiple Choice</option>
                <option>Free Response</option>
                <option>Programming</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Cognitive Level</Form.Label>
              <Form.Control onChange={this.handleCogChange} as="select" value={this.state.cog}>
                <option>Select a Cognitive Level</option>
                <option>Remembering</option>
                <option>Understanding</option>
                <option>Applying</option>
                <option>Analyzing</option>
                <option>Evaluating</option>
                <option>Creating</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Difficulty</Form.Label>
              <Form.Control onChange={this.handleDiffChange} as="select" value={this.state.diff}>
                <option>Select a Difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Challenging</option>
              </Form.Control>
            </Form.Group>
            <Form.Group >
              <Form.Label>Course</Form.Label>
              <Form.Control onChange={this.handleCourseChange} as="select">
                <option>CISC</option>
                <option>CPEG</option>
                <option>MISY</option>
              </Form.Control>
            </Form.Group>
            <Form.Group >
              <Form.Label>Course</Form.Label>
              <Form.Control 
                style={{width: '3.5em'}} 
                onChange={this.handleCourseChange} 
                placeholder="106" />  
            </Form.Group>
          </Form.Row>
          <Form.Row>
            {this.state.isMult ?
              <Form.Group as={Col} md="5">
                <Form.Label>Answer Choices</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>A</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("A", e)}
                    type="text"
                    value={this.state.choices[0]}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>B</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("B", e)}
                    type="text"
                    value={this.state.choices[1]}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>C</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("C", e)}
                    type="text"
                    value={this.state.choices[2]}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>D</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("D", e)}
                    type="text"
                    value={this.state.choices[3]}
                  />
                </InputGroup>
              </Form.Group>
              :
              null
            }
          </Form.Row>
          <Button
            disabled={!isEnabled} 
            variant="contained" 
            color="primary" 
            onClick={this.props.isEditing ? () => {this.updateQuestion(this.state); this.props.closeFn();} : this.submitQuestion} 
            style={{ marginTop: '2em'}}
          >
            {this.props.isEditing ? 'Update' : 'Submit'}
          </Button>
        </Form>
      </div>
    )
  }
}

export default Forms;