import React from 'react';
import firebase from 'firebase';
import { PDFExport } from '@progress/kendo-react-pdf';
import Menu from '../components/menu';
import Button from '@material-ui/core/Button';

class Generate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  fetchQuestions() {
    let questionArray= [];
    let questionsRef = firebase.firestore().collection('questions');
    questionsRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        questionArray.push(doc.data());
        this.setState({ questions: questionArray });
      });
    }).catch(err => {
        console.log(err);
    })
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  downloadPDF() {
    this.resume.save();
  }

  render() {
    return(
      <div className="App">
        <Menu />
        <h2>Generate Exam</h2>
        <br />
        <PDFExport paperSize={'Letter'}
          fileName="Exam.pdf"
          title=""
          subject=""
          keywords=""
          ref={(r) => this.resume = r}>
              <div style={{
                  height: 792,
                  width: 612,
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '5px 5px 5px 5px grey',
                  margin: 'auto',

                  overflowX: 'hidden',
                  overflowY: 'hidden'}}>
                      {this.state.questions ? this.state.questions.map((q, key) => (
                        <div key={key}>
                          Question: {q.question}
                          <br />
                          Unit: {q.unit}
                          <br />
                          Topic: {q.topic}
                          <br />
                          Course: CISC{q.course}
                          <br />
                          Difficulty: {q.diff}
                          <br />
                          Type: {q.type}
                          <br />
                          Answer: {q.answer}
                          <br />
                          Choices: {q.choices.map((choice) => {
                            return(
                                choice + "\n"
                              );
                          })}
                          <hr />
                        </div>
                      ))
                      :
                      null
                      }
              </div>
          </PDFExport>
        <Button variant="contained" color="primary" onClick={this.downloadPDF} style={{ margin: '2em'}}>
          Download
        </Button>
      </div>
    );
  }
}

export default Generate;