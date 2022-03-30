import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';
import { injectIntl, intlShape } from 'react-intl';
import messages from './message';
import UsersTable from './Table';
import EditWidget from './EditWidget';
import UserDTO from '../../../dto/User';
import { httpRequest, notify } from '../../../helpers/HttpHandler';
import { USERS } from '../../../api/consts';

function UsersPage(props) {
  const title = brand.name + ' - Users';
  const description = brand.desc;
  const { intl } = props;
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);
  const [newMode, setNewMode] = React.useState(false);
  const [user, setUser] = React.useState(new UserDTO());
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await httpRequest(USERS, 'GET');
    if (res.success) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = () => {
    setNewMode(true);
    setUser(new UserDTO());
    setEditDialogVisible(true);
  };

  const editUser = current => {
    setUser(current);
    setNewMode(false);
    setEditDialogVisible(true);
  };

  const saveUser = async updated => {
    const newUser = updated;

    if (newMode) {
      delete newUser._id;
      const res = await httpRequest(USERS, 'POST', newUser);
      notify(res);
    } else {
      const editRes = await httpRequest(
        `${USERS}/${newUser._id}`,
        'PUT',
        newUser
      );
      notify(editRes);
    }
    fetchUsers();
  };

  const removeUser = async current => {
    const res = await httpRequest(`${USERS}/${current._id}`, 'DELETE');
    notify(res);
    fetchUsers();
  };

  function closeEditWidget() {
    setEditDialogVisible(false);
  }

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
        icon="supervisor_account"
        desc={intl.formatMessage(messages.paperSubtitle)}
      >
        <UsersTable
          title={intl.formatMessage(messages.paperTitle)}
          data={users}
          onAdd={addUser}
          onEdit={editUser}
          onRemove={removeUser}
          loading={loading}
        />
      </PapperBlock>
      <EditWidget
        visible={editDialogVisible}
        isNew={newMode}
        onClose={closeEditWidget}
        data={user}
        onSave={saveUser}
      />
    </div>
  );
}

UsersPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(UsersPage);
