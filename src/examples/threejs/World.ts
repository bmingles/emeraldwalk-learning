import * as THREE from 'three'
import { DeltaHandler } from './utils'

export class World {
  constructor(container: HTMLElement) {
    this.clock = new THREE.Clock()
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    )
    // this.camera.position.set(-1.5, 1.5, 6.5)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('skyblue')

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.append(this.renderer.domElement)
  }

  clock: THREE.Clock
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer

  start = (tickers?: { tick: DeltaHandler }[]) => {
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta()
      tickers?.forEach((ticker) => {
        ticker.tick(delta)
      })
      this.renderer.render(this.scene, this.camera)
    })
  }

  stop = () => {
    this.renderer.setAnimationLoop(null)
  }

  dispose = () => {
    this.renderer.setAnimationLoop(null)
    this.renderer.domElement.remove()
  }
}
