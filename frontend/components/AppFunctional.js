import React, { useState } from 'react';
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

export default function AppFunctional(props) {
  
  const { className } = props
  const [state, setState] = useState(initialState)

  const getX = index => {
    return displayXY[index][0];
  }

  const getY = index => {
    return displayXY[index][1];
  }

  const getXYmessage = index => {
    const x = getX(index);
    const y = getY(index);
    return `Coordinates (${x}, ${y})`;
  }

  const reset = () => {
    setState(initialState)    
  }

  const getYX = index => {
    for(let y = 0; y < 3; y++){
      for(let x = 0; x < 3; x++){
        if(indexGrid[y][x] === index){
          return [y, x];
        }
      }
    }
  }

  const getNextIndex = (direction) => {
    const current = getYX(state.index);
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

  const move = (direction) => {
    const [index, error] = getNextIndex(direction);
    
    if(error){
      setState({
        ...state,
        message: error
      })
    } else {
      setState({
        ...state,
        index,
        steps: state.steps + 1,
        message: ''
      })
    }
  }

  const onChange = event => {
    setState({
      ...state,
      email: event.target.value
    })
  }

  const onSubmit = event => {
    event.preventDefault();

    const payload = {
      "x": getX(state.index),
      "y": getY(state.index),
      "steps": state.steps,
      "email": state.email.trim()
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
          <h3 id="coordinates">{getXYmessage(state.index)}</h3>
          <h3 id="steps">You moved {state.steps} time{state.steps === 1 ? '' : "s"}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
                {idx === state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => move([0, -1])}>LEFT</button>
          <button id="up" onClick={() => move([-1, 0])}>UP</button>
          <button id="right" onClick={() => move([0, 1])}>RIGHT</button>
          <button id="down" onClick={() => move([1, 0])}>DOWN</button>
          <button id="reset" onClick={reset}>reset</button>
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
