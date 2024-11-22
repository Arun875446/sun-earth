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

const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
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

// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// const material = new THREE.MeshStandardMaterial();
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
material.thickness = 1;
material.ior = 1.5;
material.transmission = 1;

// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity =1.5

// material.matcap = matcapTexture;
// material.map = doorColorTexture;
// material.color = new THREE.Color("pink");
// material.flatShading = true;
material.transparent = true;
material.opacity = 1;
material.side = THREE.DoubleSide;

// const ambientLight = new THREE.AmbientLight("pink",2)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight("blue", 30)
// scene.add(pointLight)

const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const sphereMaterial = material;
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = -1.5;

const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = material;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);
const torusMaterial = material;
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

torus.position.x = 1.5;

const group = new THREE.Group();
group.add(sphere, plane, torus);

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
controls.enablePan = true;

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

// const cubeTweaks = gui.addFolder("cubeTweaks");

// cubeTweaks.add(cube.position, "x").name("swiper").min(-3).max(3).step(0.01);
// cubeTweaks.add(cube.position, "y").name("elevate").min(-3).max(3).step(0.01);
// cubeTweaks.add(cube, "visible");
// cubeTweaks.add(cube.material, "wireframe");
// cubeTweaks.addColor(debugObject, "color").onChange(() => {
//   cube.material.color.set(debugObject.color);
// });

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
