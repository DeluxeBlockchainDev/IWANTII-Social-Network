import io from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../api/consts';

const socket = io(SOCKET_SERVER_URL);

export default socket;
