import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { World } from './World'

export type DeltaHandler = (delta: number) => void

export function addGridHelper(scene: THREE.Scene) {
  const gridHelper = new THREE.GridHelper(20, 20)
  // gridHelper.position.setX(-0.5)
  // gridHelper.position.setY(-0.5)
  // gridHelper.rotateX(Math.PI / 2)
  scene.add(gridHelper)
}

export function addLights(scene: THREE.Scene) {
  const ambientLight = new THREE.HemisphereLight('white', 'darkslategrey', 5)
  const mainLight = new THREE.DirectionalLight('white', 4)
  mainLight.position.set(10, 10, 10)
  scene.add(ambientLight, mainLight)
}

export function addOrbitControls(
  camera: THREE.Camera,
  domElement: HTMLElement,
  target?: THREE.Vector3,
) {
  const orbit = new OrbitControls(camera, domElement)
  if (target) {
    orbit.target.copy(target)
  }
}

export function createTickers(
  ...updaters: { update: DeltaHandler }[]
): { tick: DeltaHandler }[] {
  return updaters.map((u) => ({ tick: (delta) => u.update(delta) }))
}

export interface LoadedModelConfig {
  actions: Record<string, THREE.AnimationAction>
  dispose: () => void
}

export function createLoadModel({
  modelUrl,
  cameraPosition: [x, y, z],
}: {
  modelUrl: string
  cameraPosition: [number, number, number]
}) {
  return async function loadModel(
    container: HTMLElement,
  ): Promise<LoadedModelConfig> {
    const world = new World(container)
    world.camera.position.set(x, y, z)

    const isFBX = modelUrl.endsWith('.fbx')

    const loader = isFBX ? new FBXLoader() : new GLTFLoader()

    // Soldier
    const file = await loader.loadAsync(modelUrl)
    const model = isFBX
      ? (file as THREE.Group)
      : (file as GLTF).scene.children[0]
    // model.scale.set(0.01, 0.01, 0.01)

    const clip = file.animations[0] //.find((a) => a.name === 'Walk')
    const mixer = new THREE.AnimationMixer(model)

    const actions = file.animations.reduce((memo, clip) => {
      memo[clip.name] = mixer.clipAction(clip)
      return memo
    }, {} as Record<string, THREE.AnimationAction>)

    world.scene.add(model)

    console.log('gltf:', file)
    console.log(clip)

    // Lights
    addGridHelper(world.scene)
    addLights(world.scene)
    addOrbitControls(world.camera, world.renderer.domElement)

    world.start(createTickers(mixer))

    return {
      actions,
      dispose: world.dispose,
    }
  }
}
