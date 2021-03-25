// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSession } from 'next-auth/client'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Table } from '../Components/Table'
import { NewQuestions } from '../Components/newQuestion'
import { io, Socket } from 'socket.io-client'
import { TopSelection } from '../Components/TopSelection'
import { Selection } from '../models/selection'
import AdminGame from '../Components/AdminGame'
import Button from 'Components/Button'

enum SelectionQuestion {
  init,
  newQuestion
}

function Admin( ) : JSX.Element{

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, loading] = useSession();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState]= useState({
    selected: SelectionQuestion.init,
    selectedTop: Selection.Game,
    socket: Socket,
    question: [],
    gameHasStarted: false
  });


  useEffect(() => {
    if(!session && !loading){
    router.push("/?error=notLoggedIn");
    }
    if(!state.socket) {
      const sock = io("ws://localhost:3000");
      setState({ ...state, socket: sock });
      sock.emit('getQ');
    }
    else{
      state.socket.on('?newTable', data => {
        setState({...state, question: data.question});
      });
      state.socket.on('?toggled', data => {
        console.log(data);
      })
    }
  });

  function toggleSelection(select: Selection): void{
    setState({...state, selectedTop: select});
  }

  function toggleGame(): void{
    console.log("CLICK");
    setState({...state, gameHasStarted: !state.gameHasStarted});
    state.socket.emit('?toggleGame');
  }

  function toggleState(): void{
    if(state.selected === SelectionQuestion.init) {
      setState({ ...state, selected: SelectionQuestion.newQuestion });
    }else{
      setState({ ...state, selected: SelectionQuestion.init });
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
      <TopSelection changeSelection={toggleSelection}/>
      <div className={"flex flex-row justify-center"}>
        { state.selectedTop === Selection.Questions &&
          <>
            {state.selected === SelectionQuestion.newQuestion &&
            <NewQuestions socket={state.socket} toggle={toggleState} />}
            {state.selected === SelectionQuestion.init &&
            <div className={"m-12 flex flex-col justify-center"}>
              <Table data={state.question} />
              <Button onClick={toggleState} text={"Add new question"}/>
            </div>
            }
          </>
        }
        { state.selectedTop === Selection.Game &&
          <AdminGame toggle={toggleGame}/>
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
    </>
  )
}

export  default  Admin;