import React from 'react';
import axios from "axios";

const initialState = {
  index: 4,
  steps: 0,
  email: '',
  message: ''
}

const displayXY = [[1, 1], [2, 1], [3, 1],
                   [1, 2], [2, 2], [3, 2],
                   [1, 3], [2, 3], [3, 3]]

const indexGrid = [[0, 1, 2],
                   [3, 4, 5],
                   [6, 7, 8]]

export default class AppClass extends React.Component {

  state = initialState;

  getX = index => {
    return displayXY[index][0];
  }

  getY = index => {
    return displayXY[index][1];
  }

  getXYmessage = index => {
    const x = this.getX(index);
    const y = this.getY(index);
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    this.setState(initialState)    
  }

  getYX = index => {
    for(let y = 0; y < 3; y++){
      for(let x = 0; x < 3; x++){
        if(indexGrid[y][x] === index){
          return [y, x];
        }
      }
    }
  }

  getNextIndex = (direction) => {
    const current = this.getYX(this.state.index);
    const next = direction.map((each, index) => each + current[index]);

    if(next[0] === -1){
      return [indexGrid[current[0]][current[1]], "You can't go up"];

    } else if(next[0] === 3){
        return [indexGrid[current[0]][current[1]], "You can't go down"];

    } else if(next[1] === -1){
        return [indexGrid[current[0]][current[1]], "You can't go left"];

    } else if(next[1] === 3){
        return [indexGrid[current[0]][current[1]], "You can't go right"];

    } else {
        return [indexGrid[next[0]][next[1]], ""];
    }

  }

  move = (direction) => {
    const [index, error] = this.getNextIndex(direction);
    
    if(error){
      this.setState({
        ...this.state,
        message: error
      })
    } else {
      this.setState({
        ...this.state,
        index,
        steps: this.state.steps + 1,
        message: ''
      })
    }
  }

  onChange = event => {
    this.setState({
      ...this.state,
      email: event.target.value
    })
  }


  onSubmit = event => {
    event.preventDefault();

    const payload = {
      "x": this.getX(this.state.index),
      "y": this.getY(this.state.index),
      "steps": this.state.steps,
      "email": this.state.email.trim()
    }

    axios.post("http://localhost:9000/api/result", payload)
      .then(res => {
        this.setState({
          ...this.state,
          email: '',
          message: res.data.message
        })
      })
      .catch(err => {
        this.setState({
          ...this.state,
          message: err.response.data.message
      })
    })
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYmessage(this.state.index)}</h3>
          <h3 id="steps">You moved {this.state.steps} time{this.state.steps === 1 ? '' : "s"}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move([0, -1])}>LEFT</button>
          <button id="up" onClick={() => this.move([-1, 0])}>UP</button>
          <button id="right" onClick={() => this.move([0, 1])}>RIGHT</button>
          <button id="down" onClick={() => this.move([1, 0])}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
