import Button from './Button'
import { Socket } from 'socket.io-client'
import CorrectAnswers from './CorrectAnswers'
import gameData from '../models/GameData'
import PlayerCounter from './PlayerCounter'
import React, { useEffect, useState } from 'react'


interface Props{
  toggle: () => void,
  answers: string[],
  socket: Socket,
  currentGame: gameData,
}

interface propInner {
  gameData: gameData,
  current_time: number,
  current_user: string
}

function DisplayUsers(prop: propInner) : JSX.Element{
  const temp = [];
  for(const ans in prop.gameData.players.sort()){
    if((prop.gameData.players[ans].username === prop.gameData.current_player) && prop.gameData.timer_started) {
      temp.push(
        <PlayerCounter key={prop.gameData.players[ans].id.toString()} amount={prop.current_time}
                       active={prop.gameData.players[ans].username === prop.gameData.current_player}
                       player={prop.gameData.players[ans].username} className={"mt-20"} />
      );
    }else{
      temp.push(
        <PlayerCounter key={prop.gameData.players[ans].id.toString()} amount={prop.gameData.players[ans].time}
                       active={prop.gameData.players[ans].username === prop.gameData.current_player}
                       player={prop.gameData.players[ans].username} className={"mt-20"} />
      );
    }
  }
  return (<div>{temp}</div>)
}

function AdminGame(prop: Props) : JSX.Element {
  const [state, setState]= useState({current_time: 60, username: ""})

  useEffect(() => {
    if(prop.socket) {
      prop.socket.on('?newTime', data => {
        if(data.time != state.current_time || data.username != state.username) {
          setState({ current_time: data.time, username: data.username })
        }
      });
    }}, []);

  return (
    <div className={"flex flex-col justify-center"}>
      <div className={"flex justify-center"}>
        { prop.currentGame.has_started &&
          <>
            <p className={"blink_me text-red-500"}>Live</p>
          </>
        }
        { !prop.currentGame.has_started &&
        <p>Not Live</p>
        }
      </div>
      <div className={"flex flex-row justify-around w-full content-evenly items-stretch space-x-4"}>
        <div className={"iframe bg-dsm-bg-dark flex flex-col justify-center rounded"}>
          <DisplayUsers gameData={prop.currentGame} current_time={state.current_time} current_user={state.username}/>
        </div>
      <div className={"iframe bg-dsm-bg-dark flex flex-col justify-center rounded"}>
        <Button text={"Next User"} className={"w-48"} onClick={() => prop.socket.emit("?nextUser")}/>
        <Button text={"Next Question"} className={"w-48"} onClick={() => prop.socket.emit("?nextQuestion",
          {round: prop.currentGame.round})}/>
        <Button text={"Next Round"}  className={"w-48"} onClick={() => prop.socket.emit("?nextRound")}/>
        <Button text={"Show Question"} className={"w-48"} onClick={() => prop.socket.emit("?showQuestion")}/>
        <Button text={"Start/Stop Timer"} className={"w-48"}
                onClick={() => prop.socket.emit("?toggleTimer",
                  {username: prop.currentGame.current_player, round: prop.currentGame.round})}/>
        <Button text={"Pause/play game"} className={"w-48"}
                onClick={() => {prop.toggle();}}/>
      </div>
      <div className={"iframe bg-dsm-bg-dark rounded flex flex-col self-center"}>
        {prop.currentGame.round === 1 &&
        <div className={"relative oval bg-dsm-bg w-16 h-16 self-center mt-10"}>
          <h1 className={"absolute bottom-1/2 left-1/2 transform translate-y-1/2 -translate-x-1/2 text-white text-2xl"}>{prop.currentGame.round1}</h1>
        </div>
        }
        <CorrectAnswers gameData={prop.currentGame} socket={prop.socket} isAdmin={true}/>
      </div>
      </div>
    </div>
  )
}

export default AdminGame;