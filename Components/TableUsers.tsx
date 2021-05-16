import user from '../models/Users'

interface Prop {
  data: user[]
}

export function TableUsers (props: Prop): JSX.Element {
  // const [state, setState]= useState({
  //   data: this.props.data
  // });


  function Table(): JSX.Element{
    const qInput = [];
    const qTemp = [];

    qInput.push(
      <thead>
      <tr>
        <th className={"text-center"}>Username</th>
        <th className={"text-center"}>Role</th>
        <th className={"text-center"}>Time</th>
      </tr>
      </thead>
    )
    props.data.map(e => qTemp.push(
      <tr key={e.id}>
        <td className={"text-center"}>{e.username}</td>
        <td className={"text-center"}>{e.role}</td>
        <td className={"text-center"}>{e.time}</td>
      </tr>
    ))
    qInput.push(<tbody>{qTemp}</tbody>);
    return (<div className={"bg-dsm p-4 rounded"}><table className={"bg-white table table-auto"}>{qInput}</table></div>)
  }

  return(
    <Table/>
  )
}
