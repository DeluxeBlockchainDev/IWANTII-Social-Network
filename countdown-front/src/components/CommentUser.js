import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Button } from 'reactstrap';
import NotificationManager from 'react-notifications/lib/NotificationManager';

import Item from './CommentItem';

import { COMMENTS, USERS } from '../api/uri';
import SubscribeDialog from './SubscribeDialog';
import SelectorDialog from './SelectDialog';
import { getUser } from './../helpers/UserCookie';
import { getUserId, httpRequest, notify } from '../helpers/HttpHandler';

class UserComments extends Component {
  constructor() {
    super();
    this.state = {
      comments: [],
      requests: [],
      currentId: '',
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
          category: USERS,
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
   * @param {String} winnerId
   * @param {String} id
   * @param {String} type
   */
  async likeComment(winnerId, id, type) {
    let userId = await getUserId();
    let res = await httpRequest(
      `${USERS}/${winnerId}${COMMENTS}/${id}${type}`,
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
      dialogVisible
    } = this.state;

    return (
      <React.Fragment>
        <Card className="border-0 mt-4">
          <CardBody className="p-2">
            <Row>
              <Col md={6} sm={12}>
                <h5 className="card-title"> Comments about Users </h5>
              </Col>
              <Col md={6} sm={12} className="text-right">
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
                  Your comment about users
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
                      <div className="d-flex align-items-center">
                        <div className="commentor-detail">
                          <h6 className="mb-0">
                            <Link
                              to="#"
                              className="text-dark media-heading  card-username"
                            >
                              {value.user.name}
                              <i
                                className={`flag-icon flag-icon-${value.user.country.toLocaleLowerCase()}`}
                              />
                            </Link>
                          </h6>
                        </div>
                      </div>
                      <ul className="list-unstyled ps-4 ms-md-4 sub-comment">
                        {value.comments.map((comment, key) => (
                          <li key={key} className="mt-2 text-dark">
                            <Item
                              comments={comment}
                              category={USERS}
                              onSave={this.props.onSave}
                              onLike={(id, type) => {
                                this.likeComment(value.user._id, id, type);
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
          type="Users"
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

export default UserComments;
