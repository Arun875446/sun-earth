import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import GUI from "lil-gui";

const gui = new GUI({
  width: 300,
  title: "tweaks",
  closeFolders: true,
});
gui.close();

const diamondtweaks = gui.addFolder("diamondtweaks");
const sphereTweaks = gui.addFolder("sphereTweaks");

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const fabTexture = textureLoader.load("./textures/door/fabric.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/8.png");
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");

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

// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
const material = new THREE.MeshPhysicalMaterial();
const material2 = new THREE.MeshPhysicalMaterial();
const materialTransparentSphere = new THREE.MeshPhysicalMaterial();

// material.map = doorColorTexture;
// material.matcap = matcapTexture;

material.color = new THREE.Color("lightBlue");
// material.opacity = 1;
// materialTransparentSphere.opacity = 1
// material.transparent = true;
// materialTransparentSphere.transparent = true
material.side = THREE.DoubleSide;
materialTransparentSphere.side = THREE.DoubleSide;
material.flatShading = true;

material.metalness = 0;
materialTransparentSphere.metalness = 0;
material.roughness = 0;
materialTransparentSphere.roughness = 0;

material.thickness = 1;
materialTransparentSphere.thickness = 1;
material.ior = 1.5;
materialTransparentSphere.ior = 6.5;
material.transmission = 1;
materialTransparentSphere.transmission = 1;
materialTransparentSphere.flatShading = false;

material2.map = fabTexture;
// material2.map = doorColorTexture;
// material2.aoMap = doorAmbientOcclusionTexture;
// material2.aoMapIntensity = 2;

const diamondMesh = new THREE.Mesh(diamondGeometry, material);

const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const sphereMaterial = materialTransparentSphere;
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

const sphere2 = new THREE.Mesh(sphereGeometry, material2);

const group = new THREE.Group();
group.add(diamondMesh, sphere, sphere2);

scene.add(group);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 2.7;
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

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/roof.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

// const ambientLight = new THREE.AmbientLight("lightBlue", 3);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight("magenta", 30);
// scene.add(pointLight);

sphere.position.x = -1.5;
sphere2.position.x = 1.5;

diamondtweaks.add(material, "transmission").min(0).max(1).step(0.0001);
diamondtweaks.add(material, "ior").min(1).max(10).step(0.0001);
diamondtweaks.add(material, "thickness").min(0).max(1).step(0.0001);

sphereTweaks
  .add(materialTransparentSphere, "transmission")
  .min(0)
  .max(1)
  .step(0.0001);
sphereTweaks.add(materialTransparentSphere, "ior").min(1).max(10).step(0.0001);
sphereTweaks
  .add(materialTransparentSphere, "thickness")
  .min(0)
  .max(1)
  .step(0.0001);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  diamondMesh.rotation.y = elapsedTime * 2;
  sphere.rotation.y = elapsedTime * 2;
  sphere2.rotation.y = elapsedTime * 2;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
