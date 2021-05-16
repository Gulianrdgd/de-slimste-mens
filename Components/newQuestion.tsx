import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import Button from './Button';

interface Round {
  round: number
}
interface Sock{
  socket: Socket;
  toggle: () => void;
}
const numberOfAnswers = [5, 1, 4, 12, 5];
export function NewQuestions (props: Sock): JSX.Element {

  const [state, setState]= useState({
    question: "",
    round: -1,
    answer: [],
    correctAnswer: [],
    socket: props.socket,
    error: "",
  });
  useEffect(() => {
    if(state.socket) {
      state.socket.on('db', (data) => {
        if (data.succeed) {
          setState({ ...state, question: "", round: -1, answer: [] })
        } else {
          console.log("Something happend", data.error);
          setState({ ...state, error: data.error });
        }
      });
    }
  }, [])


  function handleQuestionChange(event: ChangeEvent<HTMLInputElement>): void {
    setState({...state, question: event.target.value})
  }

  function handleRoundChange(event: ChangeEvent<HTMLSelectElement>): void {
    const copy = [];
    const round = parseInt(event.target.value);
    copy.fill("", numberOfAnswers[round]);
    setState({...state, round: round, answer: copy});
  }

  function handleAnswerChange(event: ChangeEvent<HTMLInputElement>): void{
    const name = event.target.name;
    const id: number =  parseInt(name.slice(1))-1;
    const copy: any[] = state.answer;
    copy[id] = event.target.value;
    setState({...state, answer: copy})
  }

  async function handleQuestionSubmit(event: FormEvent<HTMLFormElement>): Promise<any> {
    event.preventDefault();
    state.socket.emit('newQ', {
      round: state.round,
      question: state.question,
      answer: state.answer
    })
    setState({...state, round: -1, error: "", answer: [], question: ""});
    props.toggle();
  }

  function goBack(): void{
    setState({...state, round: -1, error: "", answer: [], question: ""});
    props.toggle();
  }

  function AnswerQuestion(props: Round): JSX.Element{
    if(props.round >= 0) {
      const times = numberOfAnswers[props.round];
      const qInput = [];
      let col = "border-transparent";
      for(let i=1; i<= times; i++){
        if(props.round === 3){
          if(i <= 3){
            col = "border-red-500";
          }else if(i > 3 && i <= 6 ){
            col = "border-blue-500";
          }else{
            col = "border-yellow-500";
          }
        }
        qInput.push(
            <input
              key={i}
              name={"a" + i}
              type="text"
              placeholder={"answer " + i}
              id={"a" + i}
              className={"mt-3 form-control rounded-full py-3 px-6 border-4 " + col}
              onChange={handleAnswerChange}
              value={state.answer[i-1]}
            />
        )
      }
      return (<div className={"flex flex-col"}>{qInput}</div>);
    } else{
      return (<></>)
    }
  }

  return (
    <>
      <form
          className={"mt-10 flex flex-row"}
          style={{height: "0%"}}
          id="newQuestion"
          onSubmit={handleQuestionSubmit}>
        <div className={"px-2"}>
          <Button text={"Back"} className={""} onClick={goBack}/>
        </div>
        <div className={"px-2"}>
          <label className={"text-white flex-none self-start text-xl"} htmlFor="username">Round</label>
          <br />
          <select className={"flex-none self-start rounded-full py-3 px-6 mt-3"} id="round" name="Round" onChange={handleRoundChange} >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="0">Finale</option>
          </select>
        </div>
        {state.round >= 0 &&
        <>
          <div className={"px-2"}>
          <label className={"text-white text-xl flex-none self-start"} htmlFor="question">Question</label>
          <br />
          <input
            name="question"
            type="text"
            placeholder="question"
            id="question"
            className={"mt-3 form-control rounded-full flex-none self-start py-3 px-6"}
            onChange={handleQuestionChange}
            value={state.question}
          />
          </div>
          <div className={"px-2"}>
          <label className={"text-white text-xl flex-none self-start"} htmlFor="question">Answers</label>
          <br />
          {AnswerQuestion({round: state.round})}
          </div>
          <div className={"px-2"}>
          <button
          id="submitButton"
          type="submit"
          className="mt-10 bg-dsm flex-none self-start text-white rounded-full py-3 px-6"
          >
          Submit
          </button>
          </div>
        </>
        }
      </form>
    </>

  );
}
