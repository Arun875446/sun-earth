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

const earth = gui.addFolder("earth");
const sun = gui.addFolder("sun");

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const earthTexture = textureLoader.load("./textures/door/earth.jpg");
earthTexture.colorSpace = THREE.SRGBColorSpace;
const sunTexture = textureLoader.load("./textures/door/sun.jpg");
sunTexture.colorSpace = THREE.SRGBColorSpace;
const fabTexture = textureLoader.load("./textures/door/fabric.jpg");

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshPhysicalMaterial();

material.map = earthTexture;
material.metalness = 0;
material.roughness = 0;
material.thickness = 1;
material.ior = 1;
material.transmission = 0;


const sphereMaterial = material;

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

const sunsphereMaterial = new THREE.MeshPhysicalMaterial();

const sunSphere = new THREE.Mesh(sphereGeometry, sunsphereMaterial);

sunsphereMaterial.map = sunTexture;
// sunsphereMaterial.color = new THREE.Color("redOrange")
sunsphereMaterial.transmission = 0;
sunSphere.position.x = 0;
sphere.position.x = 1.75;
sphere.scale.set(0.7, 0.7, 0.7);

const group = new THREE.Group();
group.add(sphere, sunSphere);

scene.add(group);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 2;

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

earth.add(material, "transmission").min(0).max(1).step(0.0001);
earth.add(material, "ior").min(1).max(10).step(0.0001);
earth.add(material, "thickness").min(0).max(1).step(0.0001);

sun.add(sunsphereMaterial, "transmission").min(0).max(1).step(0.0001);
sun.add(sunsphereMaterial, "ior").min(1).max(10).step(0.0001);
sun.add(sunsphereMaterial, "thickness").min(0).max(1).step(0.0001);

const ambientLight = new THREE.AmbientLight("0*ffffff", 3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("0*ffffff", 3);
scene.add(pointLight);
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/roof.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = elapsedTime * 2;
  sunSphere.rotation.y = -elapsedTime * 2;

  sphere.position.x = Math.sin(elapsedTime) * 1.25;
  sphere.position.z = Math.cos(elapsedTime) * 1;
  camera.position.x = Math.sin(elapsedTime) * 2.25;
  camera.position.z = -Math.cos(elapsedTime) * 2;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
