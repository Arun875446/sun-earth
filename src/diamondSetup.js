import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import GUI from "lil-gui";

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const diamondGeometry = new THREE.BufferGeometry();

// Vertices for a basic diamond shape (in 3D space)
const vertices = new Float32Array([
  0,
  1,
  0, // Top vertex (apex)
  -0.5,
  0,
  0.5, // Bottom front-left
  0.5,
  0,
  0.5, // Bottom front-right
  0.5,
  0,
  -0.5, // Bottom back-right
  -0.5,
  0,
  -0.5, // Bottom back-left
  0,
  -1,
  0, // Bottom vertex (point)
]);

// Faces defined by vertices indices (triangular facets)
const indices = [
  // Top facets
  0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1,

  // Bottom facets
  5, 2, 1, 5, 3, 2, 5, 4, 3, 5, 1, 4,
];

// Set up geometry attributes
diamondGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(vertices, 3)
);
diamondGeometry.setIndex(indices);
diamondGeometry.computeVertexNormals();

const material = new THREE.MeshBasicMaterial();

const diamondMesh = new THREE.Mesh(diamondGeometry, material);

const group = new THREE.Group();
group.add(diamondMesh);

scene.add(group);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.lookAt(group.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  (sizes.width = window.innerWidth), (sizes.height = window.innerHeight);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const clock = new THREE.Clock();
const tick = () => {
  const elapsed = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
