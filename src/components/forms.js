import React from 'react';
import firebase from "firebase";
import Form from 'react-bootstrap/Form';
import Button from '@material-ui/core/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

class Forms extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
  }

  handleQuestionChange(event) {
    this.setState({ question: event.target.value });
  }

  handleUnitChange(event) {
    this.setState({ unit: event.target.value });
  }

  handleTopicChange(event) {
    this.setState({ topic: event.target.value });
  }

  handleAnswerChange(event) {
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
      cog: this.state.cog.toLowerCase(),
      diff: this.state.diff.toLowerCase(),
      type: this.state.type.toLowerCase(),
      choices: this.state.choices,
      SLO: this.state.SLO.toLowerCase(),
    })
      .then(this.resetState(true, "Question saved"))
      .catch(err => {
        this.resetState(false, err);
      })
  }

  render() {
    return (
      <div style={{ width: "65%", margin: '0 auto', marginTop: "2.5em" }}>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Question</Form.Label>
              <Form.Control onChange={this.handleQuestionChange} value={this.state.question} placeholder="What's 2+2?" />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Answer</Form.Label>
              <Form.Control onChange={this.handleAnswerChange} value={this.state.answer} placeholder="4" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Topic</Form.Label>
              <Form.Control onChange={this.handleTopicChange} value={this.state.topic} placeholder="Addition" />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Unit</Form.Label>
              <Form.Control onChange={this.handleUnitChange} value={this.state.unit} placeholder="Chapter 2" />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>SLO</Form.Label>
              <Form.Control onChange={this.handleSLOChange} value={this.state.SLO} placeholder="" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Question Type</Form.Label>
              <Form.Control onChange={this.handleTypeChange} as="select">
                <option>Select a Question Type</option>
                <option>Multiple Choice</option>
                <option>Free Response</option>
                <option>Programming</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Cognitive Level</Form.Label>
              <Form.Control onChange={this.handleCogChange} as="select">
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
              <Form.Control onChange={this.handleDiffChange} as="select">
                <option>Select a Difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Challenging</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Course</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>CISC</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control value={this.state.course} placeholder="108" onChange={this.handleCourseChange}
                  type="text"
                />
              </InputGroup>
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
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>B</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("B", e)}
                    type="text"
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>C</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("C", e)}
                    type="text"
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>D</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("D", e)}
                    type="text"
                  />
                </InputGroup>
              </Form.Group>
              :
              null
            }
          </Form.Row>
          <Button variant="contained" color="primary" onClick={this.submitQuestion} style={{ marginTop: '2em'}}>
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}

export default Forms;