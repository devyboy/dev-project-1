import React from 'react';
import firebase from 'firebase/app';
import "firebase/firestore";
import Menu from '../components/menu';
import Forms from '../components/forms';
import CustomSnackbar from "../components/customSnackbar";
import {
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from '@material-ui/core';
import DataTable from '../components/dataTable';
import CloseIcon from '@material-ui/icons/Close';
import OfflineNotify from "../components/offlineNotify";


class ViewEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null,
      selectedQuestions: [],
      deleteConfirm: false,
      isEditing: false,
      offlineNotify: false,
    };
    this.openExamForm = this.openExamForm.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
    this.openEditForm = this.openEditForm.bind(this);
    this.updateCallback = this.updateCallback.bind(this);
    this.closeOfflineNotify = this.closeOfflineNotify.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
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
    })
      .then(() => {
        this.setState({ isEditing: false });
      })
      .catch((err) => this.openSnackbar(false, err.message));
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

  openEditForm(selectedQ) {
    let question;
    this.state.questions.forEach((q) => {
      if (q[0] === selectedQ.id) {
        question = q[1];
      }
    });

    this.setState({ isEditing: true, editingQuestion: question, editingID: selectedQ.id });
  }

  updateCallback(success, message) {
    this.fetchQuestions();
    this.openSnackbar(success, message);
  }

  openExamForm(selected) {
    let opp = [];
    this.state.questions.filter((q) => {
      return (selected.forEach((qq) => {
        if (qq.id === q[0]) {
          opp.push(q[1]);
        }
      }));
    });
    this.props.history.push({
      pathname: "/generate",
      state: { questions: opp }
    });
  }

  deleteConfirm(questions) {
    this.setState({ deleteConfirm: true, selectedQuestions: questions });
  }

  deleteQuestions() {
    this.state.selectedQuestions.forEach((q) => {
      firebase.firestore().collection("questions").doc(q.id).delete().then(() => this.fetchQuestions());
    });
    this.setState({ deleteConfirm: false });
    this.openSnackbar(true, "Question(s) deleted");
  }

  openSnackbar(success, message) {
    this.setState({ snackOpen: true, snackSuccess: success, snackMessage: message });
  }

  render() {
    return (
      <div className="App">
        <Menu path={["View-Edit"]} />
        <div>
          {this.state.questions ?
            <div id="mtable">
              <DataTable
                questions={this.state.questions}
                handleEditQuestions={this.openEditForm}
                handleGenerateExam={this.openExamForm}
                handleDeleteQuestions={this.deleteConfirm}
              />
            </div>
            :
            <CircularProgress />
          }
          <Dialog
            open={this.state.isEditing}
            onClose={() => this.setState({ isEditing: false })}
            aria-labelledby="form-dialog-title"
            maxWidth="lg"
            fullWidth
          >
            <DialogActions disableSpacing>
              <Button onClick={() => this.setState({ isEditing: false })} color="primary">
                <CloseIcon />
              </Button>
            </DialogActions>
            <DialogContent>
              <Forms
                openSnackbar={this.openSnackbar}
                isEditing={true}
                editingQuestion={this.state.editingQuestion}
                editingID={this.state.editingID}
                callback={this.updateCallback}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={this.state.deleteConfirm}
            onClose={() => this.setState({ deleteConfirm: false })}
            aria-labelledby="form-dialog-title"
            maxWidth="lg"
          >
            <DialogTitle>
              Delete Questions
            </DialogTitle>
            <DialogContent>
              Are you sure you want to delete {this.state.selectedQuestions.length} questions?
            </DialogContent>
            <DialogActions>
              <Button onClick={this.deleteQuestions} color="primary">
                Yes
              </Button>
              <Button onClick={() => this.setState({ deleteConfirm: false })} color="secondary">
                No
              </Button>
            </DialogActions>
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
    );
  }
}

export default ViewEdit;