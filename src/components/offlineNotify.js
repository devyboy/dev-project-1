import React from "react";
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

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

