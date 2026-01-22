import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 6, 25);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const treeGroup = new THREE.Group();
treeGroup.position.y = -2;
scene.add(treeGroup);

const loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");

const photoMeshes = [];
const twinklingObjects = [];

function createSmallPhoto(url) {
  const photoGroup = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(1.8, 1.8);
  const material = new THREE.MeshBasicMaterial({
    map: loader.load(url),
    side: THREE.DoubleSide,
  });
  const photo = new THREE.Mesh(geometry, material);
  photo.userData = { url: url };
  photoMeshes.push(photo);
  const border = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.9),
    new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
    }),
  );
  border.position.z = -0.01;
  photoGroup.add(photo, border);
  return photoGroup;
}

const photoLinks = [];
for (let i = 1; i <= 9; i++) {
  photoLinks.push(`style/img/Anh (${i}).jpg`);
}

const sweetMessages = [
  "Giáng sinh này, điều tuyệt vời nhất là bank em 5 củ! ✨",
  "Mỗi khoảnh khắc bên nhau đều phiền. ❤️",
  "Mỗi khoảnh khắc bên nhau đều phiền. ❤️",
  "Vui vẻ nhiều hơn mỗi ngày, Giáng sinh an lành nhé! 🎄",
  "Chúc người đẹp giáng sinh an lành nhé. 🥰",
];

photoLinks.forEach((url, i) => {
  const photo = createSmallPhoto(url);
  const y = (i / photoLinks.length) * 10 - 2;
  const radius = (20 - y) * 0.22;
  const angle = (i / photoLinks.length) * Math.PI * 2;
  photo.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
  photo.rotation.y = -angle;
  treeGroup.add(photo);
});

function createGlowObj(type = "ball", color = 0xff0000) {
  let geo =
    type === "ball"
      ? new THREE.SphereGeometry(0.25, 16, 16)
      : new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8);
  const mat = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 2,
  });
  const mesh = new THREE.Mesh(geo, mat);
  twinklingObjects.push(mesh);
  return mesh;
}

for (let i = 0; i < 60; i++) {
  const color = Math.random() > 0.5 ? 0xff3333 : 0xffd700;
  const obj = createGlowObj(Math.random() > 0.7 ? "lantern" : "ball", color);
  const y = Math.random() * 18;
  const radius = (20 - y) * 0.33;
  const theta = Math.random() * Math.PI * 2;
  obj.position.set(Math.cos(theta) * radius, y - 5, Math.sin(theta) * radius);
  treeGroup.add(obj);
}

function createTreePoints() {
  const count = 12000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const y = Math.random() * 20;
    const radius = (20 - y) * 0.35;
    const theta = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(theta) * radius * Math.pow(Math.random(), 0.6);
    pos[i * 3 + 1] = y - 5;
    pos[i * 3 + 2] = Math.sin(theta) * radius * Math.pow(Math.random(), 0.6);
    const c = new THREE.Color().setHSL(0.35, 0.8, 0.2 + Math.random() * 0.3);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    }),
  );
}
treeGroup.add(createTreePoints());

function createStar() {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 0.8 : 0.35;
    const a = (i / 10) * Math.PI * 2;
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
  const shape = new THREE.Shape(pts);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
  });
  const starMesh = new THREE.Mesh(
    geom,
    new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 5,
    }),
  );
  starMesh.position.y = 15;
  return starMesh;
}
const star = createStar();
treeGroup.add(star);

function createGift(size, color, ribbonColor) {
  const giftGroup = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(size, size, size);
  const boxMat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.5,
    metalness: 0.1,
  });
  const giftBox = new THREE.Mesh(boxGeo, boxMat);
  const ribbonWidth = size * 0.2;
  const ribbonHeight = size + 0.02;
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: ribbonColor,
    roughness: 0.3,
    metalness: 0.8,
  });
  const ribbon1 = new THREE.Mesh(
    new THREE.PlaneGeometry(ribbonWidth, ribbonHeight),
    ribbonMat,
  );
  ribbon1.rotation.y = Math.PI / 2;
  const ribbon2 = new THREE.Mesh(
    new THREE.PlaneGeometry(ribbonWidth, ribbonHeight),
    ribbonMat,
  );
  const bowRadius = size * 0.25;
  const bowGeo = new THREE.TorusGeometry(bowRadius, size * 0.04, 8, 16);
  const bow1 = new THREE.Mesh(bowGeo, ribbonMat);
  bow1.position.y = size / 2;
  bow1.rotation.x = Math.PI / 2;
  bow1.rotation.z = Math.PI / 4;
  const bow2 = bow1.clone();
  bow2.rotation.z = -Math.PI / 4;
  giftGroup.add(giftBox, ribbon1, ribbon2, bow1, bow2);
  return giftGroup;
}

const giftColors = [
  0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800,
  0xeeeeee,
];
const ribbonColors = [
  0xffd700, 0xffffff, 0x8800ff, 0xff69b4, 0x40e0d0, 0xff0000,
];

const numGifts = 100;
for (let i = 0; i < numGifts; i++) {
  const size = 0.5 + Math.random() * 0.8;
  const color = giftColors[Math.floor(Math.random() * giftColors.length)];
  const ribbonColor =
    ribbonColors[Math.floor(Math.random() * ribbonColors.length)];
  const gift = createGift(size, color, ribbonColor);
  const angle = Math.random() * Math.PI * 2;
  const radius = 2.0 + Math.random() * 7.5;
  gift.position.set(Math.cos(angle) * radius, -5, Math.sin(angle) * radius);
  gift.rotation.y = Math.random() * Math.PI * 2;
  gift.rotation.x = (Math.random() - 0.5) * 0.2;
  treeGroup.add(gift);
}

scene.add(new THREE.AmbientLight(0x404040));
const pointLight = new THREE.PointLight(0xffd700, 3, 25);
pointLight.position.set(0, 15, 0);
scene.add(pointLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

const snowCount = 2800;
const snowGeo = new THREE.BufferGeometry();
const snowPos = new Float32Array(snowCount * 3);
const snowVel = [];
for (let i = 0; i < snowCount; i++) {
  snowPos[i * 3] = (Math.random() - 0.5) * 60;
  snowPos[i * 3 + 1] = Math.random() * 40;
  snowPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
  snowVel.push({
    y: 0.06 + Math.random() * 0.1,
    x: (Math.random() - 0.5) * 0.02,
  });
}
snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPos, 3));
const snow = new THREE.Points(
  snowGeo,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    transparent: true,
    opacity: 0.8,
  }),
);
scene.add(snow);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 4.5;
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// XỬ LÝ SỰ KIỆN CHẠM/CLICK CHO ĐIỆN THOẠI
function checkIntersect(clientX, clientY) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(photoMeshes);
  if (intersects.length > 0) {
    const overlay = document.getElementById("fullscreen-overlay");
    const textElem = document.getElementById("sweet-text");
    overlay.querySelector("img").src = intersects[0].object.userData.url;
    textElem.innerText =
      sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
    overlay.style.display = "flex";
    setTimeout(() => overlay.classList.add("active"), 10);
  }
}

// Dùng touchend để mượt hơn trên điện thoại
window.addEventListener("touchend", (e) => {
  // Nếu người dùng đang vuốt để xoay (nhiều hơn 1 ngón hoặc vuốt xa), không mở ảnh
  if (e.changedTouches.length === 1) {
    checkIntersect(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }
});

window.addEventListener("click", (e) => {
  // Click vẫn dùng cho máy tính
  checkIntersect(e.clientX, e.clientY);
});

document
  .getElementById("fullscreen-overlay")
  .addEventListener("click", function () {
    this.classList.remove("active");
    setTimeout(() => (this.style.display = "none"), 300);
  });

const musicBtn = document.getElementById("music-control");
const audio = document.getElementById("bg-music");
musicBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Không kích hoạt sự kiện click ở window
  if (audio.paused) {
    audio.play();
    musicBtn.innerText = "⏸ Pause Music";
  } else {
    audio.pause();
    musicBtn.innerText = "▶ Play Music";
  }
});

function animate() {
  requestAnimationFrame(animate);
  const time = Date.now() * 0.001;
  star.rotation.y += 0.15;
  twinklingObjects.forEach((obj, i) => {
    obj.material.emissiveIntensity = 1 + Math.sin(time * 3 + i) * 2;
  });
  const positions = snow.geometry.attributes.position.array;
  for (let i = 0; i < snowCount; i++) {
    positions[i * 3 + 1] -= snowVel[i].y;
    positions[i * 3] += Math.sin(time + i) * 0.01;
    if (positions[i * 3 + 1] < -10) positions[i * 3 + 1] = 30;
  }
  snow.geometry.attributes.position.needsUpdate = true;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
