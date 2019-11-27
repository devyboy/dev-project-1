import React from "react";
import Menu from '../components/menu';
import { Redirect } from "react-router-dom";


function FourOhFour(props) {
    if (props.user === false) {
        return (null);
    }
    return (
        <div className="App">
            {!props.user ?
                <Redirect to={"/login"} />
                :
                <div>
                    <Menu path={props.location.pathname.slice(1, -1)} />
                    <h1>{props.location.pathname} not found</h1>
                </div>
            }
        </div>
    );
}

export default FourOhFour;