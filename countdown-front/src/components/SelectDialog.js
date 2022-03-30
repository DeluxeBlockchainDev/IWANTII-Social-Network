import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Autocomplete } from '@material-ui/lab';

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [checked, setChecked] = React.useState('');
  const [label, setLabel] = React.useState('Request');
  const { visible, data, selected, type, onClose, onSubmit } = props;

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  React.useEffect(() => {
    setOpen(visible);
    setOptions(data);
    setChecked(selected);
    setLabel(type);
  }, [visible, data, selected, type]);

  const submit = async event => {
    event.preventDefault();
    onSubmit(checked);
  };

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={submit}>
          <DialogTitle id="form-dialog-title">{`Choose ${label} To Leave Your Comment`}</DialogTitle>
          <DialogContent>
            {type === 'Request' ? (
              <Autocomplete
                fullWidth
                options={options}
                defaultValue={options.find(item => item._id === checked)}
                getOptionLabel={option => option.text}
                onChange={(target, val) => {
                  if (val) {
                    setChecked(val._id);
                  }
                }}
                renderInput={params => (
                  <TextField
                    fullWidth
                    {...params}
                    variant="outlined"
                    margin="dense"
                    required
                  />
                )}
              />
            ) : (
              <Autocomplete
                fullWidth
                options={options}
                defaultValue={options.find(item => item.user._id === checked)}
                getOptionLabel={option => option.user.name}
                onChange={(target, val) => {
                  if (val) {
                    setChecked(val.user._id);
                  }
                }}
                renderInput={params => (
                  <TextField
                    fullWidth
                    {...params}
                    variant="outlined"
                    margin="dense"
                    required
                  />
                )}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              className="btn btn-default"
              color="primary"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn btn-primary">
              OK
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
