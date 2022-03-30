import React from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';
import messages from './message';
import CountdownTable from './Table';
import EditWidget from './EditWidget';
import CountdownDTO from '../../../dto/Countdown';
import { httpRequest, notify } from '../../../helpers/HttpHandler';
import { COUNTDOWNS, REQUESTS, USERS } from '../../../api/consts';

function Countdown(props) {
  const title = brand.name + ' - Countdowns';
  const description = brand.desc;
  const { intl } = props;
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);
  const [newMode, setNewMode] = React.useState(false);
  const [current, setCurrent] = React.useState(new CountdownDTO());
  const [countdowns, setCountdowns] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  const fetchCountdowns = async () => {
    setLoading(true);
    const res = await httpRequest(COUNTDOWNS, 'GET');
    if (res.success) {
      setCountdowns(res.data);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const res = await httpRequest(USERS, 'GET');
    if (res.success) {
      setUsers(res.data);
    }
  };

  const fetchRequests = async () => {
    const res = await httpRequest(REQUESTS, 'GET');
    if (res.success) {
      setRequests(res.data);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchCountdowns();
    await fetchUsers();
    await fetchRequests();
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const addCountdown = () => {
    setNewMode(true);
    setCurrent(new CountdownDTO());
    setEditDialogVisible(true);
  };

  const editCountdown = currentCoundown => {
    setCurrent(currentCoundown);
    setNewMode(false);
    setEditDialogVisible(true);
  };

  const removeCountdown = async currentCoundown => {
    const res = await httpRequest(
      `${COUNTDOWNS}/${currentCoundown._id}`,
      'DELETE'
    );
    notify(res);
    fetchCountdowns();
  };

  function closeEditWidget() {
    setEditDialogVisible(false);
  }
  const saveCountdown = async updated => {
    const newCountdown = updated;
    if (newMode) {
      delete newCountdown._id;
      const res = await httpRequest(COUNTDOWNS, 'POST', newCountdown);
      notify(res);
    } else {
      const editRes = await httpRequest(
        `${COUNTDOWNS}/${newCountdown._id}`,
        'PUT',
        newCountdown
      );
      notify(editRes);
    }
    fetchCountdowns();
  };

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <PapperBlock
        whiteBg
        title={intl.formatMessage(messages.paperTitle)}
        icon="timer"
        desc={intl.formatMessage(messages.paperSubtitle)}
      >
        <CountdownTable
          title={intl.formatMessage(messages.paperTitle)}
          onAdd={addCountdown}
          onEdit={editCountdown}
          onRemove={removeCountdown}
          data={countdowns}
          loading={loading}
          users={users}
          requests={requests}
        />
      </PapperBlock>
      <EditWidget
        visible={editDialogVisible}
        isNew={newMode}
        onClose={closeEditWidget}
        data={current}
        onSave={saveCountdown}
        users={users}
        requests={requests}
      />
    </div>
  );
}

Countdown.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(Countdown);
