import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import gameData from '../models/GameData'
import Head from 'next/head'
import CorrectAnswers from '../Components/CorrectAnswers'
import { SyncLoader } from 'react-spinners'
import { css } from '@emotion/core'
import Round3 from '../Components/Round3'
import { DisplayUsers } from '../Components/DisplayUsersContestant'


interface ContestantState {
  socket: Socket,
  currentGameData: gameData,
}

const override = css`
  border-color: red;
  margin: 20rem auto 0;
`;


function Contestant( ) : JSX.Element {
  const [session, loading] = useSession();
  const router = useRouter();
  const [state, setState]= useState<ContestantState>({
    socket: undefined,
    currentGameData: undefined
  });



  useEffect(() => {
    if(!session && !loading){
      router.push("/?error=notLoggedIn");
    }
    if(!state.socket) {
      const sock = io("ws://localhost:3000");
      setState({ ...state, socket: sock });
      sock.emit('?getCurrGame');
    } else {
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
    }
  });


  return (
  <>
    <Head>
      <title>De slimste mens | Contestant </title>
      <meta charSet="utf-8"/>
      <meta name="description" content="De slimste mens admin page"/>
      <meta name="author" content="Julian van der Horst"/>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="og:title" property="og:title" content="De slimste mens | Admin"/>
      <meta name="og:description" property="og:description" content="Admin screen where the views of the contestants be controlled"/>
    </Head>
    <div className={"bg-dsm-bg"}>
    <div className={"flex flex-col justify-center "}>
      <div>
        { state.currentGameData && state.currentGameData.show_question &&
          <div className={"flex flex-col justify-center content-evenly"}>
            <h1 className={"text-white text-3xl text-center mt-5"}>It is {state.currentGameData.current_player} turn</h1>
            <div className={"h-full w-2/5 p-5 bg-dsm-bg-dark self-center mt-5"}>
              {state.currentGameData.round !== 3 && state.currentGameData.round !== 1 &&
              <CorrectAnswers gameData={state.currentGameData} socket={state.socket} isAdmin={false} />
              }
              {state.currentGameData.round === 1 &&
                <div className={"flex flex-col self-center"}>
                  <CorrectAnswers gameData={state.currentGameData} socket={state.socket} isAdmin={false} />
                  <div className={"relative oval bg-dsm-bg w-16 h-16 self-center"}>
                    <h1 className={"absolute bottom-1/2 left-1/2 transform translate-y-1/2 -translate-x-1/2 text-white text-2xl"}>{state.currentGameData.round1}</h1>
                  </div>
                </div>
              }
              {state.currentGameData.round === 3 && 
                <Round3  answers={state.currentGameData.current_question.answers} correct={state.currentGameData.current_answered}/>
              }
            </div>
          </div>
        }
        {state.currentGameData && !state.currentGameData.show_question &&
          <div className={"flex flex-col justify-center mt-30"}>
            <SyncLoader color={"#C76B2C"} loading={true} css={override} size={10} />
            <h1 className={"text-white text-4xl text-center mt-5"}>The questions are hidden for now, please wait...</h1>
          </div>
        }
      </div>
    </div>
      <div className={"mt-20 w-full bg-dsm-bg-dark flex flex-col justify-center rounded"}>
        { state.currentGameData &&
        <DisplayUsers gameData={state.currentGameData} socket={state.socket}/>
        }
      </div>
    <footer className={"bottom-0 relative h-20 w-screen bg-gray-200"}>
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
export default Contestant