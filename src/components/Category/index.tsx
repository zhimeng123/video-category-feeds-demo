import { FC, HTMLAttributes } from "react"
import { VideoData } from "@/constants/data"
import styles from './styles.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  list: VideoData[]
}

const Category: FC<Props> = (props: Props) => {
  const { list, ...divProps } = props
  // console.log(list)
  return (
    <div {...divProps} className={styles.category}>
      <ul>
        {list.map(videoData => (
          <li key={videoData.id}>
            <video data-video-id={videoData.id} loop muted src={videoData.src} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Category