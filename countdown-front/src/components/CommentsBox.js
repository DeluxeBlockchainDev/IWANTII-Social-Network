import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import CountdownComments from './CommentCountdown';
import RequestsComments from './CommentRequest';
import UserComments from './CommentUser';

class CommentsBox extends Component {
  constructor() {
    super();
    this.state = {
      countdownComments: [],
      userComments: [],
      requestComments: [],
      requests: [],
      disqusShow: false,
      facebookShow: false,
      currentCountdownId: '',
      showRequest: false,
      winner: { _id: '', name: '' },
      winnerRequest: { _id: '', text: '' }
    };
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.setState({
        countdownComments: this.props.countdownComments,
        userComments: this.props.userComments,
        requestComments: this.props.requestComments,
        requests: this.props.requests,
        currentCountdownId: this.props.id,
        winner: this.props.winner,
        winnerRequest: this.props.winnerRequest
      });
    }
  }

  render() {
    const {
      countdownComments,
      requestComments,
      requests,
      userComments,
      winner,
      winnerRequest,
      currentCountdownId
    } = this.state;

    return (
      <React.Fragment>
        <Card className="border-0">
          <CardBody className="p-2">
            {/* countdown comments */}
            <CountdownComments
              countdowns={countdownComments}
              id={currentCountdownId}
              onSave={this.props.onSave}
              onUpdated={this.props.onUpdated}
            />

            {/* user comments */}
            <UserComments
              comments={userComments}
              requests={requests}
              id={winner._id}
              onSave={this.props.onSave}
              onUpdated={this.props.onUpdated}
            />

            {/* request comments */}
            <RequestsComments
              comments={requestComments}
              requests={requests}
              id={winnerRequest._id}
              onSave={this.props.onSave}
              onUpdated={this.props.onUpdated}
            />
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default CommentsBox;
