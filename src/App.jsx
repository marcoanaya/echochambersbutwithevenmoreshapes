import React from 'react';
import P5 from 'p5';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import firebaseConfig from './credentials';
import Graph from './sketch/Graph';
import './index.css';
import ConsoleLogger from './classes/ConsoleLogger';
import UserInfo from './classes/UserInfo';

class App extends React.Component {
  myRef = React.createRef();

  state = {
    logger: new ConsoleLogger(),
    userInfo: new UserInfo(),
    doCheck: false,
    leaderBoard: [],
  }

  componentDidMount() {
    const myP5 = new P5(this.Sketch, this.myRef.current); // eslint-disable-line
    document.body.addEventListener('keydown', this.handleKey);
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app();
    }
    firebase.auth().signInAnonymously().then(() => {
      const { userInfo } = this.state;
      const user = firebase.auth().currentUser;
      const newUserInfo = userInfo.add(user);
      this.setState({
        userInfo: newUserInfo,
      }, () => this.readUser(user));
    }).then(this.readLeaderBoard);
  }

  handleKey = ({ key }) => {
    const { logger, userInfo, leaderBoard } = this.state;
    const { newLogger, doCheck, attrs } = logger.update(key, userInfo, leaderBoard);
    this.setState({
      logger: newLogger,
      doCheck: doCheck === true,
      userInfo: userInfo.add(attrs),
    }, this.writeUser);
  };

  Sketch = (p) => {
    const { userInfo: { params } } = this.state;
    let graph;
    p.setup = () => {
      p.frameRate(30);
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      graph = new Graph(20, p.windowWidth, p.windowHeight, params);
    };
    p.draw = () => {
      const { userInfo: { shape, params: parms } } = this.state;
      p.background(20);
      if (graph) {
        if (shape) graph.addUser(p.windowWidth, p.windowHeight, shape);
        graph.run(p, parms);
      }
    };
  };

  writeUser = () => {
    const { doCheck, userInfo } = this.state;
    if (doCheck) {
      const { uid, ...rest } = userInfo;
      firebase.database()
        .ref('users')
        .child(uid)
        .set({ ...rest });
      this.setState({ doCheck: false }, this.readLeaderBoard());
    }
  }

  readUser = ({ uid }) => {
    const { logger, userInfo } = this.state;

    firebase.database()
      .ref('users')
      .child(uid)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          // logger.display(snapshot.val(), leaderBoard);
          this.setState({
            userInfo: userInfo.add(snapshot.val()),
            logger: logger.changePos('back'),
          });
        } else {
          // logger.display(userInfo, leaderBoard);
          // this.setState({ logger: logger })
        }
      });
  }

  readLeaderBoard = () => {
    firebase.database()
      .ref('users')
      .orderByChild('score')
      .endAt(1000)
      .limitToLast(10)
      .once('value', (snapshot) => {
        const leaderBoard = Object.values(snapshot.val())
          .map(({ name, score, shape: { c } }) => ({ name, score, c }))
          .sort(({ score: a }, { score: b }) => b - a);
        this.setState({ leaderBoard }, () => {
          const { logger, userInfo } = this.state;
          logger.display(userInfo, leaderBoard);
        });
      });
  }

  render() {
    // console.log(logger);
    return (
      <div>
        <div ref={this.myRef}> </div>
      </div>
    );
  }
}

export default App;
