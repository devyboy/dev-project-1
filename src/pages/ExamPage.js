import React from "react";
import { Redirect } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import DownloadIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";
import YAML from 'yaml';
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
            open: false,
            format: ".html",
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFormatChange = this.handleFormatChange.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
    }

    handleNameChange(event) {
        this.setState({ filename: event.target.value });
    }

    handleFormatChange(event) {
        this.setState({ format: event.target.value });
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

    downloadFile() {
        let questions = this.props.location.state.questions;
        let fileDownload = require('js-file-download');
        switch (this.state.format) {
            case ".html":
                let pageHTML = document.getElementById("exam").innerHTML;
                fileDownload(pageHTML, this.state.filename + this.state.format);
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
        if (this.props.user === false) {
            return (null);
        }
        return (
            <div>
                <div id="exam">
                    <div style={{ fontFamily: "Serif", fontSize: "12pt", margin: '.5in' }}>
                        {!this.props.user ?
                            <Redirect to={"/login"} />
                            :
                            <div>
                                {this.props.location.state.questions.map((q, key) => {
                                    let number = this.props.location.state.questions.indexOf(q) + 1
                                    return (
                                        <div key={key}>
                                            <p>{number + ". " + q.question}</p>
                                            {q.choices.length > 0 ?
                                                <ul>
                                                    <p>A. {q.choices[0]}</p>
                                                    <p>B. {q.choices[1]}</p>
                                                    <p>C. {q.choices[2]}</p>
                                                    <p>D. {q.choices[3]}</p>
                                                </ul>
                                                :
                                                <div style={{ height: `${(q.spacing ? q.spacing : 0) + 0.5}in` }}></div>
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        }
                    </div>
                </div>
                <Dialog onClose={() => this.setState({ open: false })} open={this.state.open}>
                    <DialogTitle id="simple-dialog-title">Download Exam</DialogTitle>
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
                            <MenuItem value=".json">.json</MenuItem>
                            <MenuItem value=".txt">.txt</MenuItem>
                            <MenuItem value=".yaml">.yaml</MenuItem>
                        </TextField>

                        <br />

                        <Button style={{ margin: '1em' }} color="primary" variant="contained" onClick={this.downloadFile}>
                            Download
                        </Button>
                    </DialogContent>
                </Dialog>
                <Fab onClick={() => window.print()} color="primary" aria-label="add" style={{ position: "fixed", bottom: 100, right: 50 }}>
                    <PrintIcon />
                </Fab>
                <Fab onClick={() => this.setState({ open: true })} color="primary" aria-label="add" style={{ position: "fixed", bottom: 30, right: 50 }}>
                    <DownloadIcon />
                </Fab>
            </div>
        );
    }
}

export default ExamPage;