import question from '../models/Question'
import { useEffect, useState } from 'react'

interface Prop {
  data: question[]
}
interface PropAnswer{
  round: number,
  answers: string[]
}

export function Table (props: Prop): JSX.Element {
  // const [state, setState]= useState({
  //   data: this.props.data
  // });

  function Answer(props: PropAnswer): JSX.Element{
    const temp = []
    console.log("Props:", props);
    if(props.answers) {
      if (props.round === 1) {
        temp.push(props.answers[0]);
      } else if (props.round === 3) {
        temp.push(props.answers[0]);
        temp.push(<br/>);
        temp.push(props.answers[4]);
        temp.push(<br/>);
        temp.push(props.answers[8]);
      } else {
        props.answers.map(e => {
          temp.push(e);
          temp.push(<br/>);
        });
      }
    }
    console.log("Temp:", temp);
    return (<td>{temp}</td>)
  }

  function Table(): JSX.Element{
    const qInput = [];
    const qTemp = [];

    qInput.push(
      <thead>
      <tr>
        <th>Round</th>
        <th>Question</th>
        <th>Answers</th>
      </tr>
      </thead>
    )
    console.log("Props before map:", props.data);
    props.data.map(e => qTemp.push(
      <tr key={e.qid}>
        <td>{e.round}</td>
        <td>{e.question}</td>
        <Answer round={e.round} answers={e.answers}/>
      </tr>
    ))
    qInput.push(<tbody>{qTemp}</tbody>);
    return (<table>{qInput}</table>)
  }

  return(
    <Table/>
  )
}
