import React, { useState } from 'react';
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


export default function AppFunctional({ className }) {
  
  const [state, setState] = useState(initialState)

  const getIndex = () => {
    const { xy } = state;
    return indicies[xy[1] - 1][xy[0] - 1];
  }

  // handle email type input
  const onChange = event => {
    setState({
      ...state,
      email: event.target.value
    })
  }

  // determines new xy based on move received from direction buttons
  // returns the new xy and an error message if attempting to go out of bounds
  const getNewXY = (move) => {
    
    const { xy } = state;
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
  const move = (move) => {
    const [xy, message] = getNewXY(move);

    setState({
      ...state,
      steps: message ? state.steps : state.steps + 1,
      xy,
      message
    })
  }

  // create payload object gathing x,y coordinates, steps from state, and email from state
  // post payload to API, set response message (either success or error) to state
  const onSubmit = event => {
    event.preventDefault();

    const payload = {
      x: state.xy[0],
      y: state.xy[1],
      steps: state.steps,
      email: state.email.trim()
    }

    axios.post("http://localhost:9000/api/result", payload)
      .then(res => {
        setState({
          ...state,
          email: '',
          message: res.data.message
        })
      })
      .catch(err => {
        setState({
          ...state,
          message: err.response.data.message
        })
      })
  }

  return (
    <div id="wrapper" className={className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({state.xy[0]},{state.xy[1]})</h3>
        <h3 id="steps">You moved {state.steps} time{state.steps === 1 ? '' : "s"}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === getIndex() ? ' active' : ''}`}>
              {idx === getIndex() ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move(moveLeft)}>LEFT</button>
        <button id="up" onClick={() => move(moveUp)}>UP</button>
        <button id="right" onClick={() => move(moveRight)}>RIGHT</button>
        <button id="down" onClick={() => move(moveDown)}>DOWN</button>
        <button id="reset" onClick={() => setState(initialState)}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={state.email}
          onChange={onChange}
        />
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
