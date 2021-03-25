interface Prop{
  text: string
  className?: string
  onClick?: () => any
}

function Button(prop: Prop):JSX.Element{
  return (<button onClick={prop.onClick} className={"mt-10 bg-dsm flex-none self-center " +
  "p-5 text-white rounded-full py-3 px-6 " + prop.className}>{prop.text}</button>)
}

export default Button;