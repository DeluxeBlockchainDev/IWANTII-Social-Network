import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';
import { injectIntl, intlShape } from 'react-intl';
import messages from './message';
import CommentTable from './Table';
import EditWidget from './EditWidget';
import CommentDTO from '../../../../dto/comment/Request';
import { httpRequest, notify } from '../../../../helpers/HttpHandler';
import {
  COMMENTS, USERS, ALL, REQUESTS
} from '../../../../api/consts';

function RequstPage(props) {
  const title = brand.name + ' - Comments on Requests';
  const description = brand.desc;
  const { intl } = props;
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);
  const [newMode, setNewMode] = React.useState(false);
  const [current, setCurrent] = React.useState(new CommentDTO());
  const [comments, setComments] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const res = await httpRequest(`${REQUESTS}${COMMENTS}${ALL}`, 'GET');
    if (res.success) {
      if (res.data === '') {
        setComments([]);
      } else {
        setComments(res.data);
      }
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    setLoading(true);
    const res = await httpRequest(`${REQUESTS}`, 'GET');
    if (res.success) {
      if (res.data === '') {
        setRequests([]);
      } else {
        setRequests(res.data);
      }
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

  React.useEffect(() => {
    fetchComments();
    fetchUsers();
    fetchRequests();
  }, []);

  const addRequest = () => {
    setNewMode(true);
    setCurrent(new CommentDTO());
    setEditDialogVisible(true);
  };

  const editReqeust = currentComment => {
    setCurrent(currentComment);
    setNewMode(false);
    setEditDialogVisible(true);
  };

  const removeRequest = async currentComment => {
    const res = await httpRequest(
      `${REQUESTS}/${currentComment.countdown}${COMMENTS}/${
        currentComment._id
      }`,
      'DELETE'
    );
    notify(res);
    fetchComments();
  };

  function closeEditWidget() {
    setEditDialogVisible(false);
  }

  const saveComment = async updated => {
    const newComment = updated;
    if (newMode) {
      delete newComment._id;
      const res = await httpRequest(
        `${REQUESTS}/${newComment.countdown}${COMMENTS}`,
        'POST',
        newComment
      );
      notify(res);
    } else {
      const editRes = await httpRequest(
        `${REQUESTS}/${newComment.countdown}${COMMENTS}/${newComment._id}`,
        'PUT',
        newComment
      );
      notify(editRes);
    }
    fetchComments();
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
        title={intl.formatMessage(messages.title)}
        icon="send"
        desc={intl.formatMessage(messages.paperSubtitle)}
      >
        <CommentTable
          title={intl.formatMessage(messages.paperTitle)}
          onAdd={addRequest}
          onEdit={editReqeust}
          onRemove={removeRequest}
          loading={loading}
          users={users}
          data={comments}
          requests={requests}
        />
      </PapperBlock>
      <EditWidget
        visible={editDialogVisible}
        isNew={newMode}
        onClose={closeEditWidget}
        data={current}
        users={users}
        onSave={saveComment}
        requests={requests}
      />
    </div>
  );
}

RequstPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(RequstPage);
