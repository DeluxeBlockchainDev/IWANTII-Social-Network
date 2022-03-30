import React from 'react';
import PropTypes from 'prop-types';
import { PapperBlock } from 'enl-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function PageContentsWidget(props) {
  const { data, onSave } = props;
  const [settings, setSettings] = React.useState({
    title: '',
    description: 0,
    howto: 0
  });

  function save(event) {
    event.preventDefault();
    onSave(settings);
  }

  React.useEffect(() => {
    setSettings(data);
  }, [data]);

  return (
    <PapperBlock
      whiteBg
      title="Landing Page"
      icon="home"
      desc="Set landing page contents"
    >
      <form onSubmit={save}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="Title"
              label="Title"
              type="text"
              variant="outlined"
              fullWidth
              value={settings.title}
              onChange={e => {
                setSettings({
                  ...settings,
                  title: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              multiline
              rows={5}
              variant="outlined"
              fullWidth
              value={settings.description}
              onChange={e => {
                setSettings({
                  ...settings,
                  description: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="howto"
              label="How Does It work"
              type="text"
              multiline
              rows={5}
              variant="outlined"
              fullWidth
              value={settings.howto}
              onChange={e => {
                setSettings({
                  ...settings,
                  howto: e.target.value
                });
              }}
              required
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

PageContentsWidget.propTypes = {
  data: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default PageContentsWidget;
