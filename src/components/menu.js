import React from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import { Link } from 'react-router-dom';
import { 
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PlusIcon from '@material-ui/icons/Add';
import PencilIcon from '@material-ui/icons/Edit';
import SettingsIcon from "@material-ui/icons/Settings";


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
  },
  path: {
    color: "white"
  }
}

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  handleOpen(event) {
    this.setState({ drawer: true, anchorEl: event.currentTarget });
  }

  closeDrawer() {
    this.setState({ drawer: false })
  }

  signOut() {
    firebase.auth().signOut();
  
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
              <a href={"/"} style={styles.path}>UDel PAPER</a> /&nbsp;{this.props.path.map((path, key) => {
                return(
                    <span key={key}>
                      <a href={path.toLowerCase()} style={styles.path}>{path}</a>
                      &nbsp;/&nbsp;
                    </span>
                );
              })}
            </Typography>
            <Button color="inherit" style={styles.login} onClick={this.signOut} >Logout</Button>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={this.state.anchorEl}
          keepMounted
          open={this.state.drawer}
          onClose={this.closeDrawer}
        >
          <Link to={"/create"} onClick={this.closeDrawer} style={styles.link}>
            <MenuItem>
              <PlusIcon style={styles.icon} />
              Create Questions
            </MenuItem>
          </Link>
          <Link to={"/view-edit"} onClick={this.closeDrawer} style={styles.link}>
            <MenuItem>
              <PencilIcon style={styles.icon} />
              View Questions
            </MenuItem>
          </Link>
          <Link to={"/settings"} onClick={this.closeDrawer} style={styles.link}>
            <MenuItem>
              <SettingsIcon style={styles.icon} />
              Settings
            </MenuItem>
          </Link>
        </Menu>
      </div>
    );
  }
}

export default Drawer;