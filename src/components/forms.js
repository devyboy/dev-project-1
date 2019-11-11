import React from 'react';
import firebase from "firebase";
import Form from 'react-bootstrap/Form';
import Button from '@material-ui/core/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Editor from 'for-editor'
import Chip from '@material-ui/core/Chip';

const choiceStyle = {
  marginBottom: '10px'
}

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      value: '',
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
    questionsRef.add({
      question: this.state.question,
      unit: this.state.unit.toLowerCase(),
      pre: this.state.pre,
      course: this.state.course,
      topic: this.state.topic.toLowerCase(),
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
    questionsRef.doc(this.props.editingQuestion[0]).update({
      question: state.question,
      unit: state.unit.toLowerCase(),
      course: state.course,
      topic: state.topic.toLowerCase(),
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
        <Form>
          <Form.Row>
            <Form.Group as={Col} md="2">
              <Form.Label>Course</Form.Label>
              <Form.Control onChange={this.handlePreChange} as="select" value={this.state.pre}>
                <option>Select course</option>
                <option>CISC</option>
                <option>CPEG</option>
                <option>MISY</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="1">
              <Form.Label>Number</Form.Label>
              <Form.Control
                onChange={this.handleCourseChange}
                placeholder="106"
              />
            </Form.Group>

            <Form.Group as={Col} md="3">
              <Form.Label>Question Type</Form.Label>
              <Form.Control onChange={this.handleTypeChange} as="select" value={this.state.type}>
                <option>Select a Question Type</option>
                <option>Multiple Choice</option>
                <option>Free Response</option>
                <option>Programming</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="3">
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

            <Form.Group as={Col} md="3">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                onChange={this.handleUnitChange}
                value={this.state.unit}
                placeholder="Chapter 2" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Label>SLO</Form.Label>
              <Form.Control
                onKeyDown={this.addSLO}
                onChange={this.handleSLOChange}
                value={this.state.SLO}
                placeholder="" />
            </Form.Group>

            <Form.Group as={Col} md="3">
              <Form.Label>Topic</Form.Label>
              <Form.Control
                onChange={this.handleTopicChange}
                value={this.state.topic}
                placeholder="Addition" />
            </Form.Group>

            <Form.Group as={Col} md="3">
              <Form.Label>Difficulty</Form.Label>
              <Form.Control onChange={this.handleDiffChange} as="select" value={this.state.diff}>
                <option>Select a Difficulty</option>
                <option>easy</option>
                <option>medium</option>
                <option>challenging</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <br />

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

          <Form.Row>
            <Form.Label>Question</Form.Label>
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
          </Form.Row>

          <br />

          {this.state.type !== "Multiple Choice"
            ?
            <Form.Row style={{ width: '100%' }}>
              <Form.Label>Answer</Form.Label>
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
            </Form.Row>
            :
            null
          }
          <Form.Row>
            {this.state.isMult ?
              <Form.Group as={Col} md="5">
                <Form.Label>Answer Choices</Form.Label>
                <InputGroup style={choiceStyle}>
                  <InputGroup.Prepend>
                    <InputGroup.Text>A</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("A", e)}
                    type="text"
                    value={this.state.choices[0]}
                  />
                </InputGroup>
                <InputGroup style={choiceStyle}>
                  <InputGroup.Prepend>
                    <InputGroup.Text>B</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("B", e)}
                    type="text"
                    value={this.state.choices[1]}
                  />
                </InputGroup>
                <InputGroup style={choiceStyle}>
                  <InputGroup.Prepend>
                    <InputGroup.Text>C</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control onChange={(e) => this.handleChoicesChange("C", e)}
                    type="text"
                    value={this.state.choices[2]}
                  />
                </InputGroup>
                <InputGroup style={{ choiceStyle }}>
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
            variant="contained"
            color="primary"
            onClick={this.props.isEditing ? () => { this.updateQuestion(this.state); this.props.closeFn(); } : this.submitQuestion}
            style={{ marginTop: '2em' }}
          >
            {this.props.isEditing ? 'Update' : 'Submit'}
          </Button>

        </Form>
      </div>
    )
  }
}

export default Forms;