import React, { Component } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { getCountryName } from '../helpers/Country';
import SubscribeDialog from './../components/SubscribeDialog';
import { LIKE, DISLIKE, USERS, REQUESTS, PARAM_USER } from './../api/uri';
import { httpRequest, getUserId, notify } from './../helpers/HttpHandler';
import history from './../helpers/history';

class UserList extends Component {
  constructor() {
    super();
    this.state = {
      dialogVisible: false,
      likeType: LIKE,
      currentUser: {}
    };

    this.likeUser = this.likeUser.bind(this);
    this.goCountdown = this.goCountdown.bind(this);
  }

  /**
   * like/dislike user
   */
  async likeUser() {
    // get user id
    let userId = await getUserId();
    let res = await httpRequest(
      `${USERS}/${this.state.currentUser._id}${this.state.likeType}`,
      'PUT',
      { user: userId }
    );
    if (res.success) {
      this.props.onUpdated();
    }
    notify(res);
  }

  /**
   * go to countdown which selected user joined in
   */
  async goCountdown(userId) {
    let reqRes = await httpRequest(
      `${REQUESTS}?${PARAM_USER}=${userId}`,
      'GET'
    );
    if (reqRes.success && reqRes.data.length > 0) {
      let countdownId = reqRes.data[0].countdown;
      history.push(`/countdown/${countdownId}`);
    }
  }

  render() {
    const { users, title } = this.props;
    const { dialogVisible } = this.state;
    return (
      <div className="card w-100 shadow-xss rounded-xxl mb-3">
        <div className="card-body d-flex align-items-center p-4">
          <h4 className="fw-700 mb-0 font-xssss text-grey-900">{title}</h4>
        </div>
        {users.map((value, index) => (
          <div className="wrap" key={index}>
            <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
              <h4 className="fw-700 text-grey-900 font-xssss mt-1">
                {value.name}{' '}
                <i
                  className={`flag-icon flag-icon-${value.country.toLocaleLowerCase()}`}
                />
                <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                  {getCountryName(value.country)}
                </span>
              </h4>
            </div>
            <div className="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4 text-right">
              <Link
                to="#"
                className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    likeType: LIKE,
                    dialogVisible: true,
                    currentUser: value
                  });
                }}
              >
                <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss" />
                Likes {value.likes}
              </Link>
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    likeType: DISLIKE,
                    dialogVisible: true,
                    currentUser: value
                  });
                }}
                className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
              >
                <i className="feather-thumbs-down text-white bg-red-gradiant me-2 btn-round-xs font-xss" />
                Dislikes {value.dislikes}
              </Link>
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault();
                  this.goCountdown(value._id);
                }}
                className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
              >
                <i className="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg" />
                Comments {value.comments}
              </Link>
            </div>
          </div>
        ))}
        <SubscribeDialog
          visible={dialogVisible}
          onClose={() => {
            this.setState({
              dialogVisible: false
            });
          }}
          onSubmit={this.likeUser}
        />
      </div>
    );
  }
}

export default UserList;
