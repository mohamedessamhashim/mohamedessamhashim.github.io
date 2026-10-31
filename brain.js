// The chrome brain. Loaded on demand, after first paint, on devices that can run it.
import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

// Softboxes around the subject: [width, height, intensity, position, look-at target].
// Sharp shapes on black are what make metal read as chrome rather than grey plastic.
const SOFTBOXES = [
  [13, 4, 8, [-1.5, 7, 0.5], [0, 0, 0]],      // overhead key, pushed left so the right side falls away
  [1.8, 12, 6.5, [-7.5, 1, 4], [0, 0, 0]],    // left strip
  [0.9, 12, 3.2, [7.5, 1.5, 1], [0, 0, 0]],   // thin right strip
  [8, 0.8, 0.9, [0, -2.5, 8], [0, 0, 0]],     // low front fill
  [12, 2.4, 4, [1, 2.5, -8], [0, 0, 0]],      // rear rim
];

function buildStudio() {
  const studio = new Scene();
  const room = new Mesh(new BoxGeometry(24, 24, 24), new MeshBasicMaterial({ color: 0x020202, side: BackSide }));
  studio.add(room);
  for (const [width, height, intensity, position, target] of SOFTBOXES) {
    const panel = new Mesh(
      new PlaneGeometry(width, height),
      new MeshBasicMaterial({ color: new Color().setScalar(intensity), side: BackSide, toneMapped: false }),
    );
    panel.position.set(...position);
    panel.lookAt(...target);
    panel.rotateY(Math.PI);
    studio.add(panel);
  }
  return studio;
}

// Hands control back to the browser between the slow steps, so start-up never blocks the page.
const nextTask = () => new Promise((resolve) => { setTimeout(resolve); });

export const POSE = {
  yaw: 1.05,     // mostly lateral, the profile people read as "brain" at a glance
  pitch: -0.1,
  roll: 0.05,
};

export async function createBrain({ canvas, modelUrl, pixelRatio, preserveDrawingBuffer = false }) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setPixelRatio(pixelRatio);

  const scene = new Scene();
  const camera = new PerspectiveCamera(26, 1, 0.1, 30);
  camera.position.set(0, 0, 5.4);

  const pmrem = new PMREMGenerator(renderer);
  const studio = buildStudio();
  scene.environment = pmrem.fromScene(studio, 0.025).texture;
  pmrem.dispose();
  await nextTask();

  const material = new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.2,
    vertexColors: true,
    envMapIntensity: 1,
  });

  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(modelUrl);
  await nextTask();
  const mesh = gltf.scene.getObjectByProperty('isMesh', true);
  mesh.material = material;

  const pivot = new Group();
  pivot.add(gltf.scene);
  scene.add(pivot);

  const pose = { yaw: POSE.yaw, pitch: POSE.pitch, roll: POSE.roll };
  let currentRatio = pixelRatio;

  function setSize(size) {
    renderer.setSize(size, size, false);
  }

  function render() {
    pivot.rotation.set(pose.pitch, pose.yaw, pose.roll, 'XYZ');
    renderer.render(scene, camera);
  }

  function setPixelRatio(next) {
    if (next === currentRatio) return;
    currentRatio = next;
    renderer.setPixelRatio(next);
  }

  function dispose() {
    material.dispose();
    mesh.geometry.dispose();
    scene.environment?.dispose();
    renderer.dispose();
  }

  // Compile before the first visible frame so the canvas fade-in never hitches.
  await renderer.compileAsync(scene, camera);
  await nextTask();

  return {
    pose,
    material,
    render,
    setSize,
    setPixelRatio,
    dispose,
    get pixelRatio() { return currentRatio; },
  };
}
