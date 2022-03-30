import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import { getCountryName } from './../helpers/Country';
import SubscribeDialog from './../components/SubscribeDialog';
import { LIKE, DISLIKE, USERS } from './../api/uri';
import { httpRequest, getUserId, notify } from './../helpers/HttpHandler';

class LiveUsers extends Component {
  constructor() {
    super();
    this.state = {
      reqeusts: [],
      title: '',
      page: 1,
      pageSize: 5,
      isDone: false,
      showRequest: false,
      dialogVisible: false,
      likeType: LIKE,
      currentUser: {}
    };

    this.toogleRequestVisible = this.toogleRequestVisible.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.likeUser = this.likeUser.bind(this);
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.setState({
        reqeusts: this.props.requests,
        title: this.props.title
      });
    }
  }

  toogleRequestVisible() {
    this.setState({
      showRequest: !this.state.showRequest
    });
  }

  handlePageChange(event, value) {
    this.setState({
      page: value
    });
  }

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

  render() {
    const {
      reqeusts,
      title,
      showRequest,
      page,
      pageSize,
      dialogVisible
    } = this.state;
    const { simpleMode } = this.props;
    return (
      <div className="card w-100 shadow-xss rounded-xxl mb-3">
        <div className="card-body d-flex align-items-center p-4">
          <h4 className="fw-700 mb-0 font-xssss text-grey-900">{title}</h4>
          <Link
            to="#"
            className="fw-600 ms-auto font-xssss text-primary"
            onClick={this.toogleRequestVisible}
          >
            {showRequest ? 'Hide Request' : 'Show Request'}
          </Link>
        </div>
        {reqeusts
          .slice((page - 1) * pageSize, page * pageSize)
          .map((value, index) => (
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
                  {showRequest ? `" ${value.text} "` : ''}
                </h4>
              </div>
              <div
                className={
                  simpleMode
                    ? 'card-body d-flex align-items-center pt-0  pb-3 ps-4 text-right'
                    : 'card-body d-flex align-items-center pt-0  ps-4 text-right pb-0'
                }
              >
                <Link
                  to="#"
                  className="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      likeType: LIKE,
                      dialogVisible: true,
                      currentUser: value.user
                    });
                  }}
                >
                  <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss" />
                  Likes {value.user.likes}
                </Link>
                <Link
                  to="#"
                  className="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      likeType: DISLIKE,
                      dialogVisible: true,
                      currentUser: value.user
                    });
                  }}
                >
                  <i className="feather-thumbs-down text-white bg-red-gradiant me-2 btn-round-xs font-xss" />
                  Dislikes {value.user.dislikes}
                </Link>
                <Link
                  to="#"
                  className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  onClick={e => {
                    e.preventDefault();
                    this.props.onNewComment(value.user._id);
                  }}
                >
                  <i className="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg" />
                  Comments {value.user.comments}
                </Link>
                {simpleMode ? (
                  <Fragment>
                    <Link
                      to="#"
                      className="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                    >
                      <i className="feather-copy text-dark text-grey-900 btn-round-sm font-xs" />
                      Same Requests {value.user.sameRequest}
                    </Link>
                    <Link
                      to="#"
                      className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                    >
                      <i className="feather-link text-dark text-grey-900 btn-round-sm font-xs" />
                      Same Links {value.user.sameLinks}
                    </Link>
                  </Fragment>
                ) : (
                  ''
                )}
              </div>
              {simpleMode ? (
                ''
              ) : (
                <div className="card-body d-flex align-items-center pt-0 pb-3 text-right">
                  <Link
                    to="#"
                    className="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  >
                    <i className="feather-copy text-dark text-grey-900 btn-round-sm font-xs" />
                    Same Requests {value.user.sameRequest}
                  </Link>
                  <Link
                    to="#"
                    className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                  >
                    <i className="feather-link text-dark text-grey-900 btn-round-sm font-xs" />
                    Same Links {value.user.sameLinks}
                  </Link>
                </div>
              )}
            </div>
          ))}

        <div className="pagination-container">
          <Pagination
            count={Math.ceil(reqeusts.length / pageSize)}
            page={page}
            color="secondary"
            onChange={this.handlePageChange}
            showFirstButton
            showLastButton
          />
        </div>
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

export default LiveUsers;
