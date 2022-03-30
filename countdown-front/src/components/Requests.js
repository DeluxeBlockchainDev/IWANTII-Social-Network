import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCountryName } from './../helpers/Country';
import SubscribeDialog from './../components/SubscribeDialog';
import { LIKE, DISLIKE, REQUESTS } from './../api/uri';
import { httpRequest, getUserId, notify } from './../helpers/HttpHandler';

class Requests extends Component {
  constructor() {
    super();
    this.state = {
      reqeusts: [],
      title: '',
      dialogVisible: false,
      likeType: LIKE,
      current: {}
    };

    this.likeRequest = this.likeRequest.bind(this);
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.setState({
        reqeusts: this.props.requests,
        title: this.props.title
      });
    }
  }

  async likeRequest() {
    // get user id
    let userId = await getUserId();
    let res = await httpRequest(
      `${REQUESTS}/${this.state.current._id}${this.state.likeType}`,
      'PUT',
      { user: userId }
    );
    if (res.success) {
      this.props.onUpdated();
    }
    notify(res);
  }

  render() {
    const { reqeusts, title, dialogVisible } = this.state;
    return (
      <div className="card w-100 shadow-xss rounded-xxl mb-3">
        <div className="card-body d-flex align-items-center p-4">
          <h4 className="fw-700 mb-0 font-xssss text-grey-900">{title}</h4>
        </div>
        {reqeusts.map((value, index) => (
          <div className="wrap" key={index}>
            <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
              <h4 className="fw-700 text-grey-900 font-xssss mt-1">
                {value.user.name}{' '}
                <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                  {getCountryName(value.user.country)}
                  <i
                    className={`flag-icon flag-icon-${value.user.country.toLocaleLowerCase()}`}
                  />
                </span>
              </h4>
            </div>
            <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
              <h4 className="fw-600 text-grey-900 font-xssss mt-1 fs-italic pl-1">
                " {value.text} "
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
                LIkes {value.likes}
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
                to={`/countdown/${value.countdown}`}
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
          onSubmit={this.likeRequest}
        />
      </div>
    );
  }
}

export default Requests;
