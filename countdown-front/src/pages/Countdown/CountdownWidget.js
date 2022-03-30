import React, { Component } from 'react';
// CountDown
import Countdown, { zeroPad } from 'react-countdown-now';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import SubscribeDialog from '../../components/SubscribeDialog';
import { LIKE, COUNTDOWNS, DISLIKE, SETTINGS, CONFIG } from '../../api/uri';
import { httpRequest, getUserId, notify } from '../../helpers/HttpHandler';
import Sharethis from './../../components/Sharethis';

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return (
      <React.Fragment>
        <ul className="count-down list-unstyled">
          <li id="hours" className="count-number list-inline-item m-2 bg-grey">
            {zeroPad(hours)}
            <p className="count-head">Hours</p>
          </li>
          <li id="mins" className="count-number list-inline-item m-2 bg-grey">
            {zeroPad(minutes)}
            <p className="count-head">Minutes</p>
          </li>
          <li id="secs" className="count-number list-inline-item m-2 bg-grey">
            {zeroPad(seconds)}
            <p className="count-head">Seconds</p>
          </li>
          <li id="end" className="h1" />
        </ul>
      </React.Fragment>
    );
  }
  // Render a countdown
  return (
    <React.Fragment>
      <ul className="count-down list-unstyled">
        <li id="hours" className="count-number list-inline-item m-2 bg-grey">
          {zeroPad(hours)}
          <p className="count-head">Hours</p>
        </li>
        <li id="mins" className="count-number list-inline-item m-2 bg-grey">
          {zeroPad(minutes)}
          <p className="count-head">Minutes</p>
        </li>
        <li id="secs" className="count-number list-inline-item m-2 bg-grey">
          {zeroPad(seconds)}
          <p className="count-head">Seconds</p>
        </li>
        <li id="end" className="h1" />
      </ul>
    </React.Fragment>
  );
};

export default class CountdownWidget extends Component {
  constructor() {
    super();
    this.state = {
      countdown: {},
      currentTime: 0,
      requests: [],
      dialogVisible: false,
      likeType: LIKE,
      show: false,
      isPending: false,
      pendingText: ''
    };

    this.likeCountdown = this.likeCountdown.bind(this);
    this.getPendingText = this.getPendingText.bind(this);
  }

  componentDidMount() {
    this.getPendingText();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        countdown: this.props.countdown,
        currentTime: this.props.currentTime,
        requests: this.props.requests,
        isPending: this.props.pending
      });
    }
  }

  /**
   * like/dislike countdown
   */
  async likeCountdown() {
    // get user id
    let userId = await getUserId();
    let res = await httpRequest(
      `${COUNTDOWNS}/${this.state.countdown._id}${this.state.likeType}`,
      'PUT',
      { user: userId }
    );
    if (res.success) {
      this.props.onUpdated(this.state.countdown._id);
    }
    notify(res);
  }

  // get current pending text
  async getPendingText() {
    let configRes = await httpRequest(`${SETTINGS}${CONFIG}`, 'GET');
    if (configRes.success) {
      this.setState({
        pendingText: `The Countdown Starts When It Reaches ${
          configRes.data.minUsers
        } Requests Or More.`
      });
    }
  }

  render() {
    const {
      countdown,
      currentTime,
      requests,
      dialogVisible,
      isPending,
      pendingText
    } = this.state;
    return (
      <Row className="shadow-xss rounded-xxl card p-4">
        <Col md={12} className="text-center">
          <h4 className="text-success mb-0 ft-25 fw-600">{countdown.name}</h4>
          <div className="font-lg fw-600 text-danger">
            <i className="feather-users me-2 fw-600 btn-round-lg" />
            {requests.length}
          </div>

          {isPending ? (
            <span className="text-warning font-xm m-auto menu-icon">
              {pendingText}
            </span>
          ) : (
            ''
          )}

          <div id="main-countdown" className="text-center position-relative">
            <Countdown
              date={currentTime * 1000}
              renderer={renderer}
              controlled
            />
          </div>
          {/* countdown like/dislike */}
          <div className="align-items-center">
            <ul className="list-unstyled mb-0 ms-3">
              <li className="list-inline-item likes">
                <Link
                  to="#"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      likeType: LIKE,
                      dialogVisible: true
                    });
                  }}
                  className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                >
                  <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss" />
                  Countdown Likes {countdown.likes}
                </Link>
              </li>
              <li className="list-inline-item likes">
                <Link
                  to="#"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      likeType: DISLIKE,
                      dialogVisible: true
                    });
                  }}
                  className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                >
                  <i className="feather-thumbs-down text-white bg-red-gradiant me-2 btn-round-xs font-xss" />
                  Countdown Dislikes {countdown.dislikes}
                </Link>
              </li>
              <li className="list-inline-item likes m-0">
                <Link
                  to="#"
                  onClick={e => {
                    e.preventDefault();
                    this.props.onNewComment(countdown._id);
                  }}
                  className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                >
                  <i className="feather-message-circle text-dark text-grey-900 btn-round-xs font-xs" />
                  Countdown Comments {countdown.comments}
                </Link>
              </li>
            </ul>
          </div>

          {/* share buttons */}
          {isPending ? <Sharethis /> : ''}
        </Col>

        <SubscribeDialog
          visible={dialogVisible}
          onClose={() => {
            this.setState({
              dialogVisible: false
            });
          }}
          onSubmit={this.likeCountdown}
        />
      </Row>
    );
  }
}
