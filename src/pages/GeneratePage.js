import React from 'react';
import Menu from '../components/menu';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import YAML from 'yaml';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Collapse from '@material-ui/core/Collapse';
import ShuffleIcon from "@material-ui/icons/Shuffle";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';


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
    textAlign: "left",
    margin: "0 auto",
    backgroundColor: "#ebebeb",
    padding: "1em",
    borderRadius: "7px",
    boxShadow: `
      0px 1px 5px 0px rgba(0,0,0,0.2), 
      0px 2px 2px 0px rgba(0,0,0,0.14), 
      0px 3px 1px -2px rgba(0,0,0,0.12)
      `
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
      format: ".json",
      filename: "",
      expanded: null,
      detailsModal: false,
      detailsQuestion: null,
      page: 1,
    }

    this.handleFormatChange = this.handleFormatChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.randomizeQuestions = this.randomizeQuestions.bind(this);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ questions }) => ({
      questions: arrayMove(questions, oldIndex, newIndex),
    }));
  };

  componentDidMount() {
    if (this.props.location.state === undefined) {
      window.location.href = "/view-edit"
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

    // DragHandle component (upper right thingy)

    const DragHandle = sortableHandle(() => <DragHandleIcon style={styles.dragHandle} />);

    // Individual Card component

    const SortableItem = sortableElement(({ value }) => {
      let index = this.state.questions.indexOf(value) + 1;

      return (
        <Card
          tabIndex={0}
          style={styles.card}
          onClick={() => this.expandCard(index - 1)}
        >

          <CardHeader
            style={styles.cardHeader}
            action={<DragHandle />}
            title={
              <p style={styles.questionNumber}>
                {"Question " + index}
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


    return (
      <div className="App">
        <Menu />

        {this.state.questions &&
          this.state.page === 1 && 
          <div>
            <h2>Generate Exam</h2>
            <hr style={{ width: "80%" }} />

            <p style={styles.notice}>
              On this page, you can drag the questions into the specific order you want them to be on the exam.
              To drag a question, use the drag handle in the top right of the card. To view a more detailed 
              description of each question, just click on the card. You can also click the "Randomize" button 
              to shuffle the questions randomly. Once you are satisfied, please click the "Next" button at the 
              bottom of the page to continue.
            </p>

            <Button variant="contained" color="primary" onClick={this.randomizeQuestions} style={{ margin: "1em" }}>
              Randomize
              <ShuffleIcon />
            </Button>

            <SortableList items={this.state.questions} onSortEnd={this.onSortEnd} axis="xy" useDragHandle />
            
            {this.state.detailsQuestion ? 
            
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
                            return(
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
                            return(
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
                <Button autoFocus onClick={() => this.setState({ detailsModal: false })} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            :
            null
            }

            <Button variant="contained" color="primary" onClick={() => this.setState({ page: 2 })} style={{ margin: "1em" }}>
              Next
            </Button>

          </div>
        }

        {this.state.page === 2 &&
          <div>
            <Form.Group as={Col} md="2">
              <Form.Label>File Name</Form.Label>
              <Form.Control onChange={this.handleNameChange} value={this.state.filename}>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="1">
              <Form.Label>File Format</Form.Label>
              <Form.Control onChange={this.handleFormatChange} as="select" value={this.state.format}>
                <option>.json</option>
                <option>.yaml</option>
                <option>.txt</option>
              </Form.Control>
            </Form.Group>

            <Button color="primary" variant="contained" onClick={this.downloadFile}>
              Download
            </Button>
            <Button color="secondary" variant="contained" onClick={() => this.setState({ page: 1 })}>
              Go Back
            </Button>
          </div>
        }

      </div>
    );
  }
}

export default Generate;