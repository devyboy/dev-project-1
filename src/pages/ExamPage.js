import React from "react";
import { Redirect } from "react-router-dom";


function ExamPage(props) {
    if (props.user === false) {
        return (null);
    }
    return (
        <div style={{fontFamily: "Serif", fontSize: "20pt", margin: '.5in'}}>
            {!props.user ?
                <Redirect to={"/login"} />
                :
                <div>
                    Name: _______________________________________
                    {props.location.state.questions.map((q, key) => {
                        let number = props.location.state.questions.indexOf(q) + 1
                        return (
                            <p key={key}>{number + ". " + q.question}</p>
                        );
                    })}
                </div>
            }
        </div>
    );
}

export default ExamPage;