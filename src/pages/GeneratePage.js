import React from 'react';
import YAML from 'yaml';
import arrayMove from 'array-move';
import Menu from '../components/menu';
import Form from 'react-bootstrap/Form';
import Card from '@material-ui/core/Card';
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Collapse from '@material-ui/core/Collapse';
import ShuffleIcon from "@material-ui/icons/Shuffle";
import Typography from '@material-ui/core/Typography';
import CardHeader from "@material-ui/core/CardHeader";
import DialogTitle from '@material-ui/core/DialogTitle';
import CardContent from "@material-ui/core/CardContent";
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';


const styles = {
  challenging: {
    color: "red",
    fontSize: "13px",
  },
  medium: {
    color: "orange",
    fontSize: "13px",
  },
  easy: {
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
  }
}

class Generate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null,
      format: ".txt",
      filename: "",
      detailsModal: false,
      detailsQuestion: null,
    }

    this.handleFormatChange = this.handleFormatChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.randomizeQuestions = this.randomizeQuestions.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ questions }) => ({
      questions: arrayMove(questions, oldIndex, newIndex),
    }));
  };

  componentDidMount() {
    if (this.props.location.state === undefined) {
      window.location.href = "/view-edit";
    }
    else {
      this.setState({ questions: this.props.location.state.questions });
    }
  }

  handleFormatChange(event) {
    this.setState({ format: event.target.value });
  }

  downloadFile() {
    var fileDownload = require('js-file-download');
    switch (this.state.format) {
      case ".json":
        fileDownload(JSON.stringify(this.state.questions), this.state.filename + this.state.format);
        break;
      case ".yaml":
        fileDownload(YAML.stringify(this.state.questions), this.state.filename + this.state.format);
        break;
      case ".txt":
        fileDownload(this.convertToText(this.state.questions), this.state.filename + this.state.format);
        break;
      default:
        fileDownload(this.convertToText(this.state.questions), this.state.filename + this.state.format);
        break;
    }
  }

  convertToText(questions) {
    let str = ""
    let i = 1;
    questions.forEach((q) => {
      str += (i + ". " + q.question);
      if (q.choices.length > 0) {
        str += ("\n   A. " + q.choices[0]);
        str += ("\n   B. " + q.choices[1]);
        str += ("\n   C. " + q.choices[2]);
        str += ("\n   D. " + q.choices[3] + "\n\n");
      }
      else {
        str += "\n\n";
      }

      i++;
    });
    return str;
  }

  handleNameChange(event) {
    this.setState({ filename: event.target.value });
  }

  expandCard(index) {
    this.setState({ detailsModal: true, detailsQuestion: this.state.questions[index] });
  }

  closeCard(index) {
    let newQues = this.state.questions
    newQues.splice(index - 1, 1);
    if (newQues.length === 0) {
      window.location.href = "/view-edit";
    }
    this.setState({ detailsModal: false, questions: newQues });
  }

  randomizeQuestions() {
    const array = this.state.questions

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    this.setState({ questions: array });
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

          <Collapse in={this.state.expanded === index} unmountOnExit>
            <CardContent style={styles.cardContent2}>
              <hr />
              <ul>
                <li><p><strong>Course: </strong>{value.course}</p></li>
                <li><p><strong>Answer: </strong>{value.answer}</p></li>
                <li><p><strong>Cog Level: </strong>{value.cog}</p></li>
                <li><p><strong>Topic: </strong>{value.topic}</p></li>
                <strong>SLOs:</strong>
                <ul>
                  {value.SLO.map((slo, key) =>
                    <li key={key}>{slo}</li>
                  )}
                </ul>
              </ul>
            </CardContent>
          </Collapse>

        </Card>
      );
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
            <Menu />
            {this.state.questions &&
              <div>
                <h2>Generate Exam</h2>
                <hr style={{ width: "80%" }} />

                <Button variant="contained" color="primary" onClick={this.randomizeQuestions} style={{ margin: "1em" }}>
                  Randomize
                  <ShuffleIcon />
                </Button>

                <SortableList items={this.state.questions} onSortEnd={this.onSortEnd} axis="xy" useDragHandle />

                {this.state.detailsQuestion &&
                  <Dialog onClose={() => this.setState({ detailsModal: false })} open={this.state.detailsModal}>
                    <DialogTitle onClose={() => this.setState({ detailsModal: false })}>
                      {"Question " + (this.state.questions.indexOf(this.state.detailsQuestion) + 1) + " details"}
                    </DialogTitle>
                    <DialogContent dividers>
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
                          <Typography gutterBottom>
                            <strong>Choices: </strong>
                            {this.state.detailsQuestion.choices.length !== 0 ?
                              <ul>
                                {this.state.detailsQuestion.choices.map((choice, key) => {
                                  return (
                                    <li key={key}>{choice}</li>
                                  );
                                })}
                              </ul>
                              :
                              "N/A"
                            }
                          </Typography>
                        </li>
                        <li>
                          <Typography gutterBottom>
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
                      </ul>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => this.closeCard(this.state.questions.indexOf(this.state.detailsQuestion) + 1)} color="secondary">
                        Remove
                      </Button>
                      <Button autoFocus onClick={() => this.setState({ detailsModal: false })} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                }

              </div>
            }
          </div>
        }

        <hr style={{ width: "80%" }} />

        <div style={{ width: "50%", margin: "0 auto" }}>
          <Form>
            <Form.Row style={{ justifyContent: "center" }}>
              <Form.Group>
                <Form.Control onChange={this.handleNameChange} value={this.state.name} />
              </Form.Group>

              <Form.Group>
                <Form.Control
                  onChange={this.handleFormatChange}
                  value={this.state.format}
                  as="select"
                >
                  <option>.txt</option>
                  <option>.json</option>
                  <option>.yaml</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>

          <Button style={{ margin: '1em' }} color="primary" variant="contained" onClick={this.downloadFile}>
            Download
          </Button>

        </div>
      </div>
    );
  }
}

export default Generate;