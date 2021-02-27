
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { signIn, signOut, useSession } from 'next-auth/client'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import React from 'react';

export function Admin( ) : JSX.Element{

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {if(!session && !loading){
    router.push("/?error=notLoggedIn");
  }});

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
      <div className={"flex flex-row justify-center"}>
        <h1>Welcome to the admin page</h1>
        <button onClick={() => signOut()}>Sign out</button>
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