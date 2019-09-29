import React, { Component } from 'react';
import firebase from "firebase";
import '../App.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';



class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      text: ""
    };

    this.submitQuestion = this.submitQuestion.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
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

  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  submitQuestion() {
      let questionsRef = firebase.firestore().collection('questions');
      questionsRef.add({
          content: this.state.text
      });
      this.setState({ text: "" });
      this.fetchQuestions();
  }


  render() {
    return(
        <div className="App">
            <h1>Welcome to dev project 1</h1>
            <div style={{width: "65%", margin: '0 auto', marginTop: "2.5em"}}>
              <Form onSubmit={this.submitQuestion}>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Question</Form.Label>
                    <Form.Control />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Unit</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Topic</Form.Label>
                    <Form.Control />
                  </Form.Group>

                  <Form.Group as={Col}>
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
                    <Form.Label>State</Form.Label>
                    <Form.Control as="select">
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
                    <Form.Control as="select">
                        <option>Select a Difficulty</option>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Challenging</option>
                      </Form.Control>
                  </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit">
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
