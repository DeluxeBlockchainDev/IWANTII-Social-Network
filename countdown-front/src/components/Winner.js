import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCountryName } from './../helpers/Country';
import SubscribeDialog from './SubscribeDialog';
import { LIKE, DISLIKE, USERS, REQUESTS } from '../api/uri';
import { httpRequest, getUserId, notify } from '../helpers/HttpHandler';
import { InlineShareButtons } from 'sharethis-reactjs';
import { Button } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import { PopoverBody, PopoverHeader, UncontrolledPopover } from 'reactstrap';

export default class Winner extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        name: ''
      },
      request: {
        text: ''
      },
      isDone: false,
      show: false,
      dialogVisible: false,
      likeType: LIKE,
      targetType: 0 // 1 - winner, 1 - Request
    };

    this.likeWinner = this.likeWinner.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props.user && this.props.request) {
      this.setState({
        isDone: this.props.isDone,
        request: this.props.request,
        user: this.props.user
      });
    }
  }

  /**
   * like/dislike winner/request
   */
  async likeWinner() {
    // get user id
    let userId = await getUserId();
    let res = {};
    // winner
    if (this.state.targetType === 0) {
      res = await httpRequest(
        `${USERS}/${this.state.user._id}${this.state.likeType}`,
        'PUT',
        { user: userId }
      );

      if (res.success) {
        if (this.state.likeType === LIKE) {
          this.setState({
            user: {
              ...this.state.user,
              likes: Number(this.state.user.likes) + 1
            }
          });
        } else {
          this.setState({
            user: {
              ...this.state.user,
              dislikes: Number(this.state.user.dislikes) + 1
            }
          });
        }
      }
    }
    // request
    else {
      res = await httpRequest(
        `${REQUESTS}/${this.state.request._id}${this.state.likeType}`,
        'PUT',
        { user: userId }
      );

      if (res.success) {
        if (this.state.likeType === LIKE) {
          this.setState({
            request: {
              ...this.state.request,
              likes: Number(this.state.request.likes) + 1
            }
          });
        } else {
          this.setState({
            request: {
              ...this.state.request,
              dislikes: Number(this.state.request.dislikes) + 1
            }
          });
        }
      }
    }

    notify(res);
  }

  render() {
    const { isDone, user, request, dialogVisible, show } = this.state;
    return (
      <React.Fragment>
        <h1 className="fw-bold mb-0 ft-40 pt-4">
          {typeof user === 'undefined' ? '' : user.name}
          {user.country ? (
            <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
              {getCountryName(user.country)}
              <i
                className={`flag-icon flag-icon-${user.country.toLocaleLowerCase()}`}
              />
            </span>
          ) : (
            ''
          )}
        </h1>

        {/* user like/dislike isDone */}
        {isDone ? (
          <div>
            <div className="align-items-center pt-3">
              <ul className="list-unstyled mb-0 ms-3">
                <li className="list-inline-item likes">
                  <Link
                    to="#"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        likeType: LIKE,
                        targetType: 0,
                        dialogVisible: true
                      });
                    }}
                    className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  >
                    <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss" />
                    Winner Like {user.likes}
                  </Link>
                </li>
                <li className="list-inline-item likes">
                  <Link
                    to="#"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        likeType: DISLIKE,
                        targetType: 0,
                        dialogVisible: true
                      });
                    }}
                    className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  >
                    <i className="feather-thumbs-down text-white bg-red-gradiant me-2 btn-round-xs font-xss" />
                    Winner Dislike {user.dislikes}
                  </Link>
                </li>
                <li className="list-inline-item likes m-0">
                  <Link
                    to="#"
                    onClick={e => {
                      e.preventDefault();
                      this.props.onNewUserComment(user._id);
                    }}
                    className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  >
                    <i className="feather-message-circle text-dark text-grey-900 btn-round-xs font-xs" />
                    Winner Comment {user.comments}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="align-items-center pt-3">
              <ul className="list-unstyled mb-0 ms-3">
                <li className="list-inline-item likes">
                  <Link
                    to="#"
                    onClick={e => e.preventDefault()}
                    id="sameRequest"
                    className="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  >
                    <i className="feather-copy text-dark text-grey-900 btn-round-sm font-xs" />
                    Same Requests {user.sameRequest}
                  </Link>
                  <UncontrolledPopover
                    trigger="focus"
                    placement="bottom"
                    target="sameRequest"
                  >
                    <PopoverHeader>Request</PopoverHeader>
                    <PopoverBody>
                      {`This Same Request Has Been Submitted ${
                        user.sameRequest
                      } More Time`}
                    </PopoverBody>
                  </UncontrolledPopover>
                </li>
                <li className="list-inline-item likes">
                  <Link
                    to="#"
                    onClick={e => e.preventDefault()}
                    id="sameLink"
                    className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  >
                    <i className="feather-link text-dark text-grey-900 btn-round-sm font-xs" />
                    Same Links {user.sameLinks}
                  </Link>
                  <UncontrolledPopover
                    trigger="focus"
                    placement="bottom"
                    target="sameLink"
                  >
                    <PopoverHeader>Link</PopoverHeader>
                    <PopoverBody>
                      {`This Same Link Has Been Submitted ${
                        user.sameLinks
                      } More Time`}
                    </PopoverBody>
                  </UncontrolledPopover>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          ''
        )}

        <p className="text-left text-center ft-20 pt-4">
          {'" '}
          {typeof request === 'undefined' ? '' : request.text}
          {' "'}
        </p>

        {show && (
          <div className="mt-4 mb-4">
            <InlineShareButtons
              config={{
                alignment: 'center', // alignment of buttons (left, center, right)
                color: 'social', // set the color of buttons (social, white)
                enabled: true, // show/hide buttons (true, false)
                font_size: 16, // font size for the buttons
                language: 'en', // which language to use (see LANGUAGES)
                networks: [
                  // which networks to include (see SHARING NETWORKS)
                  'whatsapp',
                  'linkedin',
                  'messenger',
                  'facebook',
                  'twitter'
                ],
                padding: 12, // padding within buttons (INTEGER)
                radius: 25, // the corner radius on each button (INTEGER)
                show_total: true,
                size: 40, // the size of each button (INTEGER)

                // OPTIONAL PARAMETERS
                url: window.location.href,
                image: 'https://bit.ly/2CMhCMC',
                description: 'IWANTII', // (defaults to og:description or twitter:description)
                title: 'IWANTII', // (defaults to og:title or twitter:title)
                message: 'IWANTII', // (only for email sharing)
                subject: 'IWANTII', // (only for email sharing)
                username: 'IWANTII' // (only for twitter sharing)
              }}
            />
          </div>
        )}

        {/* request like/dislike */}
        {isDone ? (
          <div className="align-items-center pb-4">
            <ul className="list-unstyled mb-0 ms-3">
              <li className="list-inline-item likes">
                <Link
                  to="#"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      likeType: LIKE,
                      targetType: 1,
                      dialogVisible: true
                    });
                  }}
                  className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                >
                  <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss" />
                  Request Like {request.likes}
                </Link>
              </li>
              <li className="list-inline-item likes">
                <Link
                  to="#"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      likeType: DISLIKE,
                      targetType: 1,
                      dialogVisible: true
                    });
                  }}
                  className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                >
                  <i className="feather-thumbs-down text-white bg-red-gradiant me-2 btn-round-xs font-xss" />
                  Request Dislike {request.dislikes}
                </Link>
              </li>
              <li className="list-inline-item likes m-0">
                <Link
                  to="#"
                  onClick={e => {
                    e.preventDefault();
                    this.props.onNewRequestComment(request._id);
                  }}
                  className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                >
                  <i className="feather-message-circle text-dark text-grey-900 btn-round-xs font-xs" />
                  Request Comment {request.comments}
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          ''
        )}
        {/* Share buttons */}

        <Button
          onClick={() =>
            this.setState(prevState => ({
              ...prevState,
              show: !prevState.show
            }))
          }
          variant="contained"
          style={{ backgroundColor: '#95d03a', color: '#fff' }}
          startIcon={<ShareIcon />}
        >
          Share
        </Button>

        <SubscribeDialog
          visible={dialogVisible}
          onClose={() => {
            this.setState({
              dialogVisible: false
            });
          }}
          onSubmit={this.likeWinner}
        />
      </React.Fragment>
    );
  }
}
