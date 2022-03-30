import React from 'react';
import PropTypes from 'prop-types';
import { PapperBlock } from 'enl-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function SeoWidget(props) {
  const { data, onSave } = props;
  const [settings, setSettings] = React.useState({
    title: '',
    description: 0,
    keywords: 0
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
      title="SEO"
      icon="search"
      desc="Set configuration for SEO"
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
              name="keywords"
              label="Keywords"
              type="text"
              variant="outlined"
              fullWidth
              value={settings.keywords}
              onChange={e => {
                setSettings({
                  ...settings,
                  keywords: e.target.value
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

SeoWidget.propTypes = {
  data: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default SeoWidget;
