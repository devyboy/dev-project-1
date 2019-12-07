import React from 'react';
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import arrayMove from 'array-move';
import Menu from '../components/menu';
import CustomSnackbar from "../components/customSnackbar";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc';
import ShuffleIcon from "@material-ui/icons/Shuffle";
import DragHandleIcon from '@material-ui/icons/DragHandle';
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
  Card
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
    this.randomizeAll = this.randomizeAll.bind(this);
    this.handleSpacingChange = this.handleSpacingChange.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }

  onSortEndCards = ({ oldIndex, newIndex }) => {
    this.setState(({ questions }) => ({
      questions: arrayMove(questions, oldIndex, newIndex),
    }));
  };

  onSortEndChoices = ({ oldIndex, newIndex }) => {
    let kapp = this.state.detailsQuestion;
    kapp.choices = arrayMove(kapp.choices, oldIndex, newIndex);
    this.setState({ detailsQuestion: kapp });
  };

  componentDidMount() {
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

  closeCard(index) {
    let newQues = this.state.questions
    newQues.splice(index - 1, 1);
    if (newQues.length === 0) {
      this.props.history.push("/view-edit");
    }
    this.setState({
      detailsModal: false,
      questions: newQues,
      snackOpen: true,
      snackSuccess: true,
      snackMessage: "Question removed"
    });
  }

  randomizeQuestions() {
    let array = this.state.questions

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    this.setState({ questions: array });
  }

  randomizeChoices() {
    let dab = this.state.detailsQuestion;
    let array = dab.choices;

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    dab.choices = array;

    this.setState({ detailsQuestion: dab });
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
    })
  }

  render() {

    // Action Components

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

    const SortableChoice = sortableElement(({ value }) => {
      return (
        <li style={{ cursor: "move", zIndex: 1301 }}>
          {value}
        </li>
      );
    });


    const SortableChoices = sortableContainer(({ items }) => {
      return (
        <ul>
          {items.map((value, index) => (
            <SortableChoice key={`item-${value + index}`} index={index} value={value} />
          ))}
        </ul>
      )
    });


    // Entire List component

    const SortableList = sortableContainer(({ items }) => {
      return (
        <ul style={styles.listContainer}>
          {items.map((value, index) => (
            <SortableItem key={`item-${value.question + index}`} index={index} value={value} />
          ))}
        </ul>
      );
    });

    if (this.props.user === false) {
      return (null);
    }

    return (
      <div className="App">
        {!this.props.user ?
          <Redirect to={"/login"} />
          :
          <div>
            <Menu path={["View-Edit", "Generate"]} />

            {this.state.questions &&
              <div>
                <Button variant="contained" color="primary" onClick={this.randomizeQuestions} style={styles.button}>
                  Randomize Questions
                  <ShuffleIcon />
                </Button>
                <Button variant="contained" color="primary" onClick={this.randomizeAll} style={styles.button}>
                  Randomize Questions + Choices
                  <ShuffleIcon />
                </Button>

                <SortableList items={this.state.questions} onSortEnd={this.onSortEndCards} axis="xy" useDragHandle />

                {this.state.detailsQuestion &&
                  <Dialog onClose={() => this.setState({ detailsModal: false })} open={this.state.detailsModal}>
                    <DialogTitle onClose={() => this.setState({ detailsModal: false })}>
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
                        {(this.state.detailsQuestion.type === "Free Response" || this.state.detailsQuestion.type === "Programming")
                          &&
                          <TextField
                          label={"Spacing"}
                          margin="normal"
                          type="number"
                          onBlur={(event) => this.handleSpacingChange(this.state.detailsQuestion, event)}
                        />
                        }
                      </ul>
                    </DialogContent>
                    <DialogActions >
                      {this.state.detailsQuestion.choices.length !== 0 &&
                        <Button style={{ marginRight: "auto" }} onClick={this.randomizeChoices} color="primary">
                          Shuffle Choices
                        </Button>
                      }
                      <Button onClick={() => this.closeCard(this.state.questions.indexOf(this.state.detailsQuestion) + 1)} color="secondary">
                        Remove
                      </Button>
                      <Button onClick={() => this.setState({ detailsModal: false })} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                }

                <hr style={{ width: "80%" }} />

                <div style={{ width: "50%", margin: "0 auto" }}>
                  <Link to={{ pathname: "/exam", state: { questions: this.state.questions } }}>
                    <Button style={{ margin: '1em' }} color="primary" variant="contained" >
                      Generate Exam
                    </Button>
                  </Link>
                </div>

                <CustomSnackbar
                  open={this.state.snackOpen}
                  success={this.state.snackSuccess}
                  message={this.state.snackMessage}
                  closeSnack={() => this.setState({ snackOpen: false })}
                />
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default Generate;