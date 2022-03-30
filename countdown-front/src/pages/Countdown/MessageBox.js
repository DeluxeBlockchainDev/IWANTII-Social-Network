import React, { Component, Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import io from 'socket.io-client';
import { Alert } from '@material-ui/lab';
import ReplyIcon from '@material-ui/icons/Reply';
import moment from 'moment';

import SubsribeDialog from './../../components/SubscribeDialog';
import history from './../../helpers/history';
import { httpRequest, getUserId } from './../../helpers/HttpHandler';
import { getIP } from './../../helpers/Country';
import {
  SETTINGS,
  CONFIG,
  COUNTDOWNS,
  CURRENT,
  REQUESTS,
  SOCKET_SERVER_URL
} from './../../api/uri';
import { PENDING_COUNTDOWN } from '../../api/socket';

// socket
const SOCKET = io(SOCKET_SERVER_URL);

class MessageBox extends Component {
  constructor() {
    super();
    this.state = {
      request: '',
      config: {
        minUsers: 100,
        requestLength: 150,
        bans: []
      },
      dialogVisible: false,
      pendingText: '',
      liveCountdown: '',
      showAlert: false
    };

    this.sendRequest = this.sendRequest.bind(this);
  }

  componentDidMount() {
    this.fetchConfig();
    this.connectSocket();
  }

  connectSocket() {
    const self = this;
    // countdown pending
    SOCKET.on(PENDING_COUNTDOWN, async time => {
      self.setState({
        pendingText: `The countdown will be get started ${moment
          .duration(time, 'seconds')
          .minutes()} minutes ${moment
          .duration(time, 'seconds')
          .seconds()} seconds later.`,
        showAlert: true
      });
      if (time === 0) {
        self.setState({
          showAlert: false
        });
        // new countdown id
        let countdownId = '';
        // get current countdown in progress
        let countdownRes = await httpRequest(`${COUNTDOWNS}${CURRENT}`, 'GET');
        if (countdownRes.success) {
          countdownId = countdownRes.data._id;
        }
        history.push(`/countdown/${countdownId}`);
      }
    });
  }

  // send reqeust to backend
  sendRequest = async () => {
    // get user id
    let userId = await getUserId();
    // ip
    let ipResponse = await getIP();
    let ip = '127.0.0.1';
    if (ipResponse.success) {
      ip = ipResponse.data.query;
    }

    // new countdown id
    let countdownId = '';
    // get current countdown in progress
    let countdownRes = await httpRequest(`${COUNTDOWNS}${CURRENT}`, 'GET');
    if (countdownRes.success) {
      countdownId = countdownRes.data._id;
    }
    // send request
    let res = await httpRequest(`${REQUESTS}`, 'POST', {
      user: userId,
      text: this.state.request,
      countdown: countdownId,
      ip: ip
    });
    // set live countdown
    this.setState({
      liveCountdown: countdownId
    });
    if (res.success) {
      NotificationManager.success('Your request has been successfully sent.');
      this.setState({
        showAlert: true
      });
    } else {
      NotificationManager.error(res.data);
    }
  };

  // fetch countdown settings
  async fetchConfig() {
    let res = await httpRequest(`${SETTINGS}${CONFIG}`, 'GET');
    if (res.success) {
      this.setState({
        config: {
          minUsers: res.data.minUsers,
          requestLength: res.data.requestLength,
          bans: res.data.bans.split(',')
        }
      });

      this.showCaptcha = this.showCaptcha.bind(this);
    }
  }

  // get reqeust text
  getRequestText(e) {
    // remove banning words
    this.state.config.bans.forEach(element => {
      // check forbidden word
      if (e.target.value.indexOf(element) === -1) {
        this.setState({
          request: e.target.value
        });
      } else {
        NotificationManager.error(`The word "${element}" is forbidden.`);
        e.target.value = e.target.value.replaceAll(element, '');
      }

      // check request length
      if (e.target.value.length > this.state.config.requestLength) {
        NotificationManager.error(
          `The max length of a request is ${this.state.config.requestLength}.`
        );
        e.target.value = e.target.value.slice(this.state.config.requestLength);
      }
    });
  }

  // show captcha dialog
  showCaptcha() {
    // no request inputed
    if (this.state.request === '') {
      NotificationManager.error('Please input your reqeust.');
      return;
    }
    // check spam
    var spamCheck = require('spam-check');
    var options = { string: this.state.request, type: 'part' };
    var self = this;
    spamCheck(options, function(err, results) {
      if (results.spam) {
        NotificationManager.error('Your request is spam.');
      } else {
        self.setState({
          dialogVisible: true
        });
      }
    });
  }

  render() {
    const { dialogVisible, showAlert, pendingText } = this.state;
    return (
      <Fragment>
        <div className="w__100 mb-3">
          <div className="row rounded-xxl white-border form-group mb-0 icon-input">
            <i className="feather-message-circle font-sm text-grey-400 left-0" />
            <textarea
              autoFocus
              type="text"
              name="request"
              rows={7}
              onChange={e => {
                this.getRequestText(e);
              }}
              max={this.state.config.requestLength}
              required
              autoComplete="off"
              placeholder="Write your request here to join the countdown."
              className="shadow-xss border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xs fw-500 rounded-xxl full-width theme-dark-bg"
            />
            <div className="btn-send-container text-right">
              <Link
                to="#"
                onClick={this.showCaptcha}
                className="p-2 text-center ms-0 menu-icon center-menu-icon"
              >
                <ReplyIcon className="btn-send font-xxl bg-success btn-send-lg text-white theme-dark-bg" />
              </Link>
            </div>
          </div>
        </div>

        {showAlert ? (
          <div className="row pb-3">
            <Alert
              security="info"
              onClose={() => {
                this.setState({
                  showAlert: false
                });
              }}
            >
              {pendingText}
            </Alert>
          </div>
        ) : (
          ''
        )}
        <SubsribeDialog
          visible={dialogVisible}
          onClose={() => {
            this.setState({
              dialogVisible: false
            });
          }}
          onSubmit={this.sendRequest}
        />
      </Fragment>
    );
  }
}

export default withRouter(MessageBox);
