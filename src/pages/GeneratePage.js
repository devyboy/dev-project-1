import React from 'react';
import Menu from '../components/menu';
// import Form from 'react-bootstrap/Form';
// import Col from 'react-bootstrap/Col';
// import Button from '@material-ui/core/Button';
import YAML from 'yaml';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Collapse from '@material-ui/core/Collapse';


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
    else{
      this.setState({ expanded: index });
    }
  }

  render() {

    const DragHandle = sortableHandle(() => <DragHandleIcon style={{cursor: "move", float: 'right'}} />);

    const SortableItem = sortableElement(({ value }) => {
      let index = this.state.questions.indexOf(value) + 1;

      return(
      <Card onClick={() => this.expandCard(index)} style={{ padding: ".75em", margin: "1em", textAlign: 'left', cursor: "pointer" }}>
        
        <CardHeader 
          style={{ padding: '.25em' }}
          action={<DragHandle />} 
          title={<p style={{ fontSize: '13px', color: 'grey', marginBottom: 0 }}>{"Question " + index}</p>}
        />

        <CardContent style={{ padding: '.25em' }}>
          <p style={{ fontSize: '1em', marginBottom: ".5em" }}>{value.question}</p>
          <p style={{ fontSize: "13px", marginBottom: 0 }}>{value.unit + " • " + value.type + " • "}<span style={styles[value.diff]}>{value.diff}</span></p>
        </CardContent>

        <Collapse in={this.state.expanded === index} unmountOnExit>
          <CardContent style={{ padding: '.25em', fontSize: "13px" }}>
            <p>Course: {value.course} </p>
            <p>SLO's: {value.SLO.map((slo) => 
                slo
              )}
            </p>
            <p>Answer: {value.answer}</p>
            <p>Cog Level: {value.cog}</p>
          </CardContent>
        </Collapse>

      </Card>
      );
    });

    const SortableList = sortableContainer(({ items }) => {
      return (
        items.map((value, index) => (
          <SortableItem key={`item-${value.question + index}`} index={index} value={value} />
        ))
      );
    });

  
    return (
      <div className="App">
        <Menu />

        {this.state.questions ?
          <div style={{ margin: "0 auto", width: "40%", overflow: "auto" }}>
            <h2>Generate Exam</h2>

            <SortableList items={this.state.questions} onSortEnd={this.onSortEnd} useDragHandle />

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