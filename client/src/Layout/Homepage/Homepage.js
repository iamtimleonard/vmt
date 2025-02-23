import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classes from './homepage.css';
import Button from '../../Components/UI/Button/Button';
import Background from '../../Components/Background/Background';
import Aux from '../../Components/HOC/Auxil';

class Homepage extends PureComponent {
  state = {
    error: null,
    pageLocation: '',
  };

  containerRef = React.createRef();

  componentDidMount() {
    const { location } = this.props;
    this.setState({ pageLocation: this.determineDep() });
    if (location.state && location.state.error) {
      this.setState({ error: location.state.error });
      this.timer = setTimeout(() => {
        this.setState({ error: null });
      }, 2000);
    }
  }

  componentDidUpdate(prevProps) {
    const { rooms, history } = this.props;
    // If the user creates a temporary room // redirect them once its been created
    if (Object.keys(prevProps.rooms).length < Object.keys(rooms).length) {
      const currentRooms = Object.keys(rooms).map((id) => rooms[id]);
      const prevRooms = Object.keys(prevProps.rooms).map(
        (id) => prevProps.rooms[id]
      );
      const room = currentRooms.filter((rm) => !prevRooms.includes(rm));
      if (room[0]._id && rooms[room[0]._id].tempRoom) {
        // THIS IS HACKY
        history.push(`myVMT/explore/${room[0]._id}`);
      }
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  determineDep = () => {
    const url = window.location.href;
    if (url.split('.')[0] === 'https://vmt-test') {
      return 'staging';
    }
    if (process.env.NODE_ENV === 'development') {
      return 'development';
    }
    return 'production';
  };

  createRoom = () => {
    const { user, createRoom } = this.props;
    const room = {
      name: 'temp room',
      tempRoom: true,
      creator: user._id || null,
    };
    if (user._id) {
      room.members = [{ user: user._id, role: 'facilitator' }];
    }
    createRoom(room);
  };

  scrollToDomRef = () => {
    window.scroll({
      top: this.containerRef.current.offsetTop - 100,
      left: 0,
      behavior: 'smooth',
    });
  };

  render() {
    const { error, pageLocation } = this.state;
    // hoisting for easy access to update @TIMESTAMP and for @todo later streamlining
    const dateStamp = <p>Last updated: 04.16.2021</p>;

    return (
      <Aux>
        <Background bottomSpace={null} />
        <div className={classes.Main}>
          <section className={classes.Top}>
            {error ? <div className={classes.Error}>{error}</div> : null}
            <p className={classes.Blurb}>
              Collaborative Workspaces for Exploring the World of Math
            </p>
            <div className={classes.WorkspaceButton}>
              <Button theme="Big" click={this.createRoom} m={35}>
                Try out a Workspace
              </Button>
            </div>
          </section>
          <section>
            {dateStamp}
            <br />
            <p>
              If you encounter bugs or want to suggest new features please email
              us at{' '}
              <a
                className={classes.Link}
                href="mailto:vmt@21pstem.org?subject=%5BVMT%20Feedback%5D&body=Thank%20you%20for%20taking%20the%20time%20to%20help%20improve%20VMT!%20Please%20add%20the%20following%20information%20so%20that%20we%20can%20address%20your%20request-%0D%0A%0D%0AType%20of%20Request%20(Bug%2C%20Feature%2C%20Feedback%2C%20Question)%3A%0D%0ADescription%20or%20steps%20to%20reproduce%3A%0D%0ATime%20of%20issue%3A%0D%0AWeb%20browser%3A%0D%0ASite%20specific%20URL%3A"
              >
                vmt@21pstem.org
              </a>
              .{' '}
            </p>
            <br />
            <p>
              VMT is{' '}
              <a
                className={classes.Link}
                href="https://github.com/mathematicalthinking/vmt"
              >
                open source
              </a>{' '}
              and currently in Alpha - You are viewing this application in{' '}
              <b>{pageLocation}</b> mode.{' '}
            </p>
          </section>
          <section className={classes.Options} ref={this.containerRef} />
        </div>
      </Aux>
    );
  }
}

Homepage.propTypes = {
  user: PropTypes.shape({}),
  location: PropTypes.shape({}),
  history: PropTypes.shape({}).isRequired,
  createRoom: PropTypes.func.isRequired,
  rooms: PropTypes.shape({}),
};

Homepage.defaultProps = {
  user: null,
  rooms: null,
  location: null,
};

export default Homepage;
