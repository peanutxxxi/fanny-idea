import React from "react"
import styles from '../styles/star.module.scss'

// 星星背景特效
const Star: React.FC = () => {
  return (
    <React.Fragment>
      <div className="w-full h-[1000px] bg-black relative">
        <div className={styles.layer1}></div>
        <div className={styles.layer2}></div>
        <div className={styles.layer3}></div>
        <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold" >Sass 星空</div>
      </div>
    </React.Fragment>
  )
}

export default Star