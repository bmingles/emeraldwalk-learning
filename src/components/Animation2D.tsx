import React from 'react'
import cl from 'classnames'

export interface Animation2DProps {
  className?: string
  frames: Record<string, string[]>
}

const Animation2D: React.FC<Animation2DProps> = ({ className, frames }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [action, setAction] = React.useState<string>(Object.keys(frames)[0])
  const images = React.useMemo(() => loadFrameImages(frames), [frames])
  const timeoutRef = React.useRef(0)

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    images.then((images) => {
      let i = 0
      function draw() {
        if (!action) {
          return
        }

        ctx!.clearRect(0, 0, 256, 256)
        ctx!.drawImage(images[action][i], 0, 0, 256, 256)
        i = (i + 1) % images[action].length

        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => {
          window.requestAnimationFrame(draw)
        }, 1000 / 8)
      }

      window.requestAnimationFrame(draw)
    })

    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [action, images])

  const onActionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newAction = event.currentTarget.value
      setAction(newAction)
    },
    [],
  )

  const hasActions = Object.keys(frames).length > 0

  return (
    <div className={cl(className)}>
      {hasActions && (
        <select value={action} onChange={onActionChange}>
          <option value="">- Action -</option>
          {Object.entries(frames).map(([key]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      )}
      <canvas ref={canvasRef} width={256} height={256}></canvas>
    </div>
  )
}

export default Animation2D

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = src

    function onLoad() {
      img.removeEventListener('load', onLoad)
      resolve(img)
    }

    img.addEventListener('load', onLoad)
  })
}

async function loadFrameImages(
  frames: Record<string, string[]>,
): Promise<Record<string, HTMLImageElement[]>> {
  const imagePromises: Record<string, Promise<HTMLImageElement>[]> = {}

  for (const key in frames) {
    imagePromises[key] = frames[key].map(loadImage)
  }

  const images: Record<string, HTMLImageElement[]> = {}

  for (const key in imagePromises) {
    images[key] = await Promise.all(imagePromises[key])
  }

  return images
}
