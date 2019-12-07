import React from 'react';
import firebase from 'firebase/app';
import "firebase/firestore";
import { Redirect } from "react-router-dom";
import Menu from '../components/menu';
import Forms from '../components/forms';
import CustomSnackbar from "../components/customSnackbar";
import CircularProgress from '@material-ui/core/CircularProgress';
import DataTable from '../components/dataTable';
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
      offlineNotify: false,
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
      this.openSnackbar(false, err.message);
    });
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

  closeEditForm(refresh) {
    this.setState({ isEditing: false });

    if (refresh) {
      this.setState({ questions: null });
      this.fetchQuestions();
    }
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

  deleteQuestions(questions) {
    questions.forEach((q) => {
      firebase.firestore().collection("questions").doc(q.id).delete().then(() => this.fetchQuestions());
    });

    this.openSnackbar(true, "Question(s) deleted");
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
            <Menu path={["View-Edit"]} />
            <div>
              {this.state.questions ?
                <div>
                  <DataTable
                    questions={this.state.questions}
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
                    editingID={this.state.editingID}
                    closeFn={() => this.closeEditForm(true)}
                  />
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