import Button from './Button'
import { useState } from 'react'
import { Selection } from '../models/selection'
import { Socket } from 'socket.io-client'

interface Props{
  toggle: () => void
}

function AdminGame(prop: Props) : JSX.Element {

  const [state, setState]= useState({
    hasStarted: false
  });

  return (<div className={"flex flex-col justify-center"}>
    <div className={"flex justify-center"}>
      <div className={"blink_me rounded-full h-24 w-24"}/>
      { state.hasStarted &&
        <p className={"text-red-500"}>Live</p>
      }
      { !state.hasStarted &&
      <p>Not Live</p>
      }
    </div>
    <div className={"flex flex-row justify-around w-full content-evenly items-stretch"}>
    <iframe src={'localhost:3000/streamOverlay'} className={"iframe"} title={"Stream overlay preview"}/>
    <div className={"iframe flex flex-col justify-center"}>
      <Button text={"Next User"} className={"w-48"}/>
      <Button text={"Next Question"} className={"w-48"}/>
      <Button text={"Next Round"} className={"w-48"}/>
      <Button text={"Pause/play game"} className={"w-48"}
              onClick={() => {prop.toggle(); setState({...state, hasStarted: !state.hasStarted});}}/>
      <Button text={"Show Question"} className={"w-48"}/>
    </div>
    <div className={"iframe"}>
      Joe
    </div>
  </div>
    </div>
  )
}

export default AdminGame;