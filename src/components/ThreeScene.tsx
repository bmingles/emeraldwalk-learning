import React from 'react'
import { LoadedModelConfig } from '../examples/threejs/utils'

export interface ThreeSceneProps {
  load: (container: HTMLElement) => Promise<LoadedModelConfig>
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ load }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [config, setConfig] = React.useState<LoadedModelConfig | null>(null)
  const [action, setAction] = React.useState<string>()

  React.useEffect(() => {
    let dispose: () => void

    const timeout = setTimeout(async () => {
      const config = await load(containerRef.current!)
      dispose = config.dispose
      setConfig(config)
    }, 0)

    return () => {
      clearTimeout(timeout)
      dispose?.()
    }
  }, [load])

  const hasActions = Object.keys(config?.actions ?? {}).length > 0

  const onActionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newAction = event.currentTarget.value

      if (action) {
        config?.actions[action]?.stop()
      }

      if (newAction) {
        config?.actions[newAction]?.play()
      }

      setAction(newAction)
    },
    [action, config?.actions],
  )

  return (
    <>
      {hasActions && (
        <select value={action} onChange={onActionChange}>
          <option>- Action -</option>
          {Object.entries(config?.actions ?? {}).map(([key]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      )}
      <div ref={containerRef} style={{ width: 400, height: 400 }}></div>
    </>
  )
}

export default ThreeScene
