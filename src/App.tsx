import Category from "./components/Category"
import NavBar from "./components/NavBar"
import Tabs from "./components/Tabs"
import BannerImage from '@/assets/banner.png'
import FooterImage from '@/assets/footer.jpg'
import styles from '@/styles.module.scss'
import { dataSource } from "@/constants/data"
import { useRef, useState } from "react"
import classNames from "classnames"

function App() {
  const oldYRef = useRef<number>(0)
  const [hidden, setHidden] = useState<boolean>(false)
  const contentRef = useRef<HTMLDivElement>(null);
  const onScroll = () => {
    if (contentRef.current) {
      const { top: newY } = contentRef.current.getBoundingClientRect() // 获取该元素的位置和大小信息
      const delta = newY - oldYRef.current
      oldYRef.current = newY
      if (delta < 0) {
        // 隐藏
        setHidden(true)
      } else {
        setHidden(false)
      }
    }
  }
  return (
    <div className={styles.app}>

      <header className={classNames(styles.header, hidden && styles.hidden)}>
        <NavBar title="首页" />
        <Tabs />
      </header>

      <div className={styles.scrollView} onScroll={onScroll}>
        <div className={styles.line}></div>
        <img className={styles.banner} src={BannerImage} alt="BannerImage" />

        <div className={styles.content} ref={contentRef}>
          <h2>{dataSource.hot.title}</h2>
          <Category list={dataSource.hot.list} />

          <h2>{dataSource.live.title}</h2>
          <Category list={dataSource.live.list} />

          <h2>{dataSource.recommend.title}</h2>
          <Category list={dataSource.recommend.list} />
        </div>

        <img className={styles.banner} src={FooterImage} alt="FooterImage" />

      </div>

      <footer className={styles.footer}>
        <span>@Bilibili 2024</span>
      </footer>
    </div>
  )
}

export default App
