import React from 'react'
import { BoardCell } from './GameLogic'

type Props = {
  cell : BoardCell,
}

const BoardCellView = (props: Props) => {
  return (
    <div className='bg-red-300 flex w-10 h-10 items-center justify-center relative'>
      
      <div className='bg-black w-1/2 h-1 flex-1 absolute cross-hori-top'>

      </div>


      <div className='bg-black w-1/2 h-1 flex-1 absolute cross-hori-bottom'>

      </div>


      <div className='bg-black w-1/2 h-1 flex-1 absolute cross-vert-left'>

      </div>


      <div className='bg-black w-1/2 h-1 flex-1 absolute cross-vert-right'>

      </div>
    </div>
  )
}

export default BoardCellView;