import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const loader = new THREE.TextureLoader()

// const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
const sphere = getSphereObject(material)

const plane = getPlaneObject(material)
plane.position.x = -1

const torus = getTorusObject(material)
torus.position.x = 1


function getSphereObject(material) {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)

    return new THREE.Mesh(sphereGeometry, material)
}

function getTorusObject(material) {
    const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32)

    return new THREE.Mesh(torusGeometry, material)
}

function getPlaneObject(material) {
    const planeGeometry = new THREE.PlaneGeometry(1, 1)

    return new THREE.Mesh(planeGeometry, material)
}

scene.add(plane, sphere, torus)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', handleResize)

function handleResize() {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

function tick() {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    torus.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    sphere.rotation.x = 0.15 * elapsedTime

    torus.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    sphere.rotation.y = 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()