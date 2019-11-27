import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const CustomSnackbar = (props) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: props.vertical || "bottom",
        horizontal: props.horizontal || "right",
      }}
      open={props.open}
      autoHideDuration={6000}
      onClose={() => props.closeSnack()}
      message={<span id="message-id">{props.message}</span>}
      action={
        props.success ? <CheckIcon /> : <CloseIcon />
      }
    />
  );
}

export default CustomSnackbar;