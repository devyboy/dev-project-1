import React from 'react';
import { Link } from "react-router-dom";
import arrayMove from 'array-move';
import Menu from '../components/menu';
import CustomSnackbar from "../components/customSnackbar";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import {
  Button,
  Dialog,
  Typography,
  CardHeader,
  DialogTitle,
  CardContent,
  TextField,
  DialogContent,
  DialogActions,
  Card,
  Tooltip,
  Fab,
} from '@material-ui/core';

const styles = {
  Challenging: {
    color: "red",
    fontSize: "13px",
  },
  Medium: {
    color: "orange",
    fontSize: "13px",
  },
  Easy: {
    color: "green",
    fontSize: "13px",
  },
  container: {
    marginBottom: "3em"
  },
  card: {
    padding: ".75em",
    width: "400px",
    margin: ".75em",
    textAlign: 'left',
    cursor: "pointer",
    display: "inline-block"
  },
  questionNumber: {
    fontSize: '13px',
    color: 'grey',
    marginBottom: 0,
  },
  cardHeader: {
    padding: ".25em",
  },
  cardContent: {
    padding: '.25em'
  },
  questionText: {
    fontSize: '1em',
    marginBottom: ".5em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  unitTypeDifficulty: {
    fontSize: "13px",
    marginBottom: 0
  },
  cardContent2: {
    padding: '.25em',
    fontSize: "13px"
  },
  listContainer: {
    paddingLeft: 0
  },
  notice: {
    width: '50%',
    margin: "0 auto",
  },
  dragHandle: {
    cursor: "move"
  },
  button: {
    margin: "1em",
    display: "inline-block",
  }
}

class Generate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.randomizeQuestions = this.randomizeQuestions.bind(this);
    this.randomizeChoices = this.randomizeChoices.bind(this);
    this.randomizeAllChoices = this.randomizeAllChoices.bind(this);
    this.randomizeAll = this.randomizeAll.bind(this);
    this.handleSpacingChange = this.handleSpacingChange.bind(this);
    this.closeCard = this.closeCard.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
  }

  closeDetails() {
    this.setState({ detailsModal: false });
  }

  onSortEndCards = ({ oldIndex, newIndex }) => { // gets called when you finish dragging a card
    this.setState(({ questions }) => ({
      questions: arrayMove(questions, oldIndex, newIndex),
    }));
  };

  onSortEndChoices = ({ oldIndex, newIndex }) => { // gets called when you finish dragging a choice
    let kapp = this.state.detailsQuestion;
    kapp.choices = arrayMove(kapp.choices, oldIndex, newIndex);
    this.setState({ detailsQuestion: kapp });
  };

  componentDidMount() {
    // can't access the generate page unless you do it by selecting questions from view-edit
    if (this.props.location.state === undefined) {
      this.props.history.push("/view-edit");
    }
    else {
      this.setState({ questions: this.props.location.state.questions });
    }
  }

  handleSpacingChange(question, event) {
    let newState = this.state.questions;
    newState[newState.indexOf(question)].spacing = event.target.value;
    this.setState({ questions: newState });
  }

  expandCard(index) {
    this.setState({ detailsModal: true, detailsQuestion: this.state.questions[index] });
  }

  closeCard(index) { // remove question from generate page
    let temp = this.state.questions;
    temp.splice(index - 1, 1);

    this.setState(state => ({
      detailsModal: false,
      questions: temp,
      snackOpen: true,
      snackSuccess: true,
      snackMessage: "Question removed"
    }));
  }

  randomizeQuestions() { // using Fisher-Yates algorithm to randomize
    let array = this.state.questions

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    this.setState({
      questions: array,
      snackOpen: true,
      snackSuccess: true,
      snackMessage: "Questions randomized"
    });
  }

  randomizeChoices() {
    let crs = this.state.detailsQuestion;
    let array = crs.choices;

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    crs.choices = array;

    this.setState({
      detailsQuestion: crs,
      snackOpen: true,
      snackSuccess: true,
      snackMessage: "Choices randomized"
    });
  }

  randomizeAllChoices() {
    this.state.questions.forEach((q) => {
      let array = q.choices;
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      q.choices = array;
    });

    this.setState({
      snackOpen: true,
      snackSuccess: true,
      snackMessage: "All choices randomized"
    })
  }

  randomizeAll() {
    this.randomizeQuestions();

    this.state.questions.forEach((q) => {
      let array = q.choices;
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      q.choices = array;
    });

    this.setState({
      snackOpen: true,
      snackSuccess: true,
      snackMessage: "All questions and choices randomized"
    });
  }

  render() {

    // Drag handle in the top right of the card

    const DragHandle = sortableHandle(() => <DragHandleIcon style={styles.dragHandle} />);

    // Individual Card component

    const SortableItem = sortableElement(({ value }) => {
      let index = this.state.questions.indexOf(value);

      return (
        <Card
          tabIndex={0}
          style={styles.card}
          onClick={() => this.expandCard(index)}
        >

          <CardHeader
            style={styles.cardHeader}
            action={<DragHandle />}
            title={
              <p style={styles.questionNumber}>
                {"Question " + (index + 1)}
              </p>
            }
          />

          <CardContent style={styles.cardContent}>
            <p style={styles.questionText}>{value.question}</p>
            <p style={styles.unitTypeDifficulty}>
              {value.unit + " • " + value.type + " • "}
              <span style={styles[value.diff]}>{value.diff}</span>
            </p>
          </CardContent>
        </Card>
      );
    });

    // Entire card list component

    const SortableList = sortableContainer(({ items }) => {
      return (
        <ul style={styles.listContainer}>
          {items.map((value, index) => (
            <SortableItem key={`item-${value.question + index}`} index={index} value={value} />
          ))}
        </ul>
      );
    });

    // Multiple choice options

    const SortableChoice = sortableElement(({ value }) => {
      return (
        <li style={{ cursor: "move", zIndex: 1301 }}>
          {value}
        </li>
      );
    });

    // entire choice list component 

    const SortableChoices = sortableContainer(({ items }) => {
      return (
        <ul>
          {items.map((value, index) => (
            <SortableChoice key={`item-${value + index}`} index={index} value={value} />
          ))}
        </ul>
      )
    });

    return (
      <div className="App">
        <Menu path={["View", "Generate"]} />

        {this.state.questions &&
          <div style={styles.container}>
            <Button variant="contained" color="primary" onClick={this.randomizeQuestions} style={styles.button}>
              Randomize Questions
            </Button>
            <Button variant="contained" color="primary" onClick={this.randomizeAll} style={styles.button}>
              Randomize Questions + Choices
            </Button>
            <Button variant="contained" color="primary" onClick={this.randomizeAllChoices} style={styles.button}>
              Randomize Choices
            </Button>

            <SortableList items={this.state.questions} onSortEnd={this.onSortEndCards} axis="xy" useDragHandle />

            {this.state.detailsQuestion &&
              <Dialog onClose={this.closeDetails} open={this.state.detailsModal}>
                <DialogTitle onClose={this.closeDetails}>
                  {"Question " + (this.state.questions.indexOf(this.state.detailsQuestion) + 1) + " details"}
                </DialogTitle>
                <DialogContent dividers >
                  <ul>
                    <li>
                      <Typography gutterBottom>
                        <strong>Question: </strong> {this.state.detailsQuestion.question}
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom>
                        <strong>Answer: </strong> {this.state.detailsQuestion.answer}
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom>
                        <strong>Course: </strong> {this.state.detailsQuestion.pre + " " + this.state.detailsQuestion.course}
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom>
                        <strong>Topic: </strong> {this.state.detailsQuestion.topic}
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom>
                        <strong>Unit: </strong> {this.state.detailsQuestion.unit}
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom>
                        <strong>Type: </strong> {this.state.detailsQuestion.type}
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom>
                        <strong>Difficulty: </strong> {this.state.detailsQuestion.diff}
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom>
                        <strong>Cognitive Level: </strong> {this.state.detailsQuestion.cog}
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom component="span">
                        <strong>Choices: </strong>
                        {this.state.detailsQuestion.choices.length !== 0 ?
                          <SortableChoices items={this.state.detailsQuestion.choices} onSortEnd={this.onSortEndChoices} />
                          :
                          "N/A"
                        }
                      </Typography>
                    </li>
                    <li>
                      <Typography gutterBottom component="span">
                        <strong>SLO's: </strong>
                        {this.state.detailsQuestion.SLO &&
                          <ul>
                            {this.state.detailsQuestion.SLO.map((slo, key) => {
                              return (
                                <li key={key}>{slo}</li>
                              );
                            })}
                          </ul>
                        }
                      </Typography>
                    </li>
                    {/* show spacing only if the question isn't multiple choice */}
                    {(this.state.detailsQuestion.type === "Free Response" || this.state.detailsQuestion.type === "Programming")
                      &&
                      <li>
                        <TextField
                          label={"Spacing"}
                          margin="normal"
                          type="number"
                          style={{ marginTop: 0 }}
                          onBlur={(event) => this.handleSpacingChange(this.state.detailsQuestion, event)}
                        />
                      </li>
                    }
                  </ul>
                </DialogContent>
                <DialogActions >
                  {this.state.detailsQuestion.choices.length !== 0 &&
                    <Button style={{ marginRight: "auto" }} onClick={this.randomizeChoices} color="primary">
                      Shuffle Choices
                        </Button>
                  }
                  {/* If you're down to the last question, you can't remove it */}
                  {this.state.questions.length !== 1 &&
                    <Button onClick={() => this.closeCard(this.state.questions.indexOf(this.state.detailsQuestion) + 1)} color="secondary">
                      Remove
                    </Button>
                  }

                  <Button onClick={this.closeDetails} color="primary">
                    Close
                      </Button>
                </DialogActions>
              </Dialog>
            }

            <Link to={{ pathname: "/exam", state: { questions: this.state.questions } }}>
              <Tooltip title="Generate">
                <Fab
                  color="primary"
                  style={{ position: "fixed", bottom: 60, right: 70 }}
                >
                  <AssignmentTurnedInIcon />
                </Fab>
              </Tooltip>
            </Link>

            <CustomSnackbar
              open={this.state.snackOpen}
              success={this.state.snackSuccess}
              message={this.state.snackMessage}
              closeSnack={() => this.setState({ snackOpen: false })}
            />
          </div>
        }
      </div>
    );
  }
}

export default Generate;