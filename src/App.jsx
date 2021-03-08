import React from 'react';
import p5 from 'p5';
import axios from 'axios';
import Graph from './scripts/graph';
import { config } from './scripts/config';
import './index.css';

// const toStr = (key) => String.fromCharCode((key >= 96 && key <= 105) ? key - 48 : key);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.Sketch = this.Sketch.bind(this);
    this.state = {
      users: [],
      g: null,
      text: '',
    };
  }

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current); // eslint-disable-line
    axios.get(`${config.SERVER_URI}/users.json`).then((response) => {
      this.setState({ users: response.data });
    });

    document.body.addEventListener('keydown', this.handleKey.bind(this));
  }

  handleKey(e) {
    this.setState(
      ({ text }) => ({ text: `${text}${e.key}` }),
      () => {
        const { text } = this.state;
        console.clear();
        console.log(`%c${text}`, 'font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) ,  12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)');
      },
    );
  }

  Sketch(p) {
    p.setup = () => {
      p.frameRate(30);
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      this.setState({ g: new Graph(20, p.windowWidth, p.windowHeight) });
    };
    p.draw = () => {
      const { g } = this.state;
      p.background(20);
      if (g) g.run(p);
    };
  }

  render() {
    const { users } = this.state;
    console.log(users);
    return (
      <div>
        <div ref={this.myRef}> </div>
        <ul className="users">
          {users && users.map((user) => (
            <li className="user">
              <p>
                <strong>Name:</strong>
                {user.name}
              </p>
              <p>
                <strong>Email:</strong>
                {user.email}
              </p>
              <p>
                <strong>City:</strong>
                {user.address.city}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
