import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export type ShaderName = keyof typeof shaders

export const shaders = {
  basic: {
    fragment: fragmentShader,
    vertex: vertexShader,
  },
} as const

export default shaders
