import { useSession } from 'next-auth/client'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { NewQuestions } from '../Components/newQuestion'
import { io } from 'socket.io-client'
import { TopSelection } from '../Components/TopSelection'
import { Selection } from '../models/selection'
import AdminGame from '../Components/AdminGame'
import Button from 'Components/Button'
import gameData from 'models/GameData'
import { css } from '@emotion/core'
import { SyncLoader } from 'react-spinners'
import { NewUsers } from '../Components/AdminUser'
import { TableUsers } from '../Components/TableUsers'
import { TableQuestions } from 'Components/TableQuestions'
import user from '../models/Users'

enum SelectionLocal {
  init,
  new
}

interface AdminState {
  selected: SelectionLocal,
  selectedTop: Selection,
  socket: any,
  question: [],
  users: user[],
  currentGameData: gameData
}

const override = css`
  margin: 0 auto;
  border-color: red;
`;

function Admin( ) : JSX.Element{

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, loading] = useSession();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState]= useState<AdminState>({
    selected: SelectionLocal.init,
    selectedTop: Selection.Game,
    socket: undefined,
    question: [],
    users: [],
    currentGameData: undefined
  });


  useEffect(() => {
    if(!session && !loading){
    router.push("/?error=notLoggedIn");
    }
    if(!state.socket) {
      const sock = io("ws://localhost:3000");
      setState({ ...state, socket: sock });
      sock.emit('?getQ');
      sock.emit('?getU');
      sock.emit('?getCurrGame');
    }else{
        state.socket.on('?newTable', data => {
          setState({ ...state, question: data.question });
          state.socket.off("?newTable")
        });
        state.socket.on('?currentGame', data => {
          setState({
            ...state, currentGameData: {
              round: data.response.round, has_started: data.response.has_started,
              current_question: data.response.current_question, current_player: data.response.current_player,
              current_answered: data.response.current_answered,
              timer_started: data.response.timer_started,
              players: data.response.players,
              show_question: data.response.show_question,
              round1: data.response.round1,
            }
          });
          state.socket.off("?currentGame")
        })
        state.socket.on('?newUsers', data => {
          setState({ ...state, users: data.users });
          state.socket.off("?newUsers")
        });
    }
  });





  function toggleSelection(select: Selection): void{
    setState({...state, selectedTop: select});
    if (select === Selection.Game){
      state.socket.emit('?getCurrGame');
    }
  }

  function toggleGame(): void{
    state.socket.emit('?toggleGame');
  }

  function toggleState(): void{
    if(state.selected === SelectionLocal.init) {
      setState({ ...state, selected: SelectionLocal.new });
    }else{
      setState({ ...state, selected: SelectionLocal.init });
    }
  }

  return(
    <>
      <Head>
        <title>De slimste mens | Admin</title>
        <meta charSet="utf-8"/>
        <meta name="description" content="De slimste mens admin page"/>
        <meta name="author" content="Julian van der Horst"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="og:title" property="og:title" content="De slimste mens | Admin"/>
        <meta name="og:description" property="og:description" content="Admin screen where the views of the contestants be controlled"/>
      </Head>
    <div className={"bg-dsm-bg h-screen"}>
      <TopSelection changeSelection={toggleSelection}/>
      <div className={"flex flex-row justify-center"}>
        { state.selectedTop === Selection.Questions &&
          <>
            {state.selected === SelectionLocal.new &&
            <NewQuestions socket={state.socket} toggle={toggleState} />}
            {state.selected === SelectionLocal.init &&
            <div className={"m-12 flex flex-col justify-center"}>
              <TableQuestions data={state.question} />
              <Button onClick={toggleState} text={"Add new question"}/>
            </div>
            }
          </>
        }
      {state.selectedTop === Selection.Game && state.currentGameData !== undefined &&
        <>
        <AdminGame socket={state.socket} toggle={toggleGame} currentGame={state.currentGameData} answers={state.currentGameData.current_question.answers} />
        </>
      }
      { state.selectedTop === Selection.Game && state.currentGameData === undefined &&
        <>
          <SyncLoader color={"#C76B2C"} loading={true} css={override} size={10} />
        </>
      }
      {state.selectedTop === Selection.Users &&
        <>
          {state.selected === SelectionLocal.new &&
          <NewUsers socket={state.socket} toggle={toggleState} />}
          {state.selected === SelectionLocal.init &&
          <div className={"m-12 flex flex-col justify-center"}>
            <TableUsers data={state.users} />
            <Button onClick={toggleState} text={"Add a new user"}/>
          </div>
          }
        </>
      }
      </div>
      <footer className={"bottom-0 absolute h-20 w-screen bg-gray-200"}>
        <div className="text-center flex justify-center flex-col">
          <p className={"mt-4"}>
            <strong>De slimste mens</strong> by <a className={"text-primary"} href="https://vdhorst.dev">Julian van
            der
            Horst</a><br />
            You can look at the source code on <a
            href={"https://github.com/Gulianrdgd/Bussen-online-drinking-game-v2"}> my github</a>
          </p>
        </div>
      </footer>
    </div>
    </>
  )
}

export  default  Admin;