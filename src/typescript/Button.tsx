import React, { PropsWithChildren } from 'react'

type Props = {
    onClick:()=>void,
}

const Button = (props: PropsWithChildren<Props>) => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={props.onClick}>{props.children}</button>
  )
}
export default Button;