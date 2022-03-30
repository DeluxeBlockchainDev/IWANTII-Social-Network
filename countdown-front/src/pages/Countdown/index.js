import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Col, Row } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import Header from '../../components/Header';
import Countdowns from '../../components/CountdownList';
import Requests from '../../components/Requests';
import LiveUsers from '../../components/LiveUsers';
import Users from '../../components/UserList';
import Winner from '../../components/Winner';
import Comments from '../../components/Comments';
import history from '../../helpers/history';
import setPendingStatusAction from './../../store/action/statusAction';
import setSimpleModeAction from './../../store/action/modeAction';
import { getUserId, httpRequest } from '../../helpers/HttpHandler';
import {
  COMMENTS,
  CONFIG,
  COUNTDOWNS,
  PARAM_COUNT,
  PARAM_COUNTDOWN,
  PARAM_TOP,
  PARAM_WORST,
  REQUESTS,
  SEO,
  SETTINGS,
  SOCKET_SERVER_URL,
  USERS
} from '../../api/uri';
import { getIP } from '../../helpers/Country';
import {
  END_COUNTDOW,
  NEW_REQUEST,
  START_COUNTDOWN,
  SWITCH_WINNER
} from '../../api/socket';
import CountdownWidget from './CountdownWidget';
import MessageBox from './MessageBox';

// socket
const SOCKET = io(SOCKET_SERVER_URL);

class CountdownPanel extends Component {
  constructor() {
    super();
    this.state = {
      // current countdown
      countdown: {},
      // current comments
      comments: [],
      // comment type
      commentType: COUNTDOWNS,
      // user ip and country
      origin: {
        ip: '127.0.0.1',
        country: 'US'
      },
      // selected item id
      selectedId: '',
      // requests
      worstRequests: [],
      topRequests: [],
      // top users
      topUsers: [],
      // live user requests
      requests: [],
      // top countdowns
      topCountdowns: [],
      // winner
      winner: { _id: '', name: 'PENDING' },
      // winner's request
      winnerRequest: { _id: '', text: '' },
      // countdown in progress
      inProgress: false,
      // current countdown time
      currentTime: 0,
      // simple mode view
      simpleMode: true,
      // pendint to start countdown
      pendingStatus: true,
      // countdown comments
      countdownComments: [],
      // request comments
      requestComments: [],
      // user comments
      userComments: []
    };

    this.commentboxRef = React.createRef();
    this.countdownRef = React.createRef();

    // bind methods
    this.saveComments = this.saveComments.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.fetchCurrentCountdown = this.fetchCurrentCountdown.bind(this);
    this.fetchLiveUsers = this.fetchLiveUsers.bind(this);
    this.fetchTopCountdowns = this.fetchTopCountdowns.bind(this);
    this.fetchTopUsers = this.fetchTopUsers.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
    this.refreshTopRequests = this.refreshTopRequests.bind(this);
    this.refreshWorstRequests = this.refreshWorstRequests.bind(this);
    this.newReqeustComment = this.newReqeustComment.bind(this);
    this.newUserComment = this.newUserComment.bind(this);
    this.newCountdownComment = this.newCountdownComment.bind(this);
    this.updateWinnerComments = this.updateWinnerComments.bind(this);
    this.updateCountdownComments = this.updateCountdownComments.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isSimpleMode !== this.props.isSimpleMode) {
      this.setState({
        simpleMode: this.props.isSimpleMode
      });
      // fetch live users
      this.fetchTopUsers();
    }
  }

  async componentDidMount() {
    // conect socket server
    this.connectSocket();

    // get ip and country
    this.setUserIPAndCountry();

    // set seo
    this.setSEO();

    // fetch top/worst requests
    this.setState({
      worstRequests: await this.fetchReqeusts(PARAM_WORST),
      topRequests: await this.fetchReqeusts(PARAM_TOP)
    });

    // fetch live users
    this.fetchTopUsers();

    // get top countdowns
    this.fetchTopCountdowns();

    // fetch current countdonw
    this.fetchCurrentCountdown(this.props.match.params.id);

    history.listen((location, action) => {
      let pathArray = location.pathname.split('/');
      let id = pathArray[pathArray.length - 1];
      if (pathArray[pathArray.length - 2] === 'countdown') {
        // fetch current countdonw
        this.fetchCurrentCountdown(id);
      }
    });
  }

  /**
   * socket event handler
   */
  connectSocket() {
    const self = this;
    // start countdown
    SOCKET.on(START_COUNTDOWN, async function() {
      self.setState({
        pendingStatus: false,
        inProgress: true
      });
      self.props.setPendingStatus(false);
    });
    // new request
    SOCKET.on(NEW_REQUEST, async function() {
      self.countdownRef.current.scrollIntoView({
        behavior: 'smooth'
      });
      self.fetchLiveUsers();
    });

    // switch winner
    SOCKET.on(SWITCH_WINNER, function(payload) {
      if (self.props.match.params.id === payload.request.countdown) {
        self.setState({
          winner: payload.user,
          winnerRequest: payload.request,
          currentTime: payload.time,
          inProgress: true,
          pendingStatus: false
        });
        self.props.setPendingStatus(false);
      }
    });

    // end countdown
    SOCKET.on(END_COUNTDOW, function(payload) {
      if (self.props.match.params.id === payload.request.countdown) {
        self.setState({
          winner: payload.user,
          winnerRequest: payload.request,
          currentTime: payload.time,
          inProgress: false
        });

        // refresh countdown
        self.fetchCurrentCountdown(self.props.match.params.id);
      }
    });
  }

  /**
   * get/set user's IP and country name
   */
  async setUserIPAndCountry() {
    let ipResponse = await getIP();
    if (ipResponse.success) {
      this.setState({
        origin: {
          ip: ipResponse.data.query,
          country: ipResponse.data.country
        }
      });
    }
  }

  /**
   * get and set min user count to start countdown
   * and countdown period
   */
  async setConfiguration() {
    let configRes = await httpRequest(`${SETTINGS}${CONFIG}`, 'GET');
    if (configRes.success) {
      this.setState({
        winnerRequest: {
          text: `The countdown will get started when the number of live users reaches ${
            configRes.data.minUsers
          } and more.`
        },
        currentTime: configRes.data.duration * 60
      });
    }
  }

  /**
   * fetch seo contents and set to page
   */
  async setSEO() {
    let res = await httpRequest(`${SETTINGS}${SEO}`, 'GET');
    if (res.success) {
      document.getElementsByTagName('title')[0].innerHTML = res.data.title;
      document.getElementsByName('keywords')[0].content = res.data.keywords;
      document.getElementsByName('description')[0].content =
        res.data.description;
    }
  }

  /**
   * fetch current countdown
   */
  async fetchCurrentCountdown(id) {
    // current countdown
    let countdownRes = await httpRequest(`${COUNTDOWNS}/${id}`, 'GET');
    if (countdownRes.success) {
      // set id to fetch comments
      this.setState({
        selectedId: countdownRes.data._id,
        commentType: COUNTDOWNS
      });

      let countdown = countdownRes.data;
      countdown = {
        ...countdown,
        comments: (await httpRequest(
          `${COUNTDOWNS}/${countdown._id}${COMMENTS}?${PARAM_COUNT}`,
          'GET'
        )).data
      };

      this.setState({
        countdown: countdown
      });

      // fetch comments
      this.fetchComments();

      if (typeof countdownRes.data.winner === 'undefined') {
        // set configuration for countdown
        this.setConfiguration();
        this.setState({
          pendingStatus: true,
          inProgress: false
        });
        this.props.setPendingStatus(true);
      } else {
        this.setState({
          currentTime: 0
        });
        // get winner and winner's request
        let winnerRes = await httpRequest(
          `${USERS}/${countdownRes.data.winner}`,
          'GET'
        );
        // completed countdown
        if (winnerRes.success) {
          let winner = winnerRes.data;
          winner = {
            ...winner,
            comments: (await httpRequest(
              `${USERS}/${winnerRes.data._id}${COMMENTS}?${PARAM_COUNT}`,
              'GET'
            )).data
          };
          let winnerRequestRes = await httpRequest(
            `${REQUESTS}/${countdownRes.data.request}`,
            'GET'
          );
          let winnerRequest = {
            text: ''
          };
          if (winnerRequestRes.success) {
            winnerRequest = winnerRequestRes.data;
            winnerRequest = {
              ...winnerRequest,
              comments: (await httpRequest(
                `${REQUESTS}/${
                  winnerRequestRes.data._id
                }${COMMENTS}?${PARAM_COUNT}`,
                'GET'
              )).data
            };
          }
          this.setState({
            winnerRequest: winnerRequest,
            winner: winner,
            inProgress: false,
            pendingStatus: false
          });
          this.props.setPendingStatus(false);
        }
      }
      // fetch live users
      this.fetchLiveUsers();
    } else {
      // can not find the countdown
      history.push('/404');
    }
  }

  /**
   * fetch top countdowns from api
   */
  async fetchTopCountdowns() {
    let res = await httpRequest(`${COUNTDOWNS}?${PARAM_TOP}`, 'GET');
    if (res.success) {
      let resArray = [];
      for (let i = 0; i < res.data.length; i++) {
        let countdown = {
          ...res.data[i],
          comments: await this.getTotalCommentsCount(res.data[i]._id)
        };
        resArray.push(countdown);
      }
      this.setState({
        topCountdowns: resArray
      });
    }
  }

  async getTotalCommentsCount(countdownId) {
    // countdown comment
    let res = await httpRequest(
      `${COUNTDOWNS}/${countdownId}${COMMENTS}`,
      'GET'
    );
    let comments = 0;
    if (res.success) {
      comments += Number(res.data.length);
    }

    // user comment
    let requestRes = await httpRequest(
      `${REQUESTS}?${PARAM_COUNTDOWN}=${countdownId}`,
      'GET'
    );
    if (requestRes.success) {
      for (let i = 0; i < requestRes.data.length; i++) {
        let res = await httpRequest(
          `${USERS}/${requestRes.data[i].user}${COMMENTS}`,
          'GET'
        );
        if (res.success) {
          comments += res.data.length;
        }
      }
    }

    // request countdonw
    requestRes = await httpRequest(
      `${REQUESTS}?${PARAM_COUNTDOWN}=${countdownId}`,
      'GET'
    );
    if (requestRes.success) {
      for (let i = 0; i < requestRes.data.length; i++) {
        let res = await httpRequest(
          `${REQUESTS}/${requestRes.data[i]._id}${COMMENTS}`,
          'GET'
        );
        if (res.success) {
          comments += res.data.length;
        }
      }
    }

    return comments;
  }

  /**
   * fetch top users from api
   */
  async fetchTopUsers() {
    let res = await httpRequest(`${USERS}?${PARAM_TOP}`, 'GET');
    if (res.success) {
      let resArray = [];
      for (let i = 0; i < res.data.length; i++) {
        let user = {
          ...res.data[i],
          comments: (await httpRequest(
            `${USERS}/${res.data[i]._id}${COMMENTS}?${PARAM_COUNT}`,
            'GET'
          )).data
        };
        resArray.push(user);
      }
      this.setState({
        topUsers: resArray
      });
    }
  }

  /**
   * fetch live users and reqeusts from api
   */
  async fetchLiveUsers() {
    let res = await httpRequest(
      `${REQUESTS}?countdown=${this.state.countdown._id}`,
      'GET'
    );
    if (res.success) {
      let reqeustArray = [];
      for (let i = 0; i < res.data.length; i++) {
        // user comments
        let userRes = await httpRequest(`${USERS}/${res.data[i].user}`, 'GET');
        if (userRes.success) {
          let user = {
            ...userRes.data,
            comments: (await httpRequest(
              `${USERS}/${userRes.data._id}${COMMENTS}?${PARAM_COUNT}`,
              'GET'
            )).data
          };
          // request comments
          let request = {
            ...res.data[i],
            user: user,
            comments: (await httpRequest(
              `${REQUESTS}/${res.data[i]._id}${COMMENTS}?${PARAM_COUNT}`,
              'GET'
            )).data
          };
          reqeustArray.push(request);
        }
      }
      this.setState({
        requests: reqeustArray
      });
    }
  }

  /**
   * fetch comments
   */
  fetchComments() {
    this.fetchUserComments();
    this.fetchCountdownComments();
    this.fetchRequestComments();
  }

  /**
   * Save comment
   * @param {Object} comment
   */
  async saveComments(comment) {
    let res = {};
    // user id
    let id = await getUserId();

    // save comment
    if (comment.category) {
      this.setState({
        commentType: comment.category
      });
    }
    if (comment.id) {
      this.setState({
        selectedId: comment.id
      });
    }

    switch (this.state.commentType) {
      case COUNTDOWNS:
        res = await httpRequest(
          `${COUNTDOWNS}/${this.state.selectedId}${COMMENTS}`,
          'POST',
          {
            user: id,
            countdown: this.state.selectedId,
            text: comment.message,
            parentId: comment.parentId
          }
        );
        this.updateCountdownComments();
        this.fetchTopCountdowns();
        break;
      case REQUESTS:
        res = await httpRequest(
          `${REQUESTS}/${this.state.selectedId}${COMMENTS}`,
          'POST',
          {
            user: id,
            request: this.state.selectedId,
            text: comment.message,
            parentId: comment.parentId
          }
        );
        this.updateWinnerComments();
        this.setState({
          worstRequests: await this.fetchReqeusts(PARAM_WORST),
          topRequests: await this.fetchReqeusts(PARAM_TOP)
        });
        break;
      case USERS:
        res = await httpRequest(
          `${USERS}/${this.state.selectedId}${COMMENTS}`,
          'POST',
          {
            user: id,
            winner: this.state.selectedId,
            text: comment.message,
            parentId: comment.parentId
          }
        );
        this.updateWinnerComments();
        this.fetchLiveUsers();
        break;
      default:
        break;
    }

    if (res.success) {
      NotificationManager.success('Your comment has been sent successfully!');
      this.fetchComments();
    } else {
      NotificationManager.error(res.data.toString());
    }
  }

  /**
   * jump to request comments
   * @param {String} id
   */
  async newReqeustComment(id) {
    this.commentboxRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    // set id to fetch comments
    await this.setState({
      selectedId: id,
      commentType: REQUESTS
    });
    await this.fetchComments();
  }

  /**
   * jump to countdown comments
   * @param {String} id
   */
  async newCountdownComment(id) {
    this.commentboxRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    // set id to fetch comments
    await this.setState({
      selectedId: id,
      commentType: COUNTDOWNS
    });
    this.fetchComments();
  }

  /**
   * jump to user comments
   * @param {String} id
   */
  async newUserComment(id) {
    this.commentboxRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    // set id to fetch comments
    await this.setState({
      selectedId: id,
      commentType: USERS
    });
    await this.fetchComments();
  }

  /**
   * update winner comments count
   */
  async updateWinnerComments() {
    let winner = this.state.winner;
    winner = {
      ...winner,
      comments: (await httpRequest(
        `${USERS}/${winner._id}${COMMENTS}?${PARAM_COUNT}`,
        'GET'
      )).data
    };
    let winnerRequest = this.state.winnerRequest;
    winnerRequest = {
      ...this.state.winnerRequest,
      comments: (await httpRequest(
        `${REQUESTS}/${winnerRequest._id}${COMMENTS}?${PARAM_COUNT}`,
        'GET'
      )).data
    };
    this.setState({
      winnerRequest: winnerRequest,
      winner: winner
    });
  }

  /**
   * update countdown comment count
   */
  async updateCountdownComments() {
    let commentsRes = await httpRequest(
      `${COUNTDOWNS}/${this.state.countdown._id}${COMMENTS}?${PARAM_COUNT}`,
      'GET'
    );
    if (commentsRes.success) {
      let countdown = this.state.countdown;
      countdown = {
        ...countdown,
        comments: commentsRes.data
      };
      this.setState({
        countdown: countdown
      });
    }
  }

  /**
   * fetch 5 requests
   */
  async fetchReqeusts(param) {
    let worstRes = await httpRequest(`${REQUESTS}?${param}`, 'GET');
    let requests = [];
    if (worstRes.success) {
      for (let i = 0; i < worstRes.data.length; i++) {
        let request = worstRes.data[i];
        let userRes = await httpRequest(
          `${USERS}/${worstRes.data[i].user}`,
          'GET'
        );
        let commentRes = await httpRequest(
          `${REQUESTS}/${worstRes.data[i]._id}${COMMENTS}?${PARAM_COUNT}`,
          'GET'
        );
        if (userRes.success && commentRes.success) {
          request.user = userRes.data;
          request.comments = commentRes.data;
        }
        requests.push(request);
      }
    }
    return requests;
  }

  /**
   * refresh top request
   */
  async refreshTopRequests() {
    this.setState({
      topRequests: await this.fetchReqeusts(PARAM_TOP)
    });
  }

  /**
   * refresh worst request
   */
  async refreshWorstRequests() {
    this.setState({
      worstRequests: await this.fetchReqeusts(PARAM_WORST)
    });
  }

  /**
   * sort comments with reply
   * @param {Array} comments
   */
  sortComments(comments) {
    let rec = (comment, threads) => {
      threads.forEach(element => {
        let value = element;
        if (typeof value.reply === 'undefined') {
          value.reply = [];
        }

        if (value._id === comment.parentId) {
          value.reply.push(comment);
          return;
        }

        if (value.reply.length > 0) {
          rec(comment, value.reply);
        }
      });
    };

    let threads = [],
      comment;
    for (let i = 0; i < comments.length; i++) {
      comment = comments[i];
      comment['reply'] = [];
      let parentId = comment.parentId;
      if (!parentId) {
        threads.push(comment);
        threads.sort(function(a, b) {
          return b.likes - a.likes;
        });
        continue;
      }
      rec(comment, threads);
    }
    return threads;
  }

  /**
   * fetch countdown comments
   */
  async fetchCountdownComments() {
    let res = await httpRequest(
      `${COUNTDOWNS}/${this.state.countdown._id}${COMMENTS}`,
      'GET'
    );
    let comments = [];
    if (res.success && res.data.length > 0) {
      let commentsItem = [];
      for (let j = 0; j < res.data.length; j++) {
        let comment = res.data[j];
        let userRes = await httpRequest(`${USERS}/${res.data[j].user}`, 'GET');
        if (userRes.success) {
          comment.user = userRes.data;
        }
        commentsItem.push(comment);
      }
      comments.push({
        countdown: this.state.countdown,
        comments: this.sortComments(commentsItem)
      });
    }

    this.setState({
      countdownComments: comments
    });
    this.setState({
      countdownComments: comments
    });
  }

  /**
   * fetch request comments
   */
  async fetchRequestComments() {
    let requestRes = await httpRequest(
      `${REQUESTS}?${PARAM_COUNTDOWN}=${this.state.countdown._id}`,
      'GET'
    );
    let comments = [];
    if (requestRes.success) {
      for (let i = 0; i < requestRes.data.length; i++) {
        let res = await httpRequest(
          `${REQUESTS}/${requestRes.data[i]._id}${COMMENTS}`,
          'GET'
        );
        if (res.success && res.data.length > 0) {
          let commentsItem = [];
          for (let j = 0; j < res.data.length; j++) {
            let comment = res.data[j];
            let userRes = await httpRequest(
              `${USERS}/${res.data[j].user}`,
              'GET'
            );
            if (userRes.success) {
              comment.user = userRes.data;
            }
            commentsItem.push(comment);
          }
          let requestUserRes = await httpRequest(
            `${USERS}/${requestRes.data[i].user}`,
            'GET'
          );
          let request = requestRes.data[i];
          if (requestUserRes.success) {
            request.user = requestUserRes.data;
          }
          comments.push({
            request: request,
            comments: this.sortComments(commentsItem)
          });
        }
      }
    }

    this.setState({
      requestComments: comments
    });
    this.setState({
      requestComments: comments
    });
  }

  /**
   * fetch user comments
   */
  async fetchUserComments() {
    let requestRes = await httpRequest(
      `${REQUESTS}?${PARAM_COUNTDOWN}=${this.state.countdown._id}`,
      'GET'
    );
    let comments = [];
    if (requestRes.success) {
      for (let i = 0; i < requestRes.data.length; i++) {
        let res = await httpRequest(
          `${USERS}/${requestRes.data[i].user}${COMMENTS}`,
          'GET'
        );
        if (res.success && res.data.length > 0) {
          let commentsItem = [];
          for (let j = 0; j < res.data.length; j++) {
            let comment = res.data[j];
            let userRes = await httpRequest(
              `${USERS}/${res.data[j].user}`,
              'GET'
            );
            if (userRes.success) {
              comment.user = userRes.data;
            }
            commentsItem.push(comment);
          }
          let requestUserRes = await httpRequest(
            `${USERS}/${requestRes.data[i].user}`,
            'GET'
          );
          if (requestUserRes.success) {
            comments.push({
              user: requestUserRes.data,
              comments: this.sortComments(commentsItem)
            });
          }
        }
      }
    }

    this.setState({
      userComments: comments
    });
    this.setState({
      userComments: comments
    });
  }

  render() {
    const {
      requests,
      countdown,
      countdownComments,
      userComments,
      requestComments,
      worstRequests,
      topRequests,
      topUsers,
      topCountdowns,
      winner,
      winnerRequest,
      inProgress,
      currentTime,
      simpleMode,
      pendingStatus
    } = this.state;

    return (
      <React.Fragment>
        <Header />
        <Row className="main-panel p-4">
          {simpleMode ? (
            ''
          ) : (
            <Col md="3" sm="12" className="scroll-bar p-3">
              <Countdowns
                title="Top Countdowns"
                countdowns={topCountdowns}
                onUpdated={this.fetchTopCountdowns}
              />
              <Requests
                title="Top Requests"
                requests={topRequests}
                onUpdated={this.refreshTopRequests}
              />
              <Users
                users={topUsers}
                title="Top Users"
                onUpdated={this.fetchTopUsers}
              />
            </Col>
          )}

          <Col
            md={simpleMode ? 10 : 6}
            sm={12}
            className={simpleMode ? 'm-auto' : ''}
          >
            <Row className="justify-content-center pt-3">
              <Col lg={12} md={12} xs={12}>
                <MessageBox />
              </Col>
              <Col lg={12} md={12} xs={12} className="text-center">
                <div ref={this.countdownRef}>
                  {/* countdown */}
                  <CountdownWidget
                    countdown={countdown}
                    currentTime={currentTime}
                    requests={requests}
                    pending={pendingStatus}
                    onUpdated={this.fetchCurrentCountdown}
                    onNewComment={this.newCountdownComment}
                  />
                </div>

                {/* Possible winner */}
                {pendingStatus ? (
                  ''
                ) : (
                  <Row className="shadow-xss rounded-xxl card p-4 mt-3">
                    <Col md={12}>
                      <h4
                        className={
                          this.state.inProgress
                            ? 'text-success mb-0 ft-25 fw-600'
                            : 'text-success mb-0 ft-55 fw-600'
                        }
                      >
                        {this.state.inProgress ? 'Possible Winner' : 'Winner'}
                      </h4>
                      <Winner
                        user={winner}
                        isDone={!inProgress}
                        request={winnerRequest}
                        onNewRequestComment={this.newReqeustComment}
                        onNewUserComment={this.newUserComment}
                      />
                    </Col>
                  </Row>
                )}

                {/* Comments */}
                <Row className="shadow-xss rounded-xxl card mt-3">
                  <Col md={12}>
                    <div ref={this.commentboxRef}>
                      <Comments
                        id={countdown._id}
                        countdownComments={countdownComments}
                        userComments={userComments}
                        requestComments={requestComments}
                        requests={requests}
                        winner={winner}
                        winnerRequest={winnerRequest}
                        onSave={this.saveComments}
                        onUpdated={this.fetchComments}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          {simpleMode ? (
            ''
          ) : (
            <Col md="3" sm="12" className="p-3">
              <LiveUsers
                requests={requests}
                title={'Live Users'}
                onUpdated={this.fetchLiveUsers}
                onNewComment={this.newUserComment}
              />
              <Requests
                title="Worst Requests"
                requests={worstRequests}
                onUpdated={this.refreshWorstRequests}
              />
            </Col>
          )}
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
  isPending: state.getIn(['statusReducer', 'pending']),
  isSimpleMode: state.getIn(['modeReducer', 'simpleMode'])
});

const mapDispatchToProps = dispatch => ({
  setPendingStatus: bindActionCreators(setPendingStatusAction, dispatch),
  setSimpleMode: bindActionCreators(setSimpleModeAction, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CountdownPanel)
);
