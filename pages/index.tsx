import Head from 'next/head'
import Slimste from '../public/images/deslimste.svg'
import { signIn, signOut, useSession } from 'next-auth/client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import User from '../models/User'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Index( ) : JSX.Element{

  function Capital(username: string):string{
    return username[0].toUpperCase()+username.slice(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, loading] = useSession();
  const router = useRouter();

  let init = true;

  if(init) {
    useEffect(() => {
        setState({ ...state, auth_error: window.location.href.includes("CredentialsSignin") });
    }, []);
    init = false;
  }

  const [state, setState]= useState({
    username: "",
    password: "",
    auth_error: false
  });

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setState({...state,username: event.target.value})
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setState({...state,password: event.target.value})
  }
  async function handleSignInSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signIn('credentials',{
      username: state.username,
      password: state.password
    })
  }

  function toTheGame() {
    if('role' in session.user) {
      switch ((session.user as User).role) {
        case "admin":
          router.push("/admin")
          break;
        case "overlay":
          router.push("/stream-overlay");
          break;
        case "user":
          router.push("/contestant");
          break;
      }
    }
  }

  return(
    <>
        <Head>
          <title>De slimste mens | welcome</title>
          <meta charSet="utf-8"/>
          <meta name="description" content="De slimste mens portal"/>
          <meta name="author" content="Julian van der Horst"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="og:title" property="og:title" content="De slimste mens | Portal"/>
          <meta name="og:description" property="og:description" content="Please login to get to your slimste mens screen"/>
        </Head>
        <div className={"flex flex-row justify-center"}>
          <div className={"ml-20"}>
            <Slimste />
          </div>
          <div className={"flex flex-auto justify-center"}>
            <div className={"flex flex-col justify-center"}>
              {!session &&
              <div className={"mr-20"}>
                <h1 className={"text-white text-6xl mt-2"}>Welcome</h1>
                <h1 className={"text-white text-5xl mt-10"}>It looks like your are <br />not logged in</h1>
                <form
                  className={"mt-10"}
                  id="signin"
                  onSubmit={handleSignInSubmit}
                >
                  <p>
                    <label className={"text-white text-xl"} htmlFor="username">Username</label>
                    <br />
                    <input
                      name="username"
                      type="text"
                      placeholder="username"
                      id="username"
                      className={"mt-3 form-control rounded-full py-3 px-6"}
                      onChange={handleUsernameChange}
                      value={state.username}
                    />
                  </p>
                  <p className={"mt-5"}>
                    <label className={" text-white text-xl"} htmlFor="password">Password</label>
                    <br />
                    <input
                      name="password"
                      type="password"
                      placeholder=""
                      id="password"
                      className={"mt-3 form-control rounded-full py-3 px-6"}
                      value={state.password}
                      onChange={handlePasswordChange}
                    />
                  </p>
                  <p className={"mt-5 text-red-400 text-l"}>{state.auth_error && "Wrong credentials"}</p>
                    <button
                      id="submitButton"
                      type="submit"
                      className="mt-10 bg-dsm p-5 text-white rounded-full py-3 px-6"
                    >
                      Sign in
                    </button>
                </form>
              </div>
              }
              {session &&
              <div className={"mr-20"}>
                <h1 className={"text-white italic text-6xl"}>Hello {Capital((session.user as User).username)}</h1>
                <div className={"flex flex-col justify-center"}>
                  <button className={"mt-10 bg-dsm p-5 rounded-full py-3 px-6 text-black font-bold w-64"} onClick={toTheGame} >Get to your
                    game screen
                  </button>
                  <button className={"mt-10 bg-dsm p-5 rounded-full py-3 px-6 w-32 text-black font-bold"}
                          onClick={() => signOut()}>Sign Out
                  </button>
                </div>
              </div>
              }
            </div>
          </div>
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

export  default  Index;