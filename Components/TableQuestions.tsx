import question from '../models/Question'

interface Prop {
  data: question[]
}
interface PropAnswer{
  round: number,
  answers: string[]
}

export function TableQuestions (props: Prop): JSX.Element {

  function Answer(props: PropAnswer): JSX.Element{
    const temp = []
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
    return (<td className={"text-center"}>{temp}</td>)
  }

  function Table(): JSX.Element{
    const qInput = [];
    const qTemp = [];

    qInput.push(
      <thead>
      <tr>
        <th className={"text-center"}>Round</th>
        <th className={"text-center"}>Question</th>
        <th className={"text-center"}>Answers</th>
      </tr>
      </thead>
    )
    props.data.map(e => qTemp.push(
      <tr key={e.qid}>
        <td className={"text-center"}>{e.round}</td>
        <td className={"text-center"}>{e.question}</td>
        <Answer round={e.round} answers={e.answers}/>
      </tr>
    ))
    qInput.push(<tbody>{qTemp}</tbody>);
    return (<div className={"bg-dsm p-4 rounded"}><table className={"bg-white table table-auto"}>{qInput}</table></div>)
  }

  return(
    <Table/>
  )
}
