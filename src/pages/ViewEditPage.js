import React from 'react';
import firebase from 'firebase';
import Menu from '../components/menu';
import CircularProgress from '@material-ui/core/CircularProgress';
import EnhancedTable from '../components/table';

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
        console.log(doc.data());
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
        <div>
          {this.state.questions ? 
          <EnhancedTable
            rows={this.state.questions}
          />
          :
          <CircularProgress />
          }
        </div>
        {/* <Button onClick={this.deleteAll} color="primary" variant="contained" style={{ margin: "2em" }}>
          Delete All
        </Button> */}
      </div>
    );
  }
}

export default ViewEdit;