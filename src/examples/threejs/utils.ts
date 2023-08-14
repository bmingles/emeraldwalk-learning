import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { World } from './World'
import { ProcessModelFn } from '../../models'

export function addAxisHelper(scene: THREE.Scene) {
  const axisHelper = new THREE.AxesHelper(5)
  scene.add(axisHelper)
}

export function addGridHelper(scene: THREE.Scene) {
  const gridHelper = new THREE.GridHelper(20, 20)
  // gridHelper.position.setX(-0.5)
  // gridHelper.position.setY(-0.5)
  // gridHelper.rotateX(Math.PI / 2)
  scene.add(gridHelper)
}

export function addLights(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  // const ambientLight = new THREE.HemisphereLight('white', 'darkslategrey', 5)
  // const mainLight = new THREE.DirectionalLight('white', 4)
  // mainLight.position.set(10, 10, 10)
  // scene.add(ambientLight, mainLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  const pointLight = new THREE.PointLight(0xffffff, 0.6)
  camera.add(pointLight)

  scene.add(ambientLight, camera)
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

export interface LoadedModelConfig {
  actions: Record<string, THREE.AnimationAction>
  dispose: () => void
}

export function createLoadModel({
  modelUrl,
  cameraPosition: [x, y, z],
  cameraLookAt,
}: {
  modelUrl?: string
  cameraPosition: [number, number, number]
  cameraLookAt?: [number, number, number]
}) {
  return async function loadModel(
    container: HTMLElement,
    processModel?: ProcessModelFn,
  ): Promise<LoadedModelConfig> {
    const world = new World(container)
    world.camera.position.set(x, y, z)

    let model: THREE.Object3D | null = null
    let actions: Record<string, THREE.AnimationAction> = {}
    let mixer: THREE.AnimationMixer | null = null

    if (modelUrl) {
      const isFBX = modelUrl.endsWith('.fbx')

      const loader = isFBX ? new FBXLoader() : new GLTFLoader()

      const file = await loader.loadAsync(modelUrl)
      model = isFBX ? (file as THREE.Group) : (file as GLTF).scene.children[0]
      // model.scale.set(0.01, 0.01, 0.01)

      const clip = file.animations[0] //.find((a) => a.name === 'Walk')
      mixer = new THREE.AnimationMixer(model)

      actions = file.animations.reduce((memo, clip) => {
        memo[clip.name] = mixer!.clipAction(clip)
        return memo
      }, {} as Record<string, THREE.AnimationAction>)
    } else {
      const geometry = new THREE.PlaneGeometry(2, 2)
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
      })
      model = new THREE.Mesh(geometry, material)
      model.rotateX(-Math.PI / 2)
    }

    const processModelUpdater = processModel?.(world.renderer.domElement, model)

    world.scene.add(model)
    console.log('model:', model)

    // Lights
    addAxisHelper(world.scene)
    addGridHelper(world.scene)
    addLights(world.scene, world.camera)
    addOrbitControls(
      world.camera,
      world.renderer.domElement,
      cameraLookAt
        ? new THREE.Vector3(cameraLookAt[0], cameraLookAt[1], cameraLookAt[2])
        : undefined,
    )

    if (cameraLookAt) {
      const [x, y, z] = cameraLookAt
      world.camera.lookAt(x, y, z)
    }

    world.start([mixer, processModelUpdater])

    return {
      actions,
      dispose: world.dispose,
    }
  }
}
