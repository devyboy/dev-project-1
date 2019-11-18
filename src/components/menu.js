import React from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PlusIcon from '@material-ui/icons/Add';
import PencilIcon from '@material-ui/icons/Edit';
import Button from "@material-ui/core/Button";
import UploadIcon from '@material-ui/icons/Publish';


let styles = {
    menu: {
        marginBottom: "2em",
        flexGrow: "1"
    },
    icon: {
        marginRight: ".5em",
    },
    link: {
        textDecoration: "none",
        color: "black",
    },
    login: {
        marginLeft: "auto"
    }
}

class Drawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drawer: false,
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    handleOpen(event) {
        this.setState({ drawer: true, anchorEl: event.currentTarget });
    }

    signOut() {
        firebase.auth().signOut();
        this.setState({ userObject: null })
    }

    render() {
        return (
            <div style={styles.menu}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            style={{ marginRight: ".5em" }}
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={this.handleOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" >
                            UDel PAPER
                        </Typography>
                        <Button color="inherit" style={styles.login} onClick={this.signOut} >Logout</Button>
                    </Toolbar>
                </AppBar>
                <Menu
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={this.state.drawer}
                    onClose={() => this.setState({ drawer: false })}
                >
                    <Link to={"/create"} onClick={() => this.setState({ drawer: false })} style={styles.link}>
                        <MenuItem>
                            <PlusIcon style={styles.icon} />
                            Create Questions
                        </MenuItem>
                    </Link>
                    <Link to={"/view-edit"} onClick={() => this.setState({ drawer: false })} style={styles.link}>
                        <MenuItem>
                            <PencilIcon style={styles.icon} />
                            View Questions
                        </MenuItem>
                    </Link>
                    <Link to={"/upload"} onClick={() => this.setState({ drawer: false })} style={styles.link}>
                        <MenuItem>
                            <UploadIcon style={styles.icon} />
                            Upload Questions
                        </MenuItem>
                    </Link>
                    {/* <Link to={"/generate"} onClick={() => this.setState({ drawer: false })} style={styles.link}>
                        <MenuItem>
                            <ExamIcon style={styles.icon} />
                            Generate Exam
                        </MenuItem>
                    </Link> */}
                </Menu>
            </div>
        );
    }
}

export default Drawer;