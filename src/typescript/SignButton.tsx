import React from 'react'

type Props = {
    /**
     * 
     * @returns Signs in a new current user
     */
    action : () => void,
    text : string,
}

export default function SignButton({action, text}: Props) {
  return (
    <button onClick={() => action()} className=''>{text}</button>
  )
}