import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  LoadedModelConfig,
  addGridHelper,
  addLights,
  addOrbitControls,
  createTickers,
} from './utils'
import { World } from './World'

export async function loadScene(
  container: HTMLElement,
): Promise<LoadedModelConfig> {
  const world = new World(container)
  world.camera.position.set(0, 1.5, 6.5)

  const loader = new GLTFLoader()

  // Soldier
  const soldierGLTF = await loader.loadAsync(
    '/assets/quaternius/Character_Soldier.gltf',
  )
  const model = soldierGLTF.scene.children[0]
  const clip = soldierGLTF.animations.find((a) => a.name === 'Walk')
  const mixer = new THREE.AnimationMixer(model)
  const action = mixer.clipAction(clip!)
  action.play()
  world.scene.add(model)

  console.log('soldier:', soldierGLTF)
  console.log(clip)

  // Lights
  addGridHelper(world.scene)
  addLights(world.scene, world.camera)
  addOrbitControls(world.camera, world.renderer.domElement)

  world.start(createTickers(mixer))

  return {
    actions: { [clip!.name]: action },
    dispose: world.dispose,
  }
}
