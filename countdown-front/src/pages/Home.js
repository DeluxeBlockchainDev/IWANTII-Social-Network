import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import HtmlParser from 'react-html-parser';
import history from '../helpers/history';
import { httpRequest } from '../helpers/HttpHandler';
import {
  SETTINGS,
  LANDING_PAGE,
  SEO,
  COUNTDOWNS,
  LAST,
  PARAM_COUNT,
  PARAM_COUNTDOWN,
  COMMENTS,
  REQUESTS,
  PARAM_USER,
  USERS,
  CURRENT
} from '../api/uri';

const CommentsBox = React.lazy(() => import('../components/Comment'));
const ctaImage = React.lazy(() =>
  import('../../public/assets/images/demo/cta.webp')
);
class Home extends Component {
  constructor() {
    super();
    this.state = {
      content: {
        title: '',
        description: '',
        howto: ''
      },
      countdown: {
        _id: '',
        likes: 0,
        dislikes: 0,
        createdAt: new Date(),
        comments: 0,
        users: 0
      },
      request: [
        {
          id: 1,
          user: '',
          time: '',
          likes: 0,
          dislikes: 0,
          text: ''
        }
      ]
    };
  }

  async componentDidMount() {
    // landing description
    this.fetchPageContent();
    // last countdown
    this.fetchCountdown();
    // set seo
    let res = await httpRequest(`${SETTINGS}${SEO}`, 'GET');
    if (res.success) {
      document.getElementsByTagName('title')[0].innerHTML = res.data.title;
      document.getElementsByName('keywords')[0].content = res.data.keywords;
      document.getElementsByName('description')[0].content =
        res.data.description;
    }
  }

  /**
   * jump to countdown page
   */
  async goCountdown() {
    // new countdown id
    let countdownId = '';
    // get last countdown in progress
    let countdownRes = await httpRequest(`${COUNTDOWNS}${CURRENT}`, 'GET');
    if (countdownRes.success) {
      countdownId = countdownRes.data._id;
      history.push(`/countdown/${countdownId}`);
    }
  }

  /**
   * get landing description in jumbtron
   */
  async fetchPageContent() {
    let res = await httpRequest(`${SETTINGS}${LANDING_PAGE}`, 'GET');
    if (res.success) {
      this.setState({
        content: res.data
      });
    }
  }

  /**
   * get the last countdown
   */
  async fetchCountdown() {
    let res = await httpRequest(`${COUNTDOWNS}${LAST}`, 'GET');
    if (res.success) {
      let countdown = res.data;
      countdown = {
        ...countdown,
        users: (await httpRequest(
          `${REQUESTS}?${PARAM_COUNT}&${PARAM_COUNTDOWN}=${countdown._id}`
        )).data,
        comments: (await httpRequest(
          `${COUNTDOWNS}/${countdown._id}${COMMENTS}?${PARAM_COUNT}`
        )).data
      };

      this.setState({
        countdown: countdown
      });

      // get winner's request
      this.fetchWinnerReqeust(countdown);
    }
  }

  /**
   * get winner's request
   * @param {String} countdown
   */
  async fetchWinnerReqeust(countdown) {
    let res = await httpRequest(`${COUNTDOWNS}/${countdown._id}`);
    if (res.success) {
      let requestRes = await httpRequest(
        `${REQUESTS}?${PARAM_COUNTDOWN}=${countdown._id}&${PARAM_USER}=${
          countdown.winner
        }`
      );
      if (requestRes.success && requestRes.data.length > 0) {
        let newRequest = requestRes.data[0];
        newRequest.user = (await httpRequest(
          `${USERS}/${newRequest.user}`
        )).data.name;

        this.setState({
          request: [newRequest]
        });
      }
    }
  }

  render() {
    const { request, content, countdown } = this.state;
    return (
      <div>
        {/* Start Header */}
        <div className="header-wrapper demo-style">
          <div className="container max-container">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-3 col-xs-6">
                <a href="/" className="logo">
                  <i className="feather-zap text-success display2-size me-3 ms-0" />
                  <span className="fredoka-font fw-600 text-current font-xxl logo-text mb-0">
                    IWANTII{' '}
                  </span>{' '}
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* End Header */}

        {/* Start Intro */}
        <div
          className="banner-wrapper vh-100 bscover demo-style"
          style={{
            backgroundImage: 'url("assets/images/demo/banner-bg.webp")'
          }}
        >
          <div className="banner-content">
            <div className="container max-container">
              <div className="align-items-center row">
                <div className="col-md-7">
                  <h2 className="title-text mb-5">
                    <b>{content.title}</b>
                  </h2>
                  <p className="para-desc">
                    {content.description.replaceAll
                      ? HtmlParser(
                          content.description.replaceAll('\n', '<br/>')
                        )
                      : ''}
                  </p>
                  <div className="clearfix" />
                  <button
                    onClick={this.goCountdown}
                    className="btn btn-lg btn-primary mr-4 text-uppercase mt-5 ft-20"
                  >
                    Getting Started
                  </button>
                </div>
                <div className="col-md-5">
                  <img src="assets/images/demo/Creativity-bro.svg" alt="hero" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Intro */}

        {/* Start HowTo */}
        <div className="section pb100 pt100 demo-style" id="demo">
          <div className="container-fluid max-container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 col-xl-4 text-center">
                <h2 className="title-text2 mb-4">
                  <b>How Does It Work</b>
                </h2>
                <Row className="w-100">
                  <Col className="m-auto" lg={8} md={8} sm="12">
                    <hr className="text-primary" />
                  </Col>
                </Row>
              </div>
              <div className="clearfix" />
            </div>
            <Container>
              <Row className="justify-content-center">
                <Col lg={3} md={6} xs={12}>
                  <div className="d-flex features pt-4 pb-4">
                    <div className="icon text-center rounded-circle text-primary me-3 mb-0">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="title">Live People Count</h4>
                      <p className="text-muted para mb-0">
                        {content.howto.split('\n')[0]}
                      </p>
                    </div>
                  </div>
                </Col>

                <Col lg={3} md={6} xs={12}>
                  <div className="d-flex features pt-4 pb-4">
                    <div className="icon text-center rounded-circle text-primary me-3 mb-0">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="title">Write Request</h4>
                      <p className="text-muted para mb-0">
                        {content.howto.split('\n')[1]}
                      </p>
                    </div>
                  </div>
                </Col>

                <Col lg={3} md={6} xs={12}>
                  <div className="d-flex features pt-4 pb-4">
                    <div className="icon text-center rounded-circle text-primary me-3 mb-0">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="title">Countdown</h4>
                      <p className="text-muted para mb-0">
                        {content.howto.split('\n')[2]}
                      </p>
                    </div>
                  </div>
                </Col>

                <Col lg={3} md={6} xs={12}>
                  <div className="d-flex features pt-4 pb-4">
                    <div className="icon text-center rounded-circle text-primary me-3 mb-0">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="title">Do As You Requested</h4>
                      <p className="text-muted para mb-0">
                        {content.howto.split('\n')[3]}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        {/* End Howto */}

        {/* Start LastCountdown */}
        <section className="section pt100 pb100 bg-light">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-4 text-center">
              <h2 className="title-text2 mb-4">
                <b>Latest Countdown</b>
              </h2>
            </div>
            <div className="clearfix" />
          </div>
          <Container>
            <Row className="justify-content-center">
              <Col xs={12}>
                <div
                  className="video-solution-cta position-relative"
                  style={{ zIndex: '1' }}
                >
                  <div
                    className="position-relative py-5 rounded"
                    style={{ background: `url(${ctaImage}) top` }}
                  >
                    <div
                      className="bg-overlay rounded bg-primary bg-gradient"
                      style={{ opacity: '0.8' }}
                    />
                    <div
                      id="countdown"
                      className="text-center position-relative"
                    >
                      <ul className="count-down list-unstyled">
                        <li
                          id="days"
                          className="count-number list-inline-item m-2"
                        >
                          {countdown.users}
                          <p className="count-head">Users</p>
                        </li>
                        <li
                          id="hours"
                          className="count-number list-inline-item m-2"
                        >
                          {countdown.likes}
                          <p className="count-head">Likes</p>
                        </li>
                        <li
                          id="mins"
                          className="count-number list-inline-item m-2"
                        >
                          {countdown.dislikes}
                          <p className="count-head">Dislikes</p>
                        </li>
                        <li
                          id="secs"
                          className="count-number list-inline-item m-2"
                        >
                          {countdown.comments}
                          <p className="count-head">Comments</p>
                        </li>
                        <li id="end" className="h1" />
                      </ul>
                    </div>
                  </div>
                  <div className="content mt-md-5 mt-4">
                    <CommentsBox
                      comments={request}
                      title="Winner"
                      disable={false}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <div className="feature-posts-placeholder bg-light" />
          </Container>
        </section>
        {/* End LastCountdown */}

        {/* Footer */}
        <div className="pt-4 pb-4 bg-black demo-style" id="contact">
          <Container>
            <Row className="justify-content-center">
              <Col sm="12">
                <p className="mb-0 text-white text-center title-footer">
                  © 2021 IWANTII. Develop by{' '}
                  <i className="mdi mdi-heart text-danger" />{' '}
                  <a
                    href="https://themesbrand.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-reset"
                  >
                    Ivy Nemesis, Israel
                  </a>
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default Home;
