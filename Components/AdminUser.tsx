import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import Button from './Button';

interface Sock{
  socket: Socket;
  toggle: () => void;
}
enum Role{
  player,
  admin
}

export function NewUsers (props: Sock): JSX.Element {

  const [state, setState]= useState({
    username: "",
    password1: "",
    password2: "",
    role: Role.player,
    socket: props.socket,
    error: "",
  });
  useEffect(() => {

    state.socket.on('db', (data) => {
      if(data.succeed){
        setState({...state, username: "", password1: "", password2: "", role: Role.player, error: ""})
      }else{
        console.log("Something happend", data.error);
        setState({...state, error: data.error});
      }
    });

  }, [])


  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>): void {
    setState({...state, username: event.target.value})
  }

  function handlePassword1Change(event: ChangeEvent<HTMLInputElement>): void {
    setState({...state, password1: event.target.value});
  }

  function handlePassword2Change(event: ChangeEvent<HTMLInputElement>): void {
    setState({...state, password2: event.target.value});
  }

  function handleRoleChange(event: ChangeEvent<HTMLSelectElement>): void {
    const round = parseInt(event.target.value);
    if (round === 0) {
      setState({ ...state, role: Role.player });
    } else if (round === 1) {
      setState({ ...state, role: Role.admin });
    }
  }

    async function handleUserSubmit(event: FormEvent<HTMLFormElement>): Promise<any> {
      event.preventDefault();
      let role = "";
      if(state.role === Role.player){
        role = "player";
      }else if (state.role === Role.admin){
        role = "admin";
      }
      state.socket.emit('?newUser', {
        username: state.username,
        password1: state.password1,
        password2: state.password2,
        role: role
      })
      setState({ ...state, username: "", password1: "", password2: "", role: Role.player, error: "" })
      props.toggle();
    }

    function goBack(): void {
      setState({ ...state, username: "", password1: "", password2: "", role: Role.player, error: "" })
      props.toggle();
    }

    return (
      <>
      <form
        className={"mt-10 flex flex-col"}
        style={{ height: "0%" }}
        id="newUser"
        onSubmit={handleUserSubmit}>
        <div className={"px-2"}>
          <label className={"text-white flex-none self-start text-xl"} htmlFor="username">Role</label>
          <br />
          <select className={"flex-none self-start rounded-full py-3 px-6 mt-3"} id="role" name="role"
                  onChange={handleRoleChange}>
            <option value="1">Player</option>
            <option value="2">Admin</option>
          </select>
        </div>
        <div className={"px-2"}>
          <label className={"text-white text-xl flex-none self-start"} htmlFor="question">Username</label>
          <br />
          <input
            name="username"
            type="text"
            placeholder="username"
            id="username"
            className={"mt-3 form-control rounded-full flex-none self-start py-3 px-6"}
            onChange={handleUsernameChange}
            value={state.username}
          />
        </div>
        <div className={"px-2"}>
          <label className={"text-white text-xl flex-none self-start"} htmlFor="question">Password</label>
          <br />
          <input
            name="password1"
            type="password"
            placeholder="password"
            id="password1"
            className={"mt-3 form-control rounded-full flex-none self-start py-3 px-6"}
            onChange={handlePassword1Change}
            value={state.password1}
          />
        </div>
        <div className={"px-2"}>
          <label className={"text-white text-xl flex-none self-start"} htmlFor="question">Password again</label>
          <br />
          <input
            name="password2"
            type="password"
            placeholder="password again"
            id="password2"
            className={"mt-3 form-control rounded-full flex-none self-start py-3 px-6"}
            onChange={handlePassword2Change}
            value={state.password2}
          />
        </div>
        {state.password1 !== state.password2 &&
          <>
          <p className={"text-red-500 text-m flex-none"}>Passwords do not match!</p>
          </>
        }
        <div className={"px-2 flex"}>
          <Button text={"Back"} className={""} onClick={goBack} />
          <button
            id="submitButton"
            type="submit"
            className="mt-10 bg-dsm flex-none self-start text-white rounded-full py-3 px-6"
          >
            Submit
          </button>
        </div>

      </form>
  </>
  )
}
