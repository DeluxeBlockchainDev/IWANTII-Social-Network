import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MomentUtils from '@date-io/moment';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import moment from 'moment';
import RequestDTO from '../../../dto/Request';

const styles = () => ({
  dialogTitleRoot: {
    marginBottom: 15
  },
  user: {
    '& .MuiFormControl-root label + div > div': {
      paddingTop: 0
    },
    '& > span': {
      marginRight: 10
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"]': {
      padding: 10
    }
  }
});

function EditRequest(props) {
  const [open, setOpen] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const [request, setRequest] = useState(new RequestDTO());
  const [requestTIme, setRequestTIme] = React.useState(moment());
  const [userId, setUserId] = React.useState('');
  const [countdownId, setCountdownId] = React.useState('');
  const {
    classes,
    visible,
    isNew,
    onClose,
    data,
    onSave,
    users,
    countdowns
  } = props;

  function setDialogState() {
    setOpen(visible);
    setNewMode(isNew);
    setRequest(data);
    setUserId(data.user);
    setCountdownId(data.countdown);
    setRequestTIme(moment(request.createdAt));
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  function saveRequest(event) {
    event.preventDefault();
    onSave({
      _id: request._id,
      countdown: countdownId,
      user: userId,
      ip: users.find(item => item._id === userId)
        ? users.find(item => item._id === userId).ip
        : '',
      text: event.target.text.value,
      likes: event.target.likes.value,
      dislikes: event.target.dislikes.value,
      createdAt: requestTIme
    });
    handleClose();
  }

  useEffect(setDialogState, [visible, isNew, request]);

  return (
    <Dialog
      disableBackdropClick
      maxWidth="md"
      open={open}
      onClose={handleClose}
      className={classes.paper}
    >
      <DialogTitle className={classes.dialogTitleRoot}>
        {newMode ? 'New Request' : 'Edit Request'}
      </DialogTitle>
      <form onSubmit={saveRequest}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={countdowns}
                className={classes.user}
                defaultValue={countdowns.find(
                  item => item._id === request.countdown
                )}
                getOptionLabel={option => option.name}
                onChange={(target, val) => {
                  setCountdownId(val._id);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Countdown"
                    variant="outlined"
                    margin="dense"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={users}
                className={classes.user}
                defaultValue={users.find(item => item._id === request.user)}
                getOptionLabel={option => option.name}
                onChange={(target, val) => {
                  setUserId(val._id);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Username"
                    variant="outlined"
                    margin="dense"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="text"
                label="Request"
                required
                type="text"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                defaultValue={request.text}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="likes"
                label="Likes"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={request.likes}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="dislikes"
                label="Dislikes"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={request.dislikes}
              />
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDateTimePicker
                  margin="normal"
                  label="Created At"
                  format="DD/MM/YYYY HH:mm:ss"
                  value={requestTIme}
                  inputVariant="outlined"
                  fullWidth
                  onChange={val => {
                    setRequestTIme(val);
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditRequest.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  countdowns: PropTypes.array.isRequired
};

export default withStyles(styles)(EditRequest);
