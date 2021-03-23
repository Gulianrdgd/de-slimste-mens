import { useState } from 'react'
import logo from '../public/images/logo.png';
import {ReactComponent as GameIcon} from '../public/images/sports_esports-24px.svg';
import {ReactComponent as UserIcon} from '../public/images/group-24px.svg';
import {ReactComponent as QuestionIcon} from '../public/images/question_answer-24px.svg';

enum Selection {
  Questions,
  Users,
  Game
}
export function TopSelection (): JSX.Element {
  const [state, setState]= useState({
    selected: Selection
  });

  return (
  <div className={" relative left-3/4 top-0 transform-gpu -translate-" +
  "x-1/2"}>
  <div className={"bg-dsm flex flex-row w-96 justify-center gap-2 py-2.5 rounded-b-lg items-center"}>
    <img src={logo} className={"w-16 h-full"} alt={"Logo vdhorst.dev"}/>
      <button className={"w-16 h-16"}>
        <div className={"bg-dsm-bg rounded-full flex flex-col justify-center h-full"}>
        <GameIcon className={"self-center"}/>
          <label className={"text-xs"}>
          Game
        </label>
        </div>
      </button>
    <button className={"w-16 h-16"}>
      <div className={"bg-dsm-bg rounded-full flex flex-col justify-center h-full"}>
        <QuestionIcon className={"self-center"}/>
        <label className={"text-xs"}>
          Question
        </label>
      </div>
    </button>
    <button className={"w-16 h-16"}>
      <div className={"bg-dsm-bg rounded-full flex flex-col justify-center h-full"}>
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