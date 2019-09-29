import React, { Component } from 'react';
import firebase from "firebase";
import '../App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';



class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      choices: [],

      question: "",
      unit: "",
      topic: "",
      answer: "",
      isMult: true,
      cog: "",
      diff: "",
      type: ""

    };

    this.submitQuestion = this.submitQuestion.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleCogChange = this.handleCogChange.bind(this);
    this.handleDiffChange = this.handleDiffChange.bind(this)
  }

  fetchQuestions() {
    let questionArray= [];
    let questionsRef = firebase.firestore().collection('questions');
    questionsRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        questionArray.push(doc.data().content);
        this.setState({ questions: questionArray });
        console.log(doc.data());
      });
    }).catch(err => {
        console.log(err);
    })
  }

  componentDidMount() {
    this.fetchQuestions();
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
    this.setState({ diff: event.target.value});
  }

  submitQuestion() {
    console.log({
      question: this.state.question,
      unit: this.state.unit,
      topic: this.state.topic,
      answer: this.state.answer,
      cog: this.state.cog,
      diff: this.state.diff,
      type: this.state.type
    });
      // let questionsRef = firebase.firestore().collection('questions');
      // questionsRef.add({
      //     content: this.state.text
      // });
      // this.setState({ text: "" });
      // this.fetchQuestions();
  }


  render() {
    return(
        <div className="App">
            <h1>Welcome to dev project 1</h1>
            <div style={{width: "65%", margin: '0 auto', marginTop: "2.5em"}}>
              <Form>
                <Form.Row>
                  <Form.Group onChange={this.handleQuestionChange} as={Col}>
                    <Form.Label>Question</Form.Label>
                    <Form.Control />
                  </Form.Group>

                  <Form.Group onChange={this.handleUnitChange} as={Col}>
                    <Form.Label>Unit</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group onChange={this.handleTopicChange} as={Col}>
                    <Form.Label>Topic</Form.Label>
                    <Form.Control />
                  </Form.Group>

                  <Form.Group onChange={this.handleAnswerChange} as={Col}>
                    <Form.Label>Answer</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Question Type</Form.Label>
                    <Form.Control as="select">
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
                  {this.state.isMult ? 
                  <Form.Group>
                    <Form.Control as="select">

                    </Form.Control>
                  </Form.Group>
                  :
                  null
                  }               
                </Form.Row>

                <Button onClick={this.submitQuestion} variant="primary">
                  Submit
                </Button>
              </Form>       
            </div>
          <br/>
          {this.state.questions.map((question, key) => {
              return(
                <h3 key={key}>{question}</h3>
              );
          })}
        </div>
    );
  }
}

export default HomePage;
