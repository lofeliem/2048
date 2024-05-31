'use client'

import Image from "next/image"
import styles from "@/style/index.module.css"
import Box from './components/box/box'

const handleKeyDown = (e: any) => {
  console.log('eeee', e)
}

export default function Home() {
  return (
    <div className={styles.index} tabIndex={0} onKeyDown={handleKeyDown}>
      <Box></Box>
    </div>
  )
}
