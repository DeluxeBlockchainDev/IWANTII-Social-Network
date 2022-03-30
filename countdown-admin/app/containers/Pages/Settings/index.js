import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { injectIntl } from 'react-intl';
import { httpRequest, notify } from '../../../helpers/HttpHandler';
import {
  SETTINGS, SEO, CONFIG, LANDING_PAGE
} from '../../../api/consts';
import PageContentsWidget from './PageContentsWidget';
import SeoWidget from './SeoWidget';
import ConfigWidget from './configWidget';

function SettingsPage() {
  const title = brand.name + ' - Settings';
  const description = brand.desc;
  const [config, setConfig] = useState({});
  const [seo, setSeo] = useState({});
  const [landing, setLanding] = React.useState({});

  const fetchSEO = async () => {
    const res = await httpRequest(`${SETTINGS}${SEO}`, 'GET');
    if (res.success) {
      setSeo(res.data);
    }
  };

  const fetchContents = async () => {
    const res = await httpRequest(`${SETTINGS}${LANDING_PAGE}`, 'GET');
    if (res.success) {
      setLanding(res.data);
    }
  };

  const fetchConfig = async () => {
    const res = await httpRequest(`${SETTINGS}${CONFIG}`, 'GET');
    if (res.success) {
      setConfig(res.data);
    }
  };

  const loadData = () => {
    fetchConfig();
    fetchContents();
    fetchSEO();
  };

  useEffect(loadData, []);

  async function saveConfig(settings) {
    const res = await httpRequest(`${SETTINGS}${CONFIG}`, 'PUT', settings);
    notify(res);
  }

  async function saveContents(settings) {
    const res = await httpRequest(
      `${SETTINGS}${LANDING_PAGE}`,
      'PUT',
      settings
    );
    notify(res);
  }

  async function saveSEO(settings) {
    const res = await httpRequest(`${SETTINGS}${SEO}`, 'PUT', settings);
    notify(res);
  }

  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>

      <ConfigWidget data={config} onSave={saveConfig} />

      <SeoWidget data={seo} onSave={saveSEO} />

      <PageContentsWidget data={landing} onSave={saveContents} />
    </Fragment>
  );
}

export default injectIntl(SettingsPage);
