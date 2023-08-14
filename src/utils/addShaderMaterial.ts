import * as THREE from 'three'
import { ShaderConfig } from '../models'
import { DeltaHandler, ProcessModelFn } from '../models'

export function addShaderMaterial({
  fragment,
  vertex,
}: ShaderConfig): ProcessModelFn {
  return (
    canvas: HTMLCanvasElement,
    object: THREE.Object3D,
  ): { update?: DeltaHandler } => {
    const uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2() },
      u_mouse: { type: 'v2', value: new THREE.Vector2() },
    }

    uniforms.u_resolution.value.x = canvas.width
    uniforms.u_resolution.value.y = canvas.height

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      fragmentShader: fragment,
      vertexShader: vertex,
    })

    object.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.material = shaderMaterial
      }
    })

    const update = (delta: number) => {
      uniforms.u_time.value += delta
    }

    return {
      update,
    }
  }
}
