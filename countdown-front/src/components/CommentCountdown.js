import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Button } from 'reactstrap';
import NotificationManager from 'react-notifications/lib/NotificationManager';

import Item from './CommentItem';

import { COMMENTS, COUNTDOWNS } from '../api/uri';
import SubscribeDialog from './SubscribeDialog';
import { getUser } from './../helpers/UserCookie';
import { getUserId, httpRequest, notify } from '../helpers/HttpHandler';

class CountdownComments extends Component {
  constructor() {
    super();
    this.state = {
      countdowns: [],
      currentId: '',
      clickedNewComment: false,
      text: '',
      dialogVisible: false
    };

    this.newComment = this.newComment.bind(this);
    this.likeComment = this.likeComment.bind(this);
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.setState({
        countdowns: this.props.countdowns,
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
          category: COUNTDOWNS,
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

  async likeComment(id, type) {
    let userId = await getUserId();
    let res = await httpRequest(
      `${COUNTDOWNS}/${this.state.currentId}${COMMENTS}/${id}${type}`,
      'PUT',
      { user: userId }
    );

    if (res.success) {
      this.props.onUpdated();
    }
    notify(res);
  }

  render() {
    const { countdowns, text, clickedNewComment, dialogVisible } = this.state;

    return (
      <React.Fragment>
        <Card className="border-0">
          <CardBody className="p-2">
            {/* countdown comments */}
            <Row>
              <Col md={6} sm={12}>
                <h5 className="card-title mb-0"> Comments about Countdown</h5>
              </Col>
              <Col md={6} sm={12} className="text-right">
                <Link
                  to="#"
                  className="text-muted ms-3 ft-16"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      clickedNewComment: true
                    });
                  }}
                >
                  <i className="mdi mdi-reply" />
                  Your comment about countdown
                </Link>
              </Col>
            </Row>

            {clickedNewComment ? (
              <div className="ps-4 pt-2 pb-1 rounded relative">
                <TextField
                  value={text}
                  placeholder="Type your comment about countdown here."
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
              {countdowns.length > 0
                ? countdowns.map((value, key) => (
                    <li key={key} className="mt-3">
                      <ul className="list-unstyled ps-4 sub-comment">
                        {value.comments.map((comment, key) => (
                          <li key={key} className="mt-2 ft-16 text-dark">
                            <Item
                              comments={comment}
                              category={COUNTDOWNS}
                              onSave={this.props.onSave}
                              onLike={this.likeComment}
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
      </React.Fragment>
    );
  }
}

export default CountdownComments;
