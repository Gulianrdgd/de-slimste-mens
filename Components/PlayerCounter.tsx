interface Prop{
  amount: number
  player: string
  active: boolean
  className?: string
  onClick?: () => any
}

function PlayerCounter(prop: Prop):JSX.Element{
  return (
    <div className={"flex flex-col justify-center justify-self-center content-center " + prop.className}>
        <div className={"flex justify-center justify-self-center content-center mb-12"}>
          <div className={"relative"}>
          <div className={"oval w-28 h-20 absolute bottom-1/2 left-1/2 transform translate-y-1/2 -translate-x-1/2 " + (prop.active ? "bg-dsm-dark-blue" : "bg-dsm-bg")}/>
            <h1 className={"absolute bottom-1/2 left-1/2 transform translate-y-1/2 -translate-x-1/2 text-white text-4xl"}>{prop.amount}</h1>
          </div>
      </div>
      <div>
        <h1 className={"text-center text-white text-3xl"}>{prop.player}</h1>
      </div>
    </div>
  )
}

export default PlayerCounter;