import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';
import { injectIntl, intlShape } from 'react-intl';
import messages from './message';
import RequestTable from './Table';
import EditWidget from './EditWidget';
import RequestDTO from '../../../dto/comment/Request';
import { httpRequest, notify } from '../../../helpers/HttpHandler';
import { COUNTDOWNS, REQUESTS, USERS } from '../../../api/consts';

function RequstPage(props) {
  const title = brand.name + ' - Requests';
  const description = brand.desc;
  const { intl } = props;
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);
  const [newMode, setNewMode] = React.useState(false);
  const [current, setCurrent] = React.useState(new RequestDTO());
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [countdowns, setCountdowns] = React.useState([]);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await httpRequest(REQUESTS, 'GET');
    if (res.success) {
      setRequests(res.data);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await httpRequest(USERS, 'GET');
    if (res.success) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  const fetchCountdowns = async () => {
    setLoading(true);
    const res = await httpRequest(COUNTDOWNS, 'GET');
    if (res.success) {
      setCountdowns(res.data);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchRequests();
    fetchUsers();
    fetchCountdowns();
  }, []);

  const addRequest = () => {
    setNewMode(true);
    setCurrent(new RequestDTO());
    setEditDialogVisible(true);
  };

  const editReqeust = currentRequest => {
    setCurrent(currentRequest);
    setNewMode(false);
    setEditDialogVisible(true);
  };

  const removeRequest = async currentRequest => {
    const res = await httpRequest(
      `${REQUESTS}/${currentRequest._id}`,
      'DELETE'
    );
    notify(res);
    fetchRequests();
  };

  function closeEditWidget() {
    setEditDialogVisible(false);
  }

  const saveRequest = async updated => {
    const newReqeust = updated;
    if (newMode) {
      delete newReqeust._id;
      const res = await httpRequest(REQUESTS, 'POST', newReqeust);
      notify(res);
    } else {
      const editRes = await httpRequest(
        `${REQUESTS}/${newReqeust._id}`,
        'PUT',
        newReqeust
      );
      notify(editRes);
    }
    fetchRequests();
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
        icon="send"
        desc={intl.formatMessage(messages.paperSubtitle)}
      >
        <RequestTable
          title={intl.formatMessage(messages.paperTitle)}
          onAdd={addRequest}
          onEdit={editReqeust}
          onRemove={removeRequest}
          data={requests}
          users={users}
          countdowns={countdowns}
          loading={loading}
        />
      </PapperBlock>
      <EditWidget
        visible={editDialogVisible}
        isNew={newMode}
        onClose={closeEditWidget}
        data={current}
        users={users}
        countdowns={countdowns}
        onSave={saveRequest}
      />
    </div>
  );
}

RequstPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(RequstPage);
