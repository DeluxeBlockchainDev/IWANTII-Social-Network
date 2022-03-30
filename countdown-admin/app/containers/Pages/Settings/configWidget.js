import React from 'react';
import PropTypes from 'prop-types';
import { PapperBlock } from 'enl-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

function ConfigWidget(props) {
  const { data, onSave } = props;
  const [settings, setSettings] = React.useState({
    minUsers: 0,
    duration: 0,
    requestLength: 0,
    switches: 0,
    bans: '',
    sameReqeust: 5,
    sameLink: 5,
    maxWin: 10,
    winnerShowTime: 10,
    fakeRequest: false
  });

  function save(event) {
    event.preventDefault();
    onSave(settings);
  }

  React.useEffect(() => {
    setSettings({ ...data });
  }, [data]);

  return (
    <PapperBlock
      whiteBg
      title="Configuration"
      icon="timer"
      desc="Set configuration of countdowns"
    >
      <form onSubmit={save}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Min number of live users to start a countdown"
              type="number"
              variant="outlined"
              fullWidth
              value={settings.minUsers}
              onChange={e => {
                setSettings({
                  ...settings,
                  minUsers: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Duation of a countdown(minutes)"
              type="number"
              variant="outlined"
              fullWidth
              value={settings.duration}
              onChange={e => {
                console.log({
                  ...settings,
                  duration: e.target.value
                });
                setSettings({
                  ...settings,
                  duration: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              label="Period of winner switches(second)"
              type="number"
              variant="outlined"
              fullWidth
              value={settings.switches}
              onChange={e => {
                setSettings({
                  ...settings,
                  switches: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              label="Time to display a winner and his request(minutes)"
              type="number"
              variant="outlined"
              fullWidth
              value={settings.winnerShowTime}
              onChange={e => {
                setSettings({
                  ...settings,
                  winnerShowTime: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              label="Max Reqeust Length"
              type="number"
              variant="outlined"
              fullWidth
              value={settings.requestLength}
              onChange={e => {
                setSettings({
                  ...settings,
                  requestLength: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              label="Max Count Which A User Can Win"
              type="number"
              variant="outlined"
              fullWidth
              value={settings.maxWin}
              onChange={e => {
                setSettings({
                  ...settings,
                  maxWin: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              label="Max Count Which A User Can Send Same Request"
              type="number"
              variant="outlined"
              fullWidth
              value={settings.sameReqeust}
              onChange={e => {
                setSettings({
                  ...settings,
                  sameReqeust: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              label="Max Count Which A User Can Send Same Link"
              type="number"
              variant="outlined"
              fullWidth
              value={settings.sameLink}
              onChange={e => {
                setSettings({
                  ...settings,
                  sameLink: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              margin="dense"
              label="Black Wordlist"
              type="text"
              variant="outlined"
              multiline
              rows={2}
              fullWidth
              value={settings.bans}
              onChange={e => {
                setSettings({
                  ...settings,
                  bans: e.target.value
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={(
                <Switch
                  checked={settings.fakeRequest}
                  onChange={e => setSettings({
                    ...settings,
                    fakeRequest: e.target.checked
                  })
                  }
                  name="autoFake"
                />
              )}
              label="Auto-generate Fake Requests"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </PapperBlock>
  );
}

ConfigWidget.propTypes = {
  data: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ConfigWidget;
