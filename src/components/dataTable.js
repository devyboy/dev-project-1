import React from "react";
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import EditIcon from "@material-ui/icons/Edit";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <MaterialTable
        title={"Question Table"}
        columns={[
          { title: '', field: 'edit', filtering: false, sorting: false,
            render: rowData => <Button onClick={() => this.props.handleEditQuestions(rowData)}><EditIcon/></Button>},
          { title: 'Course', field: 'course' },
          { title: 'Unit', field: 'unit' },
          { title: 'Topic', field: 'topic' },
          {
            title: 'Difficulty', field: 'diff',
            lookup: {
              Easy: "Easy",
              Medium: "Medium",
              Challenging: "Challenging"
            }
          },
          {
            title: 'Question Type', field: 'type',
            lookup: {
              "Multiple Choice": "Multiple Choice",
              "Free Response": "Free Response",
              "Programming": "Programming"
            }
          },
          { title: 'Content', field: 'question' },
        ]}
        data={
          this.props.questions.map((q) => {
            return ({
              course: q[1].pre + " " + q[1].course,
              unit: q[1].unit,
              topic: q[1].topic,
              diff: q[1].diff,
              type: q[1].type,
              question: q[1].question,
              id: q[0]
            })
          })
        }
        actions={[
          {
            tooltip: "Generate Exam",
            icon: 'assignment',
            onClick: (evt, data) => this.props.handleGenerateExam(data)
          },
          {
            tooltip: 'Delete Selected',
            icon: 'delete',
            onClick: (evt, data) => this.props.handleDeleteQuestions(data)
          },
        ]}
        options={{
          sorting: true,
          filtering: true,
          selection: true,
        }}
      />
    );
  }
}

export default DataTable;