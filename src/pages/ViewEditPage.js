import React from 'react';
import firebase from 'firebase/app';
import "firebase/firestore";
import { Redirect } from "react-router-dom";
import Menu from '../components/menu';
import Forms from '../components/forms';
import CustomSnackbar from "../components/customSnackbar";
import CircularProgress from '@material-ui/core/CircularProgress';
import EnhancedTable from '../components/table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import OfflineNotify from "../components/offlineNotify";


class ViewEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null,
      selectedQuestions: null,
      isEditing: false,
    };
    this.openExamForm = this.openExamForm.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
    this.openEditForm = this.openEditForm.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
    this.closeOfflineNotify = this.closeOfflineNotify.bind(this);
    this.deleteQuestions = this.deleteQuestions.bind(this);
  }


  fetchQuestions() {
    let questionArray = [];
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

  componentDidUpdate() {
    if (!navigator.onLine && !this.state.notified) {
      this.setState({ offlineNotify: true, notified: true });
    }
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  closeOfflineNotify() {
    this.setState({ offlineNotify: false });
  }

  componentWillUnmount() {
    firebase.firestore().terminate();
  }

  openEditForm(q) {
    this.setState({ isEditing: true });
    this.setState({ editingQuestion: q });
  }

  closeEditForm(refresh) {
    this.setState({ isEditing: false });
    this.setState({ editingQuestion: null });

    if (refresh) {
      this.setState({ questions: null });
      this.fetchQuestions();
    }
  }

  openExamForm(selected) {
    let selectedQuestions = this.state.questions.filter(q => selected.includes(q[0])).map(q => q[1]);
    this.setState({ selectedQuestions: selectedQuestions });

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

  closeExamForm() {
    this.setState({ isCreatingExam: false });
    this.setState({ examQuestions: null });
  }

  openSnackbar(success, message) {
    this.setState({ snackOpen: true, snackSuccess: success, snackMessage: message });
  }

  render() {
    if (this.props.user === false) {
      return (null);
    }
    return (
      <div className="App">
        {!this.props.user ?
          <Redirect to={"/login"} />
          :
          <div>
            {this.state.selectedQuestions !== null &&
              this.props.history.push({
                pathname: "/generate",
                state: { questions: this.state.selectedQuestions }
              })
            }
            <Menu path={" / ViewEdit"}/>
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
                  <br /><br />
                </DialogContent>
              </Dialog>
            </div>

            <CustomSnackbar 
              message={this.state.snackMessage} 
              success={this.state.snackSuccess} 
              open={this.state.snackOpen}
              closeSnack={() => this.setState({ snackOpen: false })}
            />

            <OfflineNotify open={this.state.offlineNotify} closeNotify={this.closeOfflineNotify} />
          </div>
        }
      </div>
    );
  }
}

export default ViewEdit;