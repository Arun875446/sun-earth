import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import GUI from "lil-gui";

// const gui = new GUI({
//   width: 300,
//   title: "cubeTweaks",
//   closeFolders: true,
// });
// gui.close();

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const debugObject = {
  color: "pink",
};

const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
material.thickness = 1;
material.ior = 1.5;
material.transmission = 1;
material.flatShading = true
material.color = new THREE.Color("#B9F2FF") // Diamonds are non-metallic
// material.roughness = 0; // Diamonds are highly polished (perfectly smooth)
// material.transmission = 1; // Fully transparent
// material.opacity = 1; // Visible but transparent
// material.ior = 2.42; // Index of refraction for diamond
// material.thickness = 1; // Thickness of the material
// material.clearcoat = 1; // Simulates a glossy surface
// (material.clearcoatRoughness = 0), // No roughness for the clear coat
//   (material.envMapIntensity = 1);

// material.transparent = true;
// material.opacity = 1;
material.side = THREE.DoubleSide;

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

// Create the mesh with yellow material
const diamondMesh = new THREE.Mesh(diamondGeometry, material);

// Add the diamond to the scene

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

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

window.addEventListener("resize", () => {
  (sizes.width = window.innerWidth), (sizes.height = window.innerHeight);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/roof.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

const pointLight = new THREE.PointLight(0xffffff, 2, 10);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

// const cubeTweaks = gui.addFolder("cubeTweaks");

// cubeTweaks.add(cube.position, "x").name("swiper").min(-3).max(3).step(0.01);
// cubeTweaks.add(cube.position, "y").name("elevate").min(-3).max(3).step(0.01);
// cubeTweaks.add(cube, "visible");
// cubeTweaks.add(cube.material, "wireframe");
// cubeTweaks.addColor(debugObject, "color").onChange(() => {
//   cube.material.color.set(debugObject.color);
// });

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  diamondMesh.rotation.y = elapsedTime * 2;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
