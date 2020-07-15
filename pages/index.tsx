import { useRef, useEffect, useState } from "react"
import { work } from "./ocr"

const getRects = (width, height, box) => {
  return box
    .split("\n")
    .map((l) => {
      if (l === "") {
        return null
      }
      const [char, x1, y1, x2, y2] = l.split(" ")
      return {
        char,
        x: Number(x1),
        y: height - Number(y2),
        w: Number(x2) - Number(x1),
        h: Number(y2) - Number(y1),
      }
    })
    .filter((x) => !!x)
}

const Box = ({ imgUrl, box }) => {
  const imgRef = useRef(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onLoad = () => {
    console.log(imgRef.current?.width)
    if (!imgRef.current || !canvasRef.current || imgRef.current.width < 1) {
      return
    }
    const { width, height } = imgRef.current
    console.log(imgRef.current, width, height)
    canvasRef.current.width = width
    canvasRef.current.height = height
    const ctx = canvasRef.current.getContext("2d")
    ctx.drawImage(imgRef.current, 0, 0)
    ctx.font = "１0px sans-serif"
    const rects = getRects(width, height, box)
    rects.map((r) => {
      const { x, y, w, h } = r
      ctx.strokeStyle = "blue"
      ctx.strokeRect(x, y, w, h)
    })

    ctx.fillStyle = "red"
    rects.map((r) => {
      const { x, y, w, h, char } = r
      ctx.fillText(char, x + w / 2, y + h / 2)
    })
  }
  // , [box, imgUrl, imgRef.current, imgRef.current?.width])
  return (
    <div className="container">
      <h1>OCR</h1>
      <main></main>
      <img
        ref={imgRef}
        src={imgUrl}
        style={{ maxWidth: "50vw", maxHeight: "50vh" }}
        onLoad={onLoad}
      />
      <canvas
        ref={canvasRef}
        style={{ maxWidth: "50vw", maxHeight: "50vh" }}
      ></canvas>
    </div>
  )
}
export default function Home() {
  const [box, setBox] = useState<string>("")
  const [urlRaw, setUrlRaw] = useState<string>()
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [isProcessing, setProsessing] = useState(false)
  const [latestLog, setLog] = useState()
  useEffect(() => {
    setUrl(`/api/proxy?url=${urlRaw}`)
  }, [urlRaw])
  const start = () => {
    setProsessing(true)
    work(url, (log) => {
      console.log(log)
      setLog(
        // @ts-ignore
        JSON.stringify({
          status: log.status,
          progress: Math.ceil(Number(log.progress) * 10000) / 100,
        })
      )
    })
      .then((result) => {
        console.log(result.data)
        console.log(result.data.text)
        setBox(result.data.box)
        setText(result.data.text)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  return (
    <div>
      <input
        placeholder="画像URLを入れてね"
        disabled={isProcessing}
        value={urlRaw}
        onChange={(e) => setUrlRaw(e.target.value)}
      />
      <button onClick={() => start()} disabled={isProcessing}>
        Start
      </button>
      {isProcessing && <div>解析中</div>}
      <div>{latestLog}</div>
      {url && box && <Box box={box} imgUrl={urlRaw} />}
      <pre>{text}</pre>
    </div>
  )
}
