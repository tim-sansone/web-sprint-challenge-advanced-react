import React from 'react';
import axios from "axios";


const initialState = {
  xy: [2, 2],
  steps: 0,
  email: '',
  message: ''
}

// posible moves
const moveUp = [0, -1];
const moveDown = [0, 1];
const moveLeft = [-1, 0];
const moveRight = [1, 0];

// matrix of indicies for getting index from xy 
const indicies = [[0, 1, 2],
                   [3, 4, 5],
                   [6, 7, 8]]


export default class AppClass extends React.Component {

  state = initialState;

  getIndex = () => {
    const { xy } = this.state;
    return indicies[xy[1] - 1][xy[0] - 1];
  }

  // handle email type input
  onChange = event => {
    this.setState({
      ...this.state,
      email: event.target.value
    })
  }

  // determines new xy based on move received from direction buttons
  // returns the new xy and an error message if attempting to go out of bounds
  getNewXY = (move) => {
    
    const { xy } = this.state;
    const newXY = move.map((each, index) => each + xy[index]);
    
    if(newXY[0] === 0){
      return [xy, "You can't go left"];

    } else if(newXY[0] === 4){
        return [xy, "You can't go right"];

    } else if(newXY[1] === 0){
        return [xy, "You can't go up"];

    } else if(newXY[1] === 4){
        return [xy, "You can't go down"];

    } else {
        return [newXY, ''];
    }

  }

  // calls getNewXY to receive a new xy and message
  // sets state accordingly
  move = (move) => {
    const [xy, message] = this.getNewXY(move);
    const { steps } = this.state;

    this.setState({
      ...this.state,
      steps: message ? steps : steps + 1,
      xy,
      message
    })
  }

  // create payload object gathing x,y coordinates, steps from state, and email from state
  // post payload to API, set response message (either success or error) to state
  onSubmit = event => {
    event.preventDefault();

    const payload = {
      x: this.state.xy[0],
      y: this.state.xy[1],
      steps: this.state.steps,
      email: this.state.email.trim()
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
          <h3 id="coordinates">Coordinates ({this.state.xy[0]}, {this.state.xy[1]})</h3>
          <h3 id="steps">You moved {this.state.steps} time{this.state.steps === 1 ? '' : "s"}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.getIndex() ? ' active' : ''}`}>
                {idx === this.getIndex() ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move(moveLeft)}>LEFT</button>
          <button id="up" onClick={() => this.move(moveUp)}>UP</button>
          <button id="right" onClick={() => this.move(moveRight)}>RIGHT</button>
          <button id="down" onClick={() => this.move(moveDown)}>DOWN</button>
          <button id="reset" onClick={() => this.setState(initialState)}>reset</button>
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
