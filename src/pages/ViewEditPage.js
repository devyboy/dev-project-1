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
    };
    this.deleteAll = this.deleteAll.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
    this.openEditForm = this.openEditForm.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
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
    console.log(q);
  }

  closeEditForm(refresh) {
    this.setState({isEditing: false});
    this.setState({editingQuestion: null});

    if(refresh){
      this.setState({questions: null});
      this.fetchQuestions();
    }
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