
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from "gsap";


import '../styles.css';

const scene = new THREE.Scene();

// create our sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial( {
  color: '#00ff83',
  roughness: 0.5,
} )

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// sizes
const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

// light
const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.intensity= 1.25 
light.position.set( 0, 10, 10 );
scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)



// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

// OrbitControls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

window.addEventListener('resize', ()=>{
  // console.log(window.innerWidth)
  // update sizes
  size.width = window.innerWidth
  size.height = window.innerHeight
// updates camera
  camera.aspect = size.width/size.height
  camera.updateProjectionMatrix()
  renderer.setSize(size.width, size.height)
})


const loop = ()=>{
  controls.update(); 
  renderer.render(scene,camera )
  window.requestAnimationFrame(loop)
}

loop()

// timeline
const tl = gsap.timeline({defaults: { duration: 1 }})
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z: 1, x: 1, y: 1})
tl.fromTo('nav', {y: '-100%'},{y: '0%'} )
tl.fromTo('.title', {opacity: '0'} , {opacity: '1'})

// mouse animation
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

// window.addEventListener("mousemove", (e) => {
//   if(mouseDown){
//     rgb = [
//       Math.round(e.pageX / size.width * 255 ),
//       Math.round(e.pageY / size.height * 255),
//       150,
//     ]
//     // lets animate
//     let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
//     // new THREE.Color(`rgb(12, 123, 150)`) //this is how above is interpreted
//     gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b}) 
//   }
// })

// touch movement and mouse movement both

function updateColor(pageX, pageY){
  rgb = [
    Math.round(pageX / size.width * 255),
    Math.round(pageY / size.height * 255),
    150,
  ]

  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
  gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b});

}

window.addEventListener('mousemove', (e)=>{
  if(mouseDown){
    updateColor(e.pageX, e.pageY)
  }
})

window.addEventListener('touchstart', (e)=>{
  e.preventDefault()
  mouseDown = true;
  const touch = e.touches[0]
  updateColor()
})

