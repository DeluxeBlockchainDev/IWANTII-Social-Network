import React from 'react';
import { PapperBlock } from 'enl-components';
import UserTable from './UserTable';
import { httpRequest } from '../../../helpers/HttpHandler';
import {
  USERS,
  SOCKET_NEW_REQUEST,
  SOCKET_END_COUNTDOWN
} from '../../../api/consts';
import SOCKET from '../../../helpers/Socket';

function LiveUserArea() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await httpRequest(`${USERS}?isLive=true`, 'GET');
    if (res.success) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  /**
   * socket event handler
   */
  const connectSocket = () => {
    // new request
    SOCKET.on(SOCKET_NEW_REQUEST, async () => {
      fetchUsers();
    });
    // end countdown
    SOCKET.on(SOCKET_END_COUNTDOWN, async () => {
      fetchUsers();
    });
  };

  React.useEffect(() => {
    fetchUsers();
    connectSocket();
  }, []);

  return (
    <PapperBlock
      noMargin
      title="Live Users"
      icon="supervisor_account"
      whiteBg
      desc="Show live users who join in the countdown right now"
    >
      <UserTable title="Users" data={users} loading={loading} />
    </PapperBlock>
  );
}

export default LiveUserArea;
