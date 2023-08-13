import React, { useCallback, useMemo, useState } from 'react'
import { LoadedModelConfig, addShaderMaterial } from '../examples/threejs/utils'
import { ShaderName, shaders } from '../shaders'
import { useRouter } from 'next/router'

export interface ThreeSceneProps {
  applyShader?: boolean
  load: (
    container: HTMLElement,
    processModel?: (model: THREE.Object3D) => void,
  ) => Promise<LoadedModelConfig>
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ load }) => {
  const { shader: defaultShader } = useRouter().query as { shader?: ShaderName }
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [shaderName, setShaderName] = useState<ShaderName | ''>(
    defaultShader ?? '',
  )
  const [config, setConfig] = useState<LoadedModelConfig | null>(null)
  const [action, setAction] = useState<string>()

  console.log(action, defaultShader)
  React.useEffect(() => {
    let dispose: () => void

    const timeout = setTimeout(async () => {
      const config = await load(
        containerRef.current!,
        shaderName ? addShaderMaterial(shaders[shaderName]) : undefined,
      )
      dispose = config.dispose
      setConfig(config)
    }, 0)

    return () => {
      clearTimeout(timeout)
      dispose?.()
    }
  }, [load, shaderName])

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

  const onShaderNameChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setShaderName(event.currentTarget.value as typeof shaderName)
    },
    [],
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
      <select value={shaderName} onChange={onShaderNameChange}>
        <option value="">- Shader -</option>
        {Object.entries(shaders).map(([key]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <div ref={containerRef} style={{ width: 400, height: 400 }}></div>
    </>
  )
}

export default ThreeScene
