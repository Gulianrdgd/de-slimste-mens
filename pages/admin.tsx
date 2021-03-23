
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { signIn, signOut, useSession } from 'next-auth/client';
import Head from 'next/head';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import React from 'react';
import { Table } from '../Components/Table';
import {NewQuestions} from '../Components/newQuestion';
import { io, Socket } from 'socket.io-client'
import { TopSelection } from '../Components/TopSelection'

enum Selection {
  init,
  newQuestion
}

function Admin( ) : JSX.Element{

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, loading] = useSession();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState]= useState({
    selected: Selection.init,
    socket: Socket,
    question: []
  });


  useEffect(() => {
    console.log("Niet te vaak");
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
      })
    }
  });

  function toggleState(): void{
    if(state.selected === Selection.init) {
      setState({ ...state, selected: Selection.newQuestion });
    }else{
      setState({ ...state, selected: Selection.init });
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
      <TopSelection/>
      <div className={"flex flex-row justify-center"}>
        {state.selected === Selection.newQuestion && <NewQuestions socket={state.socket} toggle={toggleState} />}
        {state.selected === Selection.init &&
        <div>
          {<Table data={state.question} />}
          <button className={"mt-10 bg-dsm flex-none self-start p-5 text-white rounded-full py-3 px-6"}
                  onClick={() => toggleState()}> Add new question</button>
        </div>
        }
      </div>
      <footer className={"sticky bottom-0 absolute h-20 w-screen bg-gray-200"}>
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