import React from 'react';
import Menu from '../components/menu';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from '@material-ui/core/Button';
import YAML from 'yaml';


class Generate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null,
      format: ".json",
      filename: "",
    }

    this.handleFormatChange = this.handleFormatChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

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
    console.log(this.state.format);
    switch(this.state.format) {
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
    console.log(questions);
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

  render() {
    return(
      <div className="App">
        <Menu />

        {this.state.questions ? 
          <div>
            <h2>Generate Exam</h2>

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
          </div>
          :
          null
        }

      </div>
    );
  }
}

export default Generate;