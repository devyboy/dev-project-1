import React from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import CustomSnackbar from "../components/customSnackbar";
import DownloadIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";
import ProfessorIcon from "@material-ui/icons/AssignmentInd";
import BackIcon from "@material-ui/icons/ArrowBack";
import YAML from 'yaml';
import "../css/exam.css";

import {
  DialogContent,
  Dialog,
  DialogTitle,
  TextField,
  MenuItem,
  Button
} from "@material-ui/core";


class ExamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speedOpen: false,
      open: false,
      format: ".html",
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleFormatChange = this.handleFormatChange.bind(this);
    this.changeFormat = this.changeFormat.bind(this);
    this.downloadFile = this.downloadFile.bind(this);

    window.scrollTo(0, 0); // scroll from the generate page applies to this page too, so go to top
  }

  handleNameChange(event) {
    this.setState({ filename: event.target.value });
  }

  handleFormatChange(event) {
    this.setState({ format: event.target.value });
  }

  convertToText(questions) { // export to .txt file
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

  changeFormat() {
    this.setState(state => ({
      answers: !state.answers, // shows the professor copy
      snackOpen: true,
      snackSuccess: true,
      snackMessage: !state.answers ? "Viewing answer key" : "Viewing student copy"
    }));
  }

  downloadFile() {
    let questions = this.props.location.state.questions;
    let fileDownload = require('js-file-download');
    switch (this.state.format) {
      case ".html":
        let pageHTML = document.getElementById("exam").innerHTML; // get the exam HTML as an element
        let template =
          // put that exam HTML into the body of a complete HTML document
          `<!DOCTYPE html>
                    <html> 
                        <head>
                            <meta charset="utf-8" />
                            <link rel="stylesheet" href="examStyles.css" />
                        </head>
                        <body>
                            ${pageHTML}
                        </body>
                    </html>`;
        fileDownload(template, this.state.filename + this.state.format);
        break;
      case ".json":
        fileDownload(JSON.stringify(questions), this.state.filename + this.state.format);
        break;
      case ".yaml":
        fileDownload(YAML.stringify(questions), this.state.filename + this.state.format);
        break;
      case ".txt":
        fileDownload(this.convertToText(questions), this.state.filename + this.state.format);
        break;
      default:
        let page = document.getElementById("exam").innerHTML;
        fileDownload(page, "exam.html");
        break;
    }
  }

  render() {
    let md = require('markdown-it')();
    return (
      <div>
        <div id="exam">
          {this.state.answers ?
            <div>
              <h1>PROFESSOR COPY - ANSWER KEY</h1>
              <br />
              {this.props.location.state.questions.map((q, key) => {
                let number = this.props.location.state.questions.indexOf(q) + 1
                return (
                  // it says dangerous but I tried to inject HTML and scripts but it didn't work so its fine
                  <div key={key} id={"question"}>
                    <div dangerouslySetInnerHTML={{ __html: md.render(number + ". " + q.question) }}></div>
                    <ul>{q.answer}</ul>
                  </div>
                ); // professor copy so just show the question and answer
              })}
            </div>
            :
            this.props.location.state.questions.map((q, key) => {
              let number = this.props.location.state.questions.indexOf(q) + 1;
              return (
                <div key={key} id={"question"}>
                  <div dangerouslySetInnerHTML={{ __html: md.render(number + ". " + q.question) }}></div>
                  {q.choices.length > 0 ?
                    <ul>
                      <p>A. {q.choices[0]}</p>
                      <p>B. {q.choices[1]}</p>
                      <p>C. {q.choices[2]}</p>
                      <p>D. {q.choices[3]}</p>
                    </ul>
                    :
                    <div style={{ height: `${(q.spacing ? q.spacing * .75 : 0) + 1}in` }}></div>
                  }
                </div>
              );
            })
          }

        </div>
        <div id="noprint">
          <Dialog onClose={() => this.setState({ open: false })} open={this.state.open}>
            <DialogTitle id="simple-dialog-title">Export Exam</DialogTitle>
            <DialogContent>
              <TextField
                style={{ width: 150 }}
                label="Filename"
                margin="normal"
                onChange={this.handleNameChange}
                value={this.state.name}
              />
              <TextField
                style={{ marginLeft: 7, width: 70 }}
                label="Type"
                margin="normal"
                onChange={this.handleFormatChange}
                value={this.state.format}
                select
              >
                <MenuItem value=".html">.html</MenuItem>
                <MenuItem value=".txt">.txt</MenuItem>
                <MenuItem value=".json">.json</MenuItem>
                <MenuItem value=".yaml">.yaml</MenuItem>
              </TextField>

              <br />

              <Button style={{ margin: '1em' }} color="primary" variant="contained" onClick={this.downloadFile}>
                Download
              </Button>

            </DialogContent>
          </Dialog>

          <Tooltip title="More actions">
            <SpeedDial
              ariaLabel="SpeedDial openIcon example"
              style={{ position: "fixed", bottom: 130, right: 70 }}
              icon={<SpeedDialIcon />}
              onClose={() => this.setState({ speedOpen: false })}
              onOpen={() => this.setState({ speedOpen: true })}
              open={this.state.speedOpen}
              direction={"up"}
            >
              <SpeedDialAction
                icon={<PrintIcon />}
                tooltipTitle="Print Exam"
                onClick={() => window.print()}
              />
              <SpeedDialAction
                icon={<DownloadIcon />}
                tooltipTitle="Download Exam"
                onClick={() => this.setState({ open: true })}
              />
              <SpeedDialAction
                icon={<ProfessorIcon />}
                tooltipTitle="Change Format"
                onClick={this.changeFormat}
              />
            </SpeedDial>
          </Tooltip>

          <Tooltip title="Go back">
            <Fab
              color="secondary"
              onClick={() => window.history.back()}
              style={{ position: "fixed", bottom: 60, right: 70 }}
            >
              <BackIcon />
            </Fab>
          </Tooltip>

          <CustomSnackbar
            vertical={"top"}
            horizontal={"right"}
            open={this.state.snackOpen}
            success={this.state.snackSuccess}
            message={this.state.snackMessage}
            closeSnack={() => this.setState({ snackOpen: false })}
          />
        </div>
      </div>
    );
  }
}

export default ExamPage;