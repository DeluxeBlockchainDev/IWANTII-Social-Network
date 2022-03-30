import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Button } from 'reactstrap';
import NotificationManager from 'react-notifications/lib/NotificationManager';

import Item from './CommentItem';

import { COMMENTS, REQUESTS } from '../api/uri';
import SubscribeDialog from './SubscribeDialog';
import SelectorDialog from './SelectDialog';
import { getUser } from './../helpers/UserCookie';
import { getUserId, httpRequest, notify } from '../helpers/HttpHandler';

class RequestComments extends Component {
  constructor() {
    super();
    this.state = {
      comments: [],
      requests: [],
      currentId: '',
      commentId: '',
      clickedNewComment: false,
      text: '',
      dialogVisible: false,
      selectDialogVisible: false,
      showRequest: false
    };

    this.newComment = this.newComment.bind(this);
    this.likeComment = this.likeComment.bind(this);
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.setState({
        comments: this.props.comments,
        requests: this.props.requests,
        currentId: this.props.id
      });
    }
  }

  /**
   * save new comment
   */
  newComment() {
    const { onSave } = this.props;
    let self = this;
    let spamCheck = require('spam-check');
    let options = { string: self.state.text, type: 'part' };
    spamCheck(options, function(err, results) {
      if (results.spam) {
        NotificationManager.error('Your comment is spam.');
      } else {
        onSave({
          name: getUser().name,
          email: getUser().email,
          category: REQUESTS,
          parentId: null,
          id: self.state.currentId,
          message: self.state.text
        });
        self.setState({
          text: '',
          clickedNewComment: false
        });
      }
    });
  }

  /**
   * like/dislike comment
   * @param {String} requestId
   * @param {String} id
   * @param {String} type
   */
  async likeComment(requestId, id, type) {
    let userId = await getUserId();
    let res = await httpRequest(
      `${REQUESTS}/${requestId}${COMMENTS}/${id}${type}`,
      'PUT',
      { user: userId }
    );

    if (res.success) {
      this.props.onUpdated();
    }
    notify(res);
  }

  render() {
    const {
      comments,
      requests,
      currentId,
      text,
      clickedNewComment,
      selectDialogVisible,
      dialogVisible,
      showRequest
    } = this.state;

    return (
      <React.Fragment>
        <Card className="border-0 mt-4">
          <CardBody className="p-2">
            <Row>
              <Col md={4} sm={12}>
                <h5 className="card-title"> Comments about Requests </h5>
              </Col>

              {comments.length > 0 ? (
                <Col md={4} sm={12} className="text-right">
                  {showRequest ? (
                    <Link
                      to="#"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({
                          showRequest: !this.state.showRequest
                        });
                      }}
                      className="text-muted ms-3 ft-16"
                    >
                      <i className="mdi mdi-eye" /> Hide Requests
                    </Link>
                  ) : (
                    <Link
                      to="#"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({
                          showRequest: !this.state.showRequest
                        });
                      }}
                      className="text-muted ms-3 ft-16"
                    >
                      <i className="mdi mdi-eye" /> Show Requests
                    </Link>
                  )}
                </Col>
              ) : (
                <Col md={4} sm={12} className="text-right">
                  <Row />
                </Col>
              )}

              <Col md={4} sm={12} className="text-right">
                <Link
                  to="#"
                  className="text-muted ms-3 ft-16"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      selectDialogVisible: true
                    });
                  }}
                >
                  <i className="mdi mdi-reply" />
                  Your comment about requests
                </Link>
              </Col>
            </Row>

            {clickedNewComment ? (
              <div className="ps-4 pt-2 pb-1 rounded relative">
                <TextField
                  value={text}
                  placeholder="Type your comment about requests here."
                  style={{ width: '80%' }}
                  onChange={e =>
                    this.setState({
                      text: e.target.value
                    })
                  }
                />
                {text ? (
                  <Button
                    type="button"
                    color="primary"
                    className="ms-3"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        dialogVisible: true
                      });
                    }}
                  >
                    Post
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled
                    color="primary"
                    className="ms-3"
                  >
                    Post
                  </Button>
                )}

                <Button
                  type="button"
                  color="secondary"
                  onClick={() => {
                    this.setState({
                      clickedNewComment: false
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              ''
            )}

            <ul className="media-list list-unstyled mb-0">
              {comments.length > 0
                ? comments.map((value, key) => (
                    <li key={key} className="mt-2 text-dark">
                      {showRequest ? (
                        <div className="mt-2 ps-4">
                          <p className="text-muted fst-italic p-1 bg-light rounded">
                            " {value.request.text} "
                          </p>
                        </div>
                      ) : (
                        ''
                      )}
                      <ul className="list-unstyled ps-4 ms-md-4 sub-comment">
                        {value.comments.map((comment, key) => (
                          <li key={key} className="mt-2 text-dark">
                            <Item
                              comments={comment}
                              category={REQUESTS}
                              onSave={this.props.onSave}
                              onLike={(id, type) => {
                                this.likeComment(value.request._id, id, type);
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))
                : ''}
            </ul>
          </CardBody>
        </Card>

        <SubscribeDialog
          visible={dialogVisible}
          onClose={() => {
            this.setState({
              dialogVisible: false
            });
          }}
          onSubmit={this.newComment}
        />

        <SelectorDialog
          visible={selectDialogVisible}
          data={requests}
          selected={currentId}
          type="Request"
          onClose={() => {
            this.setState({
              selectDialogVisible: false
            });
          }}
          onSubmit={id => {
            this.setState({
              currentId: id,
              selectDialogVisible: false,
              clickedNewComment: true
            });
          }}
        />
      </React.Fragment>
    );
  }
}

export default RequestComments;
