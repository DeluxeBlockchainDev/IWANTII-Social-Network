import React, { Component } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import history from './../helpers/history';
import SubscribeDialog from './../components/SubscribeDialog';
import { LIKE, DISLIKE, COUNTDOWNS } from './../api/uri';
import { httpRequest, getUserId, notify } from './../helpers/HttpHandler';

class CountdownList extends Component {
  constructor() {
    super();
    this.state = {
      dialogVisible: false,
      likeType: LIKE,
      current: {}
    };

    this.likeCountdown = this.likeCountdown.bind(this);
  }

  async likeCountdown() {
    // get user id
    let userId = await getUserId();
    let res = await httpRequest(
      `${COUNTDOWNS}/${this.state.current._id}${this.state.likeType}`,
      'PUT',
      { user: userId }
    );
    if (res.success) {
      this.props.onUpdated();
    }
    notify(res);
  }

  render() {
    const { dialogVisible } = this.state;
    const { countdowns, title } = this.props;
    return (
      <div className="card w-100 shadow-xss rounded-xxl mb-3">
        <div className="card-body d-flex align-items-center p-4">
          <h4 className="fw-700 mb-0 font-xssss text-grey-900">{title}</h4>
        </div>
        {countdowns.map((value, index) => (
          <div className="wrap" key={index}>
            <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
              <h4
                className="fw-700 text-grey-900 font-xssss mt-1 pointer"
                onClick={() => {
                  history.push(`/countdown/${value._id}`);
                }}
              >
                {value.name}{' '}
              </h4>
            </div>
            <div className="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4 text-right">
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    likeType: LIKE,
                    dialogVisible: true,
                    current: value
                  });
                }}
                className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
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
                    current: value
                  });
                }}
                className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
              >
                <i className="feather-thumbs-down text-white bg-red-gradiant me-2 btn-round-xs font-xss" />
                Dislikes {value.dislikes}
              </Link>
              <Link
                to={`/countdown/${value._id}`}
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
          onSubmit={this.likeCountdown}
        />
      </div>
    );
  }
}

export default CountdownList;
