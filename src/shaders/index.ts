import basic from './basic'
import book05 from './book-of-shaders-05'

export interface Shader {
  fragment: string
  vertex: string
}
export type ShaderName = keyof typeof shaders

export const shaders = {
  basic,
  book05,
} as const satisfies Record<string, Shader>

export default shaders
