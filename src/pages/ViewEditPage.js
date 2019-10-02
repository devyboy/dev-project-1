import React from 'react';
import firebase from 'firebase';
import Menu from '../components/menu';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress'

let styles = {
  container: {
    width: '40%',
    margin: '0 auto',
  }
}

class ViewEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null,
    }
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

  render() {
    return(
      <div className="App">
        <Menu />
        <h2>View/Edit Questions</h2>
        <br />
        <div style={styles.container}>
          {this.state.questions ? this.state.questions.map((q, key) => {
            return(
            <ExpansionPanel key={key}>
              <ExpansionPanelSummary 
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h4>{q.question}</h4>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
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
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            );
          })
          :
          <CircularProgress />
          }
        </div>
      </div>
    );
  }
}

export default ViewEdit;