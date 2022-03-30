import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ClientCaptcha from 'react-client-captcha';
import { storeUser, getUser } from '../helpers/UserCookie';
import { notify } from '../helpers/HttpHandler';

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState({
    name: '',
    email: ''
  });
  const [captchaCode, setCaptchaCode] = React.useState('');
  const { visible, onClose, onSubmit } = props;

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  React.useEffect(() => {
    setOpen(visible);
    setUser(getUser());
  }, [visible]);

  const submit = async event => {
    event.preventDefault();
    // captcha validation
    if (captchaCode === event.target.captcha.value) {
      let user = {
        name: event.target.name.value,
        email: event.target.email.value
      };
      storeUser(JSON.stringify(user));
      setUser(getUser());
      onSubmit();
      handleClose();
    } else {
      notify({
        success: false,
        data: 'Captcha mismatched!'
      });
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={submit}>
          <DialogTitle id="form-dialog-title">Welcome To Join Us</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To send your request in this website, please enter your full name
              and email address here.
            </DialogContentText>
            <TextField
              margin="normal"
              name="name"
              label="Full Name"
              type="text"
              fullWidth
              required
              autoComplete="off"
              defaultValue={user.name}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              autoComplete="off"
              fullWidth
              required
              defaultValue={user.email}
            />
            <ClientCaptcha
              captchaCode={code => setCaptchaCode(code)}
              width={400}
              height={60}
              fontSize={50}
              charsCount={6}
              chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789"
              containerClassName="captcha-container"
              captchaClassName="captcha"
              backgroundColor="transparent"
              fontColor="#10d876"
              retry={false}
            />
            <TextField
              autoFocus
              margin="dense"
              name="captcha"
              label="Captcha Code"
              type="text"
              fullWidth
              autoComplete="off"
              required
            />
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
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
