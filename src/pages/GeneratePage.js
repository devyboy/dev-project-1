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
                          <strong>Unit: </strong>{q.unit},&nbsp;
                          <strong>Topic: </strong>{q.topic},&nbsp;
                          <strong>Course: </strong>CISC{q.course},&nbsp;
                          <strong>Difficulty: </strong>{q.diff},&nbsp;
                          <strong>Type: </strong>{q.type},&nbsp;
                          <strong>Answer: </strong>{q.answer}&nbsp;
                          <br />
                          {q.choices.length != 0 ? 
                          <div>
                            <strong>Choices: </strong>{q.choices.map((choice) => {
                            return(
                                choice + "; "
                              );
                          })}
                          </div>
                          :
                          null
                          }
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