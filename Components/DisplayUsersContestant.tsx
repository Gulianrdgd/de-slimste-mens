import gameData from 'models/GameData';
import React, { useEffect, useState } from 'react'
import PlayerCounter from './PlayerCounter'
import { Socket } from 'socket.io-client'

interface propInner {
  gameData: gameData,
  socket: Socket
}

interface DisplayState {
  socket: Socket
  username: string,
  current_time: number,
}
export function DisplayUsers(prop: propInner) : JSX.Element{
  const [state, setState]= useState<DisplayState>({
    socket: prop.socket,
    current_time: 60,
    username: ""
  });

  useEffect(() => {
    if(state.socket) {
      state.socket.on('?newTime', data => {
        console.log(data)
        if(data.time != state.current_time || data.username != state.username) {
          setState({...state, current_time: data.time, username: data.username })
        }
      });
    }}, [state.socket]);


  const temp = [];
  for(const ans in prop.gameData.players.sort()){
    if((prop.gameData.players[ans].username === prop.gameData.current_player) && prop.gameData.timer_started) {
      temp.push(
        <PlayerCounter key={prop.gameData.players[ans].id.toString()} amount={state.current_time}
                       active={prop.gameData.players[ans].username === prop.gameData.current_player}
                       player={prop.gameData.players[ans].username} className={"mt-20 mb-10"} />
      );
    }else{
      temp.push(
        <PlayerCounter key={prop.gameData.players[ans].id.toString()} amount={prop.gameData.players[ans].time}
                       active={prop.gameData.players[ans].username === prop.gameData.current_player}
                       player={prop.gameData.players[ans].username} className={"mt-20 mb-10"} />
      );
    }
  }
  return (<div className={"flex flex-row justify-around"}>{temp}</div>)
}