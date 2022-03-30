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
import MomentUtils from '@date-io/moment';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CommentDTO from '../../../../dto/comment/Countdown';

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

function EditComment(props) {
  const [open, setOpen] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const [comment, setComment] = useState(new CommentDTO());
  const [writtenAt, setWrittenAt] = React.useState(moment());
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
    setComment(data);
    setUserId(data.user);
    setCountdownId(data.countdown);
    setWrittenAt(moment(comment.createdAt));
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  useEffect(setDialogState, [visible, isNew, comment]);

  function saveComment(event) {
    event.preventDefault();
    onSave({
      _id: comment._id,
      countdown: countdownId,
      user: userId,
      text: event.target.text.value,
      likes: event.target.likes.value,
      dislikes: event.target.dislikes.value,
      createdAt: writtenAt
    });
    handleClose();
  }

  return (
    <Dialog
      disableBackdropClick
      maxWidth="md"
      open={open}
      onClose={handleClose}
      className={classes.paper}
    >
      <DialogTitle className={classes.dialogTitleRoot}>
        {newMode ? 'New Comment' : 'Edit Comment'}
      </DialogTitle>
      <form onSubmit={saveComment}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={countdowns}
                className={classes.user}
                defaultValue={countdowns.find(
                  item => item._id === comment.countdown
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
                defaultValue={users.find(item => item._id === comment.user)}
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
                label="Comment"
                type="text"
                fullWidth
                multiline
                rows={3}
                required
                variant="outlined"
                defaultValue={comment.text}
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
                defaultValue={comment.likes}
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
                defaultValue={comment.dislikes}
              />
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDateTimePicker
                  margin="normal"
                  label="Written At"
                  format="DD/MM/YYYY HH:mm:ss"
                  value={writtenAt}
                  inputVariant="outlined"
                  fullWidth
                  onChange={val => {
                    setWrittenAt(val);
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

EditComment.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  countdowns: PropTypes.array.isRequired
};

export default withStyles(styles)(EditComment);
