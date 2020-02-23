import React, { forwardRef } from "react";
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import EditIcon from "@material-ui/icons/Edit";
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import FilterList from '@material-ui/icons/FilterList';
import Search from '@material-ui/icons/Search';
import Clear from '@material-ui/icons/Clear';
import Assignment from '@material-ui/icons/Assignment';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';


// Define all the icons that we're using for the table
const tableIcons = {
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  Assignment: forwardRef((props, ref) => <Assignment {...props} ref={ref} />),
}

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedQuestions: []
    }
  }

  shouldComponentUpdate(newP, newS) {
    if (this.state.selectedQuestions.length !== newS.selectedQuestions.length) {
      return false
    }
    else {
      return true;
    }
  }

  render() {
    return (
      <MaterialTable
        title={"Question Table"}
        icons={tableIcons} // supply the icons we defined before
        columns={[
          {
            // not using the built-in edit feature so we have to make a new column with edit buttons
            title: '', field: 'edit', filtering: false, sorting: false,
            render: rowData => <Button onClick={() => this.props.handleEditQuestions(rowData)}><EditIcon /></Button>
          },
          { title: 'Content', field: 'question' },
          {
            title: 'Type', field: 'type',
            lookup: {
              "Multiple Choice": "Multiple Choice",
              "Free Response": "Free Response",
              "Programming": "Programming",
              "True/False": "True/False",
            },
            cellStyle: { width: "170px" }
          },
          { title: 'Course', field: 'course', cellStyle: { width: "50px" } },
          { title: 'Topic', field: 'topic' },
          { title: 'Unit', field: 'unit' },
          {
            title: 'Difficulty', field: 'diff',
            lookup: {
              Easy: "Easy",
              Medium: "Medium",
              Challenging: "Challenging"
            }
          }
        ]}
        data={
          // render the data in the table, each field in the columns above corresponds to a key in this object
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
          // these are the actions that appear next to the search bar when you select a question
          {
            tooltip: 'Delete Selected',
            icon: 'delete',
            onClick: (evt, data) => this.props.handleDeleteQuestions(data)
          },
        ]}
        options={{
          sorting: true,
          filtering: true,
          selection: true, // this is what renders the checkbox column
        }}
        onSelectionChange={(rows) => {
          this.setState({ selectedQuestions: rows });
          this.props.handleSelect(rows);
          }
        }
      />
    );
  }
}

export default DataTable;