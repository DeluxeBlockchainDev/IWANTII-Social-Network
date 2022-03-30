// React Basic and Bootstrap
import React, { Component } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

// Import Icons
import { CommentsCount, Comments } from 'react-facebook';
import { CommentCount, DiscussionEmbed } from 'disqus-react';

import CommentsBox from './CommentsBox';
import { getUser } from './../helpers/UserCookie';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import {
  COUNTDOWNS,
  FACEBOOK_APP_URL,
  DISQUS_SHORT_NAME,
  DISQUS_IDENTIFIER,
  DISQUS_TITLE,
  DISQUS_LANGUAGE
} from '../api/uri';

class CommentsWidget extends Component {
  constructor() {
    super();
    this.state = {
      countdownComments: [],
      userComments: [],
      requestComments: [],
      winner: { _id: '', name: '' },
      winnerRequest: { _id: '', text: '' },
      listTitle: '',
      dialogVisible: false,
      message: '',
      currentCountdownId: '',
      commentType: COUNTDOWNS,
      requests: [],
      disqusShow: false,
      facebookShow: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveComment = this.saveComment.bind(this);
  }

  /**
   * pop up captcha dialog
   * @param {Object} event
   */
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      dialogVisible: true
    });
  }

  /**
   * save new comment
   */
  saveComment() {
    const { onSave } = this.props;
    var self = this;

    var spamCheck = require('spam-check');
    var options = { string: this.state.message, type: 'part' };
    spamCheck(options, function(err, results) {
      if (results.spam) {
        NotificationManager.error('Your comment is spam.');
      } else {
        onSave({
          name: getUser().name,
          email: getUser().email,
          message: self.state.message
        });
        self.setState({
          message: ''
        });
      }
    });
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.setState({
        countdownComments: this.props.countdownComments,
        userComments: this.props.userComments,
        requestComments: this.props.requestComments,
        requests: this.props.requests,
        currentCountdownId: this.props.id,
        commentType: this.props.type,
        winner: this.props.winner,
        winnerRequest: this.props.winnerRequest
      });
    }
  }

  render() {
    const {
      countdownComments,
      userComments,
      requestComments,
      requests,
      winner,
      winnerRequest,
      currentCountdownId,
      disqusShow,
      facebookShow
    } = this.state;

    return (
      <React.Fragment>
        <div className="section text-left">
          <Card className="border-0 mt-3">
            <CardBody>
              <Row>
                <Col
                  md="6"
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <h4 className="card-title mb-0 text-success ft-25">
                    Comments
                  </h4>
                </Col>

                <Col md="6">
                  <Row className="align-items-center">
                    <Col
                      md="12"
                      style={{
                        display: 'flex',
                        color: '#000'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          color: '#2e9fff'
                        }}
                        onClick={() =>
                          this.setState(prevState => ({
                            ...prevState,
                            facebookShow: !prevState.facebookShow
                          }))
                        }
                      >
                        <img
                          src="https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-512.svg"
                          alt="Facebook icon"
                          style={{
                            width: '40px',
                            height: '40px',
                            marginRight: '7px'
                          }}
                        />
                        {currentCountdownId && (
                          <CommentsCount
                            href={FACEBOOK_APP_URL + `/${currentCountdownId}`}
                          />
                        )}
                        <span style={{ marginLeft: '5px' }}>Comments</span>
                      </div>

                      <div
                        style={{ cursor: 'pointer', color: '#2e9fff' }}
                        onClick={() =>
                          this.setState(prevState => ({
                            ...prevState,
                            disqusShow: !prevState.disqusShow
                          }))
                        }
                      >
                        <img
                          src="https://c.disquscdn.com/next/4e2f508/marketing/assets/img/brand/disqus-social-icon-blue-white.svg"
                          alt="Disqus icon"
                          style={{
                            width: '50px',
                            height: '50px',
                            position: 'relative',
                            marginLeft: '7px'
                          }}
                        />
                        <CommentCount
                          shortname={DISQUS_SHORT_NAME}
                          config={{
                            url: process.env.PUBLIC_URL,
                            identifier:
                              currentCountdownId !== ''
                                ? currentCountdownId
                                : DISQUS_IDENTIFIER,
                            title: DISQUS_TITLE
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Disqus comment box */}

              {disqusShow && (
                <Row>
                  <Col className="pt-2 pb-2">
                    <DiscussionEmbed
                      shortname={DISQUS_SHORT_NAME}
                      config={{
                        url: process.env.PUBLIC_URL,
                        identifier:
                          currentCountdownId !== ''
                            ? currentCountdownId
                            : DISQUS_IDENTIFIER,
                        title: DISQUS_TITLE,
                        language: DISQUS_LANGUAGE
                      }}
                    />
                  </Col>
                </Row>
              )}

              {/* Facebook comment box */}

              {facebookShow && (
                <Row>
                  <Col className="pt-2 pb-2">
                    <Comments
                      href={FACEBOOK_APP_URL + `/${currentCountdownId}`}
                    />
                  </Col>
                </Row>
              )}

              <CommentsBox
                countdownComments={countdownComments}
                userComments={userComments}
                requests={requests}
                requestComments={requestComments}
                winner={winner}
                winnerRequest={winnerRequest}
                id={currentCountdownId}
                onSave={this.props.onSave}
                onUpdated={this.props.onUpdated}
              />
            </CardBody>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default CommentsWidget;
