import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

class Comment extends Component {
  render() {
    return (
      <React.Fragment>
        <Card className="border-0 mt-3">
          <CardBody>
            <h5 className="card-title mb-0">{this.props.title} :</h5>
            <ul className="media-list list-unstyled mb-0">
              {this.props.comments.map((comment, key) => (
                <li key={key} className="mt-4">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="commentor-detail">
                        <h6 className="mb-0">
                          <Link
                            to="#"
                            className="text-dark media-heading  card-username"
                          >
                            {comment.user}
                          </Link>
                        </h6>
                        <span className="text-muted">
                          {moment(comment.createdAt).format(
                            'DD/MM/YYYY HH:mm:ss'
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                      >
                        <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss" />
                        {comment.likes} Likes
                      </Link>
                      <Link
                        to="#"
                        className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                      >
                        <i className="feather-thumbs-down text-white bg-red-gradiant me-2 btn-round-xs font-xss" />
                        {comment.dislikes} Dislikes
                      </Link>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-muted fst-italic p-3 bg-light rounded para">
                      " {comment.text} "
                    </p>
                  </div>
                  {comment.replies ? (
                    <ul className="list-unstyled ps-4 ps-md-5 sub-comment">
                      {comment.replies.map((reply, key) => (
                        <li key={key} className="mt-4">
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                              <Link className="pe-3" to="#">
                                <img
                                  src={reply.image}
                                  className="img-fluid avatar avatar-md-sm rounded-circle shadow"
                                  alt="comment"
                                />
                              </Link>
                              <div className="commentor-detail">
                                <h6 className="mb-0">
                                  <Link
                                    to="#"
                                    className="text-dark media-heading"
                                  >
                                    {reply.name}
                                  </Link>
                                </h6>
                                <small className="text-muted">
                                  {reply.date} at {reply.time}
                                </small>
                              </div>
                            </div>
                            <Link to="#" className="text-muted">
                              <i className="mdi mdi-reply" /> Reply
                            </Link>
                          </div>
                          <div className="mt-3">
                            <p className="text-muted fst-italic p-3 bg-light rounded">
                              " {reply.desc} "
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default Comment;
