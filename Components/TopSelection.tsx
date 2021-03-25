import { useState } from 'react'
import logo from '../public/images/logo.png';
import {ReactComponent as GameIcon} from '../public/images/sports_esports-24px.svg';
import {ReactComponent as UserIcon} from '../public/images/group-24px.svg';
import {ReactComponent as QuestionIcon} from '../public/images/question_answer-24px.svg';
import { Selection } from '../models/selection'

interface Prop{
  changeSelection: (Selection) => void
}

export function TopSelection (prop: Prop): JSX.Element {
  const [state, setState]= useState({
    selected: Selection.Game,
  });

  return (
  <div className={"w-full flex justify-center"}>
  <div className={"bg-dsm flex flex-row w-96 justify-center gap-2 py-2.5 rounded-b-lg items-center"}>
    <img src={logo} className={"w-16 h-full"} alt={"Logo vdhorst.dev"}/>
      <button className={`w-16 h-16`} onClick={() => {
        setState({ ...state, selected: Selection.Game });
        prop.changeSelection(Selection.Game);
      }}>
        <div className={` ${(state.selected === Selection.Game) ? "bg-dsm-bg" : "bg-white"} rounded-full flex flex-col justify-center h-full`}>
        <GameIcon className={"self-center"}/>
          <label className={"text-xs"}>
          Game
        </label>
        </div>
      </button>
    <button className={"w-16 h-16"} onClick={() => {
      setState({ ...state, selected: Selection.Questions });
      prop.changeSelection(Selection.Questions);
    }}>
      <div className={`${(state.selected === Selection.Questions) ? "bg-dsm-bg" : "bg-white"} rounded-full flex flex-col justify-center h-full`}>
        <QuestionIcon className={"self-center"}/>
        <label className={"text-xs"}>
          Question
        </label>
      </div>
    </button>
    <button className={"w-16 h-16"} onClick={() => {
      setState({ ...state, selected: Selection.Users });
      prop.changeSelection(Selection.Users);
    }}>
      <div className={`${(state.selected === Selection.Users) ? "bg-dsm-bg" : "bg-white"} rounded-full flex flex-col justify-center h-full`}>
        <UserIcon className={"self-center"}/>
        <label className={"text-xs"}>
          User
        </label>
      </div>
    </button>
  </div>
  </div>
  )
}