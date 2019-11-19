import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const OfflineNotify = (props) => {
  return (
    <Dialog onClose={props.closeNotify} open={props.open}>
      <DialogTitle>You're Offline</DialogTitle>
      <DialogContent>
        <DialogContentText>
          While your internet connection is offline, any new questions you create
          or edits you make to existing questions will be synced to the database when
          you come back online. Exam generating functionality will still work regardless of
          connection status. This feature is experimental and may not work as intended.
                </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeNotify} color="primary">
          OK
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OfflineNotify;

