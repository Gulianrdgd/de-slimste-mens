import {ReactComponent as Blob} from "../public/images/blob.svg";

interface Props{
  text: string,
  index: number,
  round: number,
  username: string,
  disabled: boolean,
  className?: string,
  onClick?: (a: number, b: number, c: string) => void,
  isAdmin: boolean
}

function Question(prop: Props) :JSX.Element{
  let className = ""
  if(prop.className !== undefined){
    className = prop.className;
  }
  return (
    <div className={"flex flex-row " + className}>
      <div className={"w-36 h-36 flex flex-col justify-center justify-self-center content-center"}>
        {prop.disabled &&
          <Blob onClick={() => {if(prop.isAdmin){prop.onClick(prop.index, prop.round, prop.username)}}}/>
        }
        {!prop.disabled &&
        <Blob/>
        }
      </div>
      <div className={"flex flex-col justify-center justify-self-center content-center"}>
        <h1 className={!prop.isAdmin && prop.disabled ? "blurry-text text-3xl text-white" : "text-3xl text-white"}>{prop.text}</h1>
      </div>
    </div>
  )
}

export default Question;