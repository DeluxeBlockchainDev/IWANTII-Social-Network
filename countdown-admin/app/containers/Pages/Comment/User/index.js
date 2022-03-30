import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';
import { injectIntl, intlShape } from 'react-intl';
import messages from './message';
import RequestTable from './Table';
import EditWidget from './EditWidget';
import CommentDTO from '../../../../dto/comment/User';
import { httpRequest, notify } from '../../../../helpers/HttpHandler';
import { COMMENTS, USERS, ALL } from '../../../../api/consts';

function RequstPage(props) {
  const title = brand.name + ' - Comments on Users';
  const description = brand.desc;
  const { intl } = props;
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);
  const [newMode, setNewMode] = React.useState(false);
  const [current, setCurrent] = React.useState(new CommentDTO());
  const [comments, setComments] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const res = await httpRequest(`${USERS}${COMMENTS}${ALL}`, 'GET');
    if (res.success) {
      if (res.data === '') {
        setComments([]);
      } else {
        setComments(res.data);
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
      `${USERS}/${currentComment.countdown}${COMMENTS}/${currentComment._id}`,
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
        `${USERS}/${newComment.countdown}${COMMENTS}`,
        'POST',
        newComment
      );
      notify(res);
    } else {
      const editRes = await httpRequest(
        `${USERS}/${newComment.countdown}${COMMENTS}/${newComment._id}`,
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
        icon="person"
        desc={intl.formatMessage(messages.paperSubtitle)}
      >
        <RequestTable
          title={intl.formatMessage(messages.paperTitle)}
          onAdd={addRequest}
          onEdit={editReqeust}
          onRemove={removeRequest}
          loading={loading}
          users={users}
          data={comments}
        />
      </PapperBlock>
      <EditWidget
        visible={editDialogVisible}
        isNew={newMode}
        onClose={closeEditWidget}
        data={current}
        users={users}
        onSave={saveComment}
      />
    </div>
  );
}

RequstPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(RequstPage);
