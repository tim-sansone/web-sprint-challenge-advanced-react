import React from 'react';
import axios from "axios";


const initialState = {
  xy: [2, 2],
  steps: 0,
  email: '',
  message: ''
}

// posible moves
const up = [0, -1];
const down = [0, 1];
const left = [-1, 0];
const right = [1, 0];

// matrix of indicies for getting index from xy 
const indicies = [[0, 1, 2],
                   [3, 4, 5],
                   [6, 7, 8]]


export default class AppClass extends React.Component {

  state = initialState;

  reset = () => {
    this.setState(initialState)    
  }

  getIndex = () => {
    const { xy } = this.state;
    return indicies[xy[1] - 1][xy[0] - 1];
  }

  // determines new index based on move received from direction buttons
  // returns an error message if attempting to go out of bounds or the new xy
  getNextXY = (move) => {
  
    const next = move.map((each, index) => each + this.state.xy[index]);
    
    if(next[0] === 0){
      return [null, "You can't go left"];

    } else if(next[0] === 4){
        return [null, "You can't go right"];

    } else if(next[1] === 0){
        return [null, "You can't go up"];

    } else if(next[1] === 4){
        return [null, "You can't go down"];

    } else {
        return [next, ''];
    }

  }

  // calls getNextIndex to receive a new index or an error
  // sets state accordingly
  move = (move) => {
    const [next, error] = this.getNextXY(move);

    if(error){
      this.setState({
        ...this.state,
        message: error
      })
    } else {
      this.setState({
        ...this.state,
        xy: next,
        steps: this.state.steps + 1,
        message: ''
      })
    }
  }


  // handle email type input
  onChange = event => {
    this.setState({
      ...this.state,
      email: event.target.value
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
          <button id="left" onClick={() => this.move(left)}>LEFT</button>
          <button id="up" onClick={() => this.move(up)}>UP</button>
          <button id="right" onClick={() => this.move(right)}>RIGHT</button>
          <button id="down" onClick={() => this.move(down)}>DOWN</button>
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
