import React, { useCallback } from 'react'
import { LoadedModelConfig, addShaderMaterial } from '../examples/threejs/utils'

export interface ThreeSceneProps {
  applyShader?: boolean
  load: (
    container: HTMLElement,
    processModel?: (model: THREE.Object3D) => void,
  ) => Promise<LoadedModelConfig>
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ load }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [applyShader, setApplyShader] = React.useState(false)
  const [config, setConfig] = React.useState<LoadedModelConfig | null>(null)
  const [action, setAction] = React.useState<string>()
  console.log(action)
  React.useEffect(() => {
    let dispose: () => void

    const timeout = setTimeout(async () => {
      const config = await load(
        containerRef.current!,
        applyShader ? addShaderMaterial : undefined,
      )
      dispose = config.dispose
      setConfig(config)
    }, 0)

    return () => {
      clearTimeout(timeout)
      dispose?.()
    }
  }, [applyShader, load])

  const hasActions = Object.keys(config?.actions ?? {}).length > 0

  const onToggleApplyShader = useCallback(() => {
    setApplyShader((a) => !a)
  }, [])

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
      <input
        id="apply-shader"
        type="checkbox"
        checked={applyShader}
        onChange={onToggleApplyShader}
      />
      <label htmlFor="apply-shader">Apply Shader</label>
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
