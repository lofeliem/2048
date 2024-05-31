'use client'

import boxStyle from './box.module.css'
import Square from '../square/square'

const handleKeyDown = (e: any) => {
    console.log('eeee', e)
}

export default function Box() {
    return (
        <div 
            className={boxStyle.box}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div>
               <Square/>
               <Square/>
               <Square/>
               <Square/>
            </div>
            <div>
               <Square/>
               <Square/>
               <Square/>
               <Square/>
            </div>
            <div>
               <Square/>
               <Square/>
               <Square/>
               <Square/>
            </div>
            <div>
               <Square/>
               <Square/>
               <Square/>
               <Square/>
            </div>
        </div>
    )
}