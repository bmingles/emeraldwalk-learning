export type DeltaHandler = (delta: number) => void
export type ProcessModelFn = (
  container: HTMLCanvasElement,
  object: THREE.Object3D,
) => { update?: DeltaHandler }
