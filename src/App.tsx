import Category from "./components/Category"
import NavBar from "./components/NavBar"
import Tabs from "./components/Tabs"
import BannerImage from '@/assets/banner.png'
import FooterImage from '@/assets/footer.jpg'
import styles from '@/styles.module.scss'
import { dataSource } from "@/constants/data"
import { useCallback, useEffect, useRef, useState } from "react"
import classNames from "classnames"
import { debounce } from 'lodash'
function App() {
  const oldYRef = useRef<number>(0)
  const [hidden, setHidden] = useState<boolean>(false)
  const contentRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<HTMLDivElement>(null);
  const playingIds = useRef<string[]>([])
  const isScrolling = useRef<boolean>(false)

  const isInView = (el: HTMLVideoElement) => {
    const { top, bottom, left, right } = el.getBoundingClientRect()
    // 水平方向
    const isHorizontalInView = 0 < left && right < window.innerWidth
    // 垂直方向
    const isVerticalInView = top < window.innerHeight / 2 && window.innerHeight / 2 < bottom
    // 最终结果
    return isHorizontalInView && isVerticalInView
  }

  const onScrollEnd = useCallback(debounce(() => {
    const videoEls = Array.from(document.querySelectorAll('video'))
    // 命中规则的视频
    const inViewVideoEls = videoEls.filter(el => isInView(el))
    if (inViewVideoEls.length > 0) {
      const ids = inViewVideoEls.map(el => el.getAttribute('data-video-id') || '')
      // reset旧视频
      const stopIds = playingIds.current.filter(id => !ids.includes(id))
      stopAll(stopIds)
      // 播放新视频
      playAll(ids)
    } else {
      // 找不到命中规则的，就播放之前的
      playAll(playingIds.current)
    }

    isScrolling.current = false
  }, 500), [])

  const onScroll = () => {
    if (!isScrolling.current) {
      pauseAll(playingIds.current)
    }
    isScrolling.current = true
    if (contentRef.current && offsetRef.current) {
      const { bottom: offsetBottom } = offsetRef.current?.getBoundingClientRect()
      // 下滑超过56px才做交互
      if (offsetBottom < 0) {
        const { top: newY } = contentRef.current.getBoundingClientRect() // 获取该元素的位置和大小信息
        const delta = newY - oldYRef.current
        oldYRef.current = newY
        // true隐藏 false显示
        setHidden(delta < 0)
      }
    }
    // 停下来超过500ms认为是 scroll end
    onScrollEnd()
  }
  const playAll = (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }
    playingIds.current = ids // 记录当前播放的id
    const selector = ids.map(id => `[data-video-id="${id}"]`).join(',')
    const videoEls: HTMLVideoElement[] = Array.from(document.querySelectorAll(selector))
    videoEls.forEach(el => el.play())
    // 挨个查找再操作慢，一起做
  }
  const stopAll = (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }
    const selector = ids.map(id => `[data-video-id="${id}"]`).join(',')
    const videoEls: HTMLVideoElement[] = Array.from(document.querySelectorAll(selector))
    videoEls.forEach(el => {
      el.pause()
      el.currentTime = 0 //进度条归0
    })
  }
  const pauseAll = (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }
    const selector = ids.map(id => `[data-video-id="${id}"]`).join(',')
    const videoEls: HTMLVideoElement[] = Array.from(document.querySelectorAll(selector))
    videoEls.forEach(el => el.pause())
  }

  useEffect(() => {
    const initVideoIds = dataSource.hot.list.slice(0, 2).map(item => item.id)
    playAll(initVideoIds)
  }, [])

  return (
    <div className={styles.app}>

      <header className={classNames(styles.header, hidden && styles.hidden)}>
        <NavBar title="首页" />
        <Tabs />
      </header>

      <div className={styles.scrollView} onScroll={onScroll}>
        <div ref={offsetRef} className={styles.line}></div>
        <img className={styles.banner} src={BannerImage} alt="BannerImage" />

        <div className={styles.content} ref={contentRef}>
          <h2>{dataSource.hot.title}</h2>
          <Category onScroll={onScroll} list={dataSource.hot.list} />

          <h2>{dataSource.live.title}</h2>
          <Category onScroll={onScroll} list={dataSource.live.list} />

          <h2>{dataSource.recommend.title}</h2>
          <Category onScroll={onScroll} list={dataSource.recommend.list} />
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
