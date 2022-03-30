import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import moment from 'moment';
import { CountrySelector } from 'enl-components';
import UserDTO from '../../../dto/User';

const styles = () => ({
  dialogTitleRoot: {
    marginBottom: 15
  }
});

function EditRequest(props) {
  const [open, setOpen] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const [user, setUser] = useState(new UserDTO());
  const [createdTime, setCreatedTime] = React.useState(moment());
  const [country, setCountry] = React.useState('');
  const [state, setState] = React.useState(true);
  const {
    classes, visible, isNew, onClose, data, onSave
  } = props;

  function init() {
    setOpen(visible);
    setNewMode(isNew);
    setUser(data);
    setState(data.active);
    setCountry(data.country);
    setCreatedTime(moment(data.createdAt));
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  function save(event) {
    event.preventDefault();
    onSave({
      _id: user._id,
      name: event.target.name.value,
      email: event.target.email.value,
      country,
      ip: event.target.ip.value,
      likes: event.target.likes.value,
      dislikes: event.target.dislikes.value,
      active: state,
      createdAt: createdTime
    });
    handleClose();
  }

  useEffect(init, [visible, isNew, user]);

  return (
    <Dialog
      disableBackdropClick
      maxWidth="md"
      open={open}
      onClose={handleClose}
      className={classes.paper}
    >
      <DialogTitle className={classes.dialogTitleRoot}>
        {newMode ? 'Fake User' : 'Edit User'}
      </DialogTitle>
      <form onSubmit={save}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Name"
                type="text"
                variant="outlined"
                fullWidth
                required
                defaultValue={user.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                defaultValue={user.email}
              />
            </Grid>
            <Grid item xs={12}>
              <CountrySelector
                margin="dense"
                name="country"
                label="Country"
                variant="outlined"
                fullWidth
                required
                value={user.country}
                onChange={val => {
                  setCountry(val);
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                name="ip"
                label="IP Address"
                type="text"
                fullWidth
                required
                variant="outlined"
                defaultValue={user.ip}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                name="likes"
                label="Likes"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={user.likes}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                name="dislikes"
                label="Dislikes"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={user.dislikes}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={(
                  <Switch
                    checked={state}
                    onChange={e => setState(e.target.checked)}
                    name="active"
                  />
                )}
                label="Active User"
              />
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDateTimePicker
                  margin="normal"
                  label="Created At"
                  format="DD/MM/YYYY HH:mm:ss"
                  value={createdTime}
                  inputVariant="outlined"
                  fullWidth
                  onChange={val => {
                    setCreatedTime(val);
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
  onSave: PropTypes.func.isRequired
};

export default withStyles(styles)(EditRequest);
