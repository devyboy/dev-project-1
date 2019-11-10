import React from 'react';
import Menu from '../components/menu';
// import Form from 'react-bootstrap/Form';
// import Col from 'react-bootstrap/Col';
// import Button from '@material-ui/core/Button';
import YAML from 'yaml';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Collapse from '@material-ui/core/Collapse';
import IconButton from "@material-ui/core/IconButton";


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
  iconButton: { 
    padding: "2px"
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
}

class Generate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null,
      format: ".json",
      filename: "",
      expanded: null,
    }

    this.handleFormatChange = this.handleFormatChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
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
    if (index === this.state.expanded) {
      this.setState({ expanded: "" });
    }
    else {
      this.setState({ expanded: index });
    }
  }

  render() {

    const DragHandle = () => 
      <IconButton style={styles.iconButton}>
        <DragHandleIcon />
      </IconButton>

    const SortableItem = sortableElement(({ value }) => {
      let index = this.state.questions.indexOf(value) + 1;

      return (
        <Card
          tabIndex={0}
          onClick={() => this.expandCard(index)}
          style={styles.card}
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
                <strong>SLO's:</strong>
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

    const SortableList = sortableContainer(({ items }) => {
      return (
        <ul>
          {items.map((value, index) => (
            <SortableItem key={`item-${value.question + index}`} index={index} value={value} />
          ))}
        </ul>
      );
    });


    return (
      <div className="App">
        <Menu />

        {this.state.questions ?
          <div>
            <h2>Generate Exam</h2>

            <SortableList items={this.state.questions} onSortEnd={this.onSortEnd} axis="xy"/>

            {/* <Form.Group as={Col} md="2">
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
            </Button> */}

          </div>
          :
          null
        }

      </div>
    );
  }
}

export default Generate;