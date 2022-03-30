import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Switch from '@material-ui/core/Switch';
import Hourglass from '@material-ui/icons/Timer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarText
} from 'reactstrap';
/* import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close'; */
import Darkbutton from '../components/Darkbutton';
import setPendingStatusAction from './../store/action/modeAction';
import setSimpleModeAction from './../store/action/modeAction';
import { httpRequest } from './../helpers/HttpHandler';
import { COUNTDOWNS, CURRENT } from './../api/uri';
import history from './../helpers/history';

class Header extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isActive: false,
      isNoti: false,
      pendingStatus: true,
      pendingText: 'Pending',
      hideAlert: false
    };

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isPending !== this.props.isPending) {
      this.setState({
        pendingStatus: this.props.isPending
      });
    }
  }

  async goLiveCountdown() {
    // get current countdown in progress
    let countdownRes = await httpRequest(`${COUNTDOWNS}${CURRENT}`, 'GET');
    if (countdownRes.success) {
      history.push(`/countdown/${countdownRes.data._id}`);
    }
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
  toggleActive = () => this.setState({ isActive: !this.state.isActive });
  toggleisNoti = () => this.setState({ isNoti: !this.state.isNoti });

  render() {
    const { setSimpleMode, isSimpleMode } = this.props;
    const { pendingStatus, pendingText, isOpen } = this.state;

    return (
      <div>
        <Navbar className="nav-header" bg="dark" expand="md" light>
          <NavbarBrand href="/">
            <i className="feather-zap text-success display2-size ms-3 me-1" />
            <span className="pe-2 d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">
              IWANTII
            </span>
          </NavbarBrand>
          <NavbarToggler className="me-3" onClick={this.toggleOpen} />
          <Collapse isOpen={isOpen} navbar>
            <Nav>
              <NavItem>
                <FormControlLabel
                  onClick={() => {
                    this.goLiveCountdown();
                    this.setState({
                      isOpen: false
                    });
                  }}
                  control={
                    <Hourglass
                      className={`p-2 text-center ms-auto ft-55 text-danger`}
                    />
                  }
                  label="Live Countdown"
                />
              </NavItem>
            </Nav>
            {isOpen ? (
              ''
            ) : (
              <Nav className="m-auto" navbar>
                <NavbarText className="pt-2">
                  {pendingStatus ? (
                    <span className="text-warning font-lg m-auto menu-icon">
                      {pendingText}
                    </span>
                  ) : (
                    ''
                  )}
                </NavbarText>
              </Nav>
            )}
            <Nav>
              <NavItem className={isOpen ? 'full-width' : 'pt-2'}>
                {' '}
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSimpleMode}
                      onChange={e => {
                        setSimpleMode(e.target.checked);
                        this.setState({
                          isOpen: false
                        });
                      }}
                    />
                  }
                  label="Simple Mode"
                />
              </NavItem>
              <NavItem className={isOpen ? 'pt-2 full-width' : 'pt-1'}>
                <Darkbutton />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        {/* {pendingStatus && !hideAlert ? (
          <Alert
            severity="warning"
            className="pending-alert"
            action={
              <CloseIcon
                onClick={() => {
                  this.setState({
                    hideAlert: true
                  });
                }}
                fontSize="inherit"
              />
            }
          >
            <span className="font-xm m-auto">{pendingText}</span>
          </Alert>
        ) : (
          ''
        )} */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
  isPending: state.getIn(['statusReducer', 'pending']),
  isSimpleMode: state.getIn(['modeReducer', 'simpleMode'])
});

const mapDispatchToProps = dispatch => ({
  setPendingStatus: bindActionCreators(setPendingStatusAction, dispatch),
  setSimpleMode: bindActionCreators(setSimpleModeAction, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
