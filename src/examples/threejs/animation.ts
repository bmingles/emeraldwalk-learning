import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { World } from './World'
import {
  LoadedModelConfig,
  addGridHelper,
  addLights,
  addOrbitControls,
  createTickers,
} from './utils'

export async function loadScene(
  container: HTMLElement,
  processModel?: (model: THREE.Object3D) => void,
): Promise<LoadedModelConfig> {
  const world = new World(container)
  world.camera.position.set(-1.5, 1.5, 6.5)

  const loader = new GLTFLoader()

  const cubeGeometry = new THREE.BoxGeometry(1, 1)
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  world.scene.add(cube)

  // parrot
  const parrotData = await loader.loadAsync('/assets/threejs/Parrot.glb')
  const parrotModel = parrotData.scene.children[0]
  processModel?.(parrotModel)
  const parrotClip = parrotData.animations[0]
  const parrotMixer = new THREE.AnimationMixer(parrotModel)
  const parrotAction = parrotMixer.clipAction(parrotClip)
  parrotAction.play()
  parrotModel.position.set(0, 0, 2.5)
  console.log('parrotData:', parrotData)

  world.scene.add(parrotModel)

  // Lights
  addGridHelper(world.scene)
  addLights(world.scene, world.camera)
  addOrbitControls(
    world.camera,
    world.renderer.domElement,
    parrotModel.position,
  )

  // animation
  const moveAndBlinkClip = createMoveAndBlinkClip()
  const mixer = new THREE.AnimationMixer(cube)
  const action = mixer.clipAction(moveAndBlinkClip)
  // action.play()

  world.start(createTickers(mixer, parrotMixer))

  return {
    actions: { [moveAndBlinkClip.name]: action },
    dispose: world.dispose,
  }
}

function createMoveAndBlinkClip() {
  const positionKFT = new THREE.VectorKeyframeTrack(
    '.position',
    [0, 3, 6],
    [0, 0, 0, 2, 2, 2, 0, 0, 0],
  )

  const opacityKFT = new THREE.NumberKeyframeTrack(
    '.material.opacity',
    [0, 1, 2, 3, 4, 5, 6],
    [0, 1, 0, 1, 0, 1, 0],
  )

  return new THREE.AnimationClip('moveAndBlink', -1, [positionKFT, opacityKFT])
}
