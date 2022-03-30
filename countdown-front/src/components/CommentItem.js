import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Button } from 'reactstrap';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { getUser } from './../helpers/UserCookie';
import SubscribeDialog from './SubscribeDialog';
import { COUNTDOWNS, DISLIKE, LIKE, USERS } from '../api/uri';

export default class Item extends Component {
  constructor() {
    super();
    this.state = {
      currentId: '',
      category: USERS,
      comment: {
        text: 'pending',
        user: {
          name: '',
          country: 'US'
        }
      },
      text: '',
      likeType: LIKE,
      showReply: false,
      dialogVisible: false,
      likeDialogVisible: false
    };

    this.saveComment = this.saveComment.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        comment: this.props.comments,
        category: this.props.category
      });
    }
  }

  /**
   * save new comment
   */
  saveComment(parentId, id) {
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
          category: self.state.category,
          parentId: parentId,
          id: id,
          message: self.state.text
        });
        self.setState({
          text: '',
          showReply: false
        });
      }
    });
  }

  render() {
    const {
      comment,
      text,
      showReply,
      dialogVisible,
      likeDialogVisible,
      category,
      currentId,
      likeType
    } = this.state;
    return (
      <React.Fragment>
        <div className="">{comment.text}</div>
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <div className="commentor-detail">
              <img
                alt={comment.user.name}
                src={`https://ui-avatars.com/api/name=${comment.user.name.replaceAll(
                  ' ',
                  ''
                )}&background=random`}
                className="img-avatar"
              />
              {comment.user.name}{' '}
              <i
                className={`m-0 flag-icon flag-icon-${comment.user.country.toLocaleLowerCase()}`}
              />
              <Link
                to="#"
                className="text-muted ms-3"
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    showReply: true
                  });
                }}
              >
                <i className="mdi mdi-reply" /> Reply
              </Link>
            </div>

            <div className="d-flex align-items-center ms-3">
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    likeType: LIKE,
                    currentId: comment._id,
                    likeDialogVisible: true
                  });
                }}
                className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
              >
                <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss" />
                Likes {comment.likes}
              </Link>
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    likeType: DISLIKE,
                    currentId: comment._id,
                    likeDialogVisible: true
                  });
                }}
                className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
              >
                <i className="feather-thumbs-down text-white bg-red-gradiant me-2 btn-round-xs font-xss" />
                Dislikes {comment.dislikes}
              </Link>
            </div>
          </div>
        </div>
        {showReply ? (
          <div className="ps-4 pt-2 pb-2 rounded relative">
            <TextField
              value={text}
              placeholder="Type your reply here."
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
              <Button type="button" disabled color="primary" className="ms-3">
                Post
              </Button>
            )}

            <Button
              type="button"
              color="secondary"
              onClick={() => {
                this.setState({
                  showReply: false
                });
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          ''
        )}
        {comment.reply && comment.reply.length > 0
          ? comment.reply.map((value, key) => (
              <ul
                key={key}
                className="list-unstyled ps-3 ms-md-4 sub-comment gray-border"
              >
                <li key={key} className="pt-2 text-dark">
                  <Item
                    comments={value}
                    category={this.state.category}
                    onSave={this.props.onSave}
                    onLike={this.props.onLike}
                  />
                </li>
              </ul>
            ))
          : ''}

        {/* dialog for reply */}
        <SubscribeDialog
          visible={dialogVisible}
          onClose={() => {
            this.setState({
              dialogVisible: false
            });
          }}
          onSubmit={() => {
            switch (category) {
              case COUNTDOWNS:
                this.saveComment(comment._id, comment.countdown);
                break;
              case USERS:
                this.saveComment(comment._id, comment.winner);
                break;
              default:
                this.saveComment(comment._id, comment.request);
                break;
            }
          }}
        />

        {/* dialog for like comment */}
        <SubscribeDialog
          visible={likeDialogVisible}
          onClose={() => {
            this.setState({
              likeDialogVisible: false
            });
          }}
          onSubmit={() => {
            this.props.onLike(currentId, likeType);
          }}
        />
      </React.Fragment>
    );
  }
}
