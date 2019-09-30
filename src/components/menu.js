import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


let styles = {
    menu: {
        marginBottom: "2em",
    }
}

class drawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drawer: false
        };
    }


    render() {
        return (
            <div style={styles.menu}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={() => this.setState({ drawer: true })} edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography style={{ paddingLeft: '.75em' }} variant="h6">
                            UDel PAPER
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer anchor="left" open={this.state.drawer} onClose={() => this.setState({ drawer: false })}>
                    <div
                        role="presentation"
                        onClick={() => this.setState({ drawer: false })}
                        onKeyDown={() => this.setState({ drawer: false })}
                    >
                        <List>
                            {['Create Questions', 'View/Edit Questions', 'Generate Exam'].map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>{index % 2 === 0 ? <CloseIcon /> : <CheckIcon />}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default drawer;