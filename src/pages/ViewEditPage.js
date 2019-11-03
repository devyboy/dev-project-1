import React from 'react';
import firebase from 'firebase';
import Menu from '../components/menu';
import Forms from '../components/forms';
import CircularProgress from '@material-ui/core/CircularProgress';
import EnhancedTable from '../components/table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

class ViewEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarOpen: false,
      snackbarSuccess: true,

      questions: null, // An array of 2-tuples containing Doc ID and Question Data
      isEditing: false,
      editingQuestion: null,

      isCreatingExam: false,
      examQuestions: null,
    };
    this.deleteAll = this.deleteAll.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
    this.openEditForm = this.openEditForm.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
    this.openExamForm = this.openExamForm.bind(this);
    this.closeExamForm = this.closeExamForm.bind(this);
    this.deleteQuestions = this.deleteQuestions.bind(this);
  }


  fetchQuestions() {
    let questionArray= [];
    let questionsRef = firebase.firestore().collection('questions');
    questionsRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        questionArray.push([doc.id, doc.data()]);
      });
      this.setState({ questions: questionArray });
    }).catch(err => {
        console.log(err);
    })
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  deleteAll() {
    firebase.firestore().collection('questions').get().then(snapshot => {
      snapshot.forEach(doc => {
        firebase.firestore().collection('questions').doc(doc.id).delete();
      })
    });
  }

  openSnackbar(success, message) {
    this.setState({ message: message, snackbarSuccess: success, snackbarOpen: true });
  }

  openEditForm(q) {
    this.setState({isEditing: true});
    this.setState({editingQuestion: q});
  }

  closeEditForm(refresh) {
    this.setState({isEditing: false});
    this.setState({editingQuestion: null});

    if(refresh){
      this.setState({questions: null});
      this.fetchQuestions();
    }
  }

  openExamForm(selected){
    this.setState({ isCreatingExam: true });
    let selectedQuestions = this.state.questions.filter(q => selected.includes(q[0])).map(q => q[1]);
    let mcQuestions = selectedQuestions.filter(q => q['type'] === 'Multiple Choice');
    let frQuestions = selectedQuestions.filter(q => q['type'] === 'Free Response');
    let pQuestions = selectedQuestions.filter(q => q['type'] === 'Programming');
    this.setState({examQuestions: [mcQuestions, frQuestions, pQuestions]});

  }

  deleteQuestions(selected) {
    let selectedQuestions = this.state.questions.filter(q => selected.includes(q[0])).map(q => q[1]);
    let deleteQuestionsIDs = [];

    selectedQuestions.forEach((selectedQuest) => { 
      this.state.questions.forEach((quest) => {
        if (selectedQuest === quest[1]) {
          deleteQuestionsIDs.push(quest[0]);
        }
      });
    });
    
    deleteQuestionsIDs.forEach((ID) => {
      firebase.firestore().collection("questions").doc(ID).delete().then(() => this.fetchQuestions());
    });

    this.openSnackbar(true, "Question(s) deleted");
  }

  closeExamForm(){
    this.setState({isCreatingExam: false});
    this.setState({examQuestions: null});
  }

  render() {
    return(
      <div className="App">
        <Menu />
        <div>
          {this.state.questions ?
          <div>
          <EnhancedTable
            rows={this.state.questions}
            handleEditQuestions={this.openEditForm}
            handleGenerateExam={this.openExamForm}
            handleDeleteQuestions={this.deleteQuestions}
          />
          </div>
          :
          <CircularProgress />
          }
          <Dialog 
            open={this.state.isEditing} 
            onClose={() => this.closeEditForm(false)} 
            aria-labelledby="form-dialog-title"
            maxWidth="lg"
            fullWidth
          >
            <DialogActions disableSpacing>
              <Button onClick={() => this.closeEditForm(false)} color="primary">
                <CloseIcon />
              </Button>
            </DialogActions>
            <DialogContent>
              <Forms
                openSnackbar={this.openSnackbar}
                isEditing={true}
                editingQuestion={this.state.editingQuestion}
                closeFn={() => this.closeEditForm(true)}
              />
              <br/><br/>
            </DialogContent>
          </Dialog>
          <Dialog
            open={this.state.isCreatingExam}
            onClose={() => this.closeExamForm()}
            aria-labelledby="form-dialog-title"
            maxWidth="lg"
            fullWidth
          >
            <DialogActions disableSpacing>
              <Button onClick={() => this.closeExamForm()} color="primary">
                <CloseIcon />
              </Button>
            </DialogActions>
            <DialogContent>
              {this.state.examQuestions ?
              <div>
                Multiple Choice
                <ul>
                  {this.state.examQuestions[0].map((q, key) =>{return <li key={key}>{q.question}</li>})}
                </ul>
                Free Response
                <ul>
                  {this.state.examQuestions[1].map((q, key) =>{return <li key={key}>{q.question}</li>})}
                </ul>
                Programming
                <ul>
                  {this.state.examQuestions[2].map((q, key) =>{return <li key={key}>{q.question}</li>})}
                </ul>
              </div>
              :
              <CircularProgress />
              }
            </DialogContent>
          </Dialog>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={() => this.setState({ snackbarOpen: false })}
          message={<span id="message-id">{this.state.message}</span>}
          action={
            this.state.snackbarSuccess ? <CheckIcon /> : <CloseIcon />
          }
        />
      </div>
    );
  }
}

export default ViewEdit;