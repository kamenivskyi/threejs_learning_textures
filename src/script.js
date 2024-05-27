import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import dat from 'dat.gui'

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


/**
 * Textures
 */
const loader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorAlphaTexture = loader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = loader.load('/textures/door/ambientOcclusion.jpg')
const doorColorTexture = loader.load('/textures/door/color.jpg')
const doorHeightTexture = loader.load('/textures/door/height.jpg')
const doorMetalnessTexture = loader.load('/textures/door/metalness.jpg')
const doorNormalTexture = loader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = loader.load('/textures/door/roughness.jpg')
const matcapTexture = loader.load('/textures/matcaps/8.png')

const envMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/4/px.png',
    '/textures/environmentMaps/4/nx.png',
    '/textures/environmentMaps/4/py.png',
    '/textures/environmentMaps/4/ny.png',
    '/textures/environmentMaps/4/pz.png',
    '/textures/environmentMaps/4/nz.png',
])

// const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture })

// const material = new THREE.MeshMatcapMaterial()
// material.gradientMap = gradientTexture
// material.matcap = matcapTexture

// material.shininess = 100
// material.specular = new THREE.Color('red')
// const material = new THREE.MeshToonMaterial()

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 2
scene.add(pointLight)

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.45
// material.roughness = 0.65
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.05, 0.05)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 1
material.roughness = 0

material.envMap = envMapTexture

const gradientTexture = loader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false


// const material = new THREE.MeshDepthMaterial()
// material.flatShading = true
// material.color.set('cyan')
// material.wireframe = true
// material.opacity = 0.3
// material.transparent = true
// material.side = THREE.DoubleSide
material.alphaMap = doorAlphaTexture

const sphere = getSphereObject(material)

const plane = getPlaneObject(material)
plane.position.x = -1

const torus = getTorusObject(material)
torus.position.x = 2


function getSphereObject(material) {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const sphere = new THREE.Mesh(sphereGeometry, material)

    sphere.geometry.setAttribute(
        'uv2', 
        new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    )

    return sphere
}

function getPlaneObject(material) {
    const planeGeometry = new THREE.PlaneGeometry(1, 1)
    const plane = new THREE.Mesh(planeGeometry, material)

    plane.geometry.setAttribute('uv2', 
        new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    )

    return plane
}

function getTorusObject(material) {
    const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32)
    const torus = new THREE.Mesh(torusGeometry, material)
    torus.geometry.setAttribute(
        'uv2', 
        new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
    )

    return torus
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
 * Debug UI
 */
const gui = new dat.GUI()
gui.width = 400
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(1).max(10).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

/**
 * Animate
 */
const clock = new THREE.Clock()

function tick() {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // torus.rotation.x = 0.15 * elapsedTime
    // plane.rotation.x = 0.15 * elapsedTime
    // sphere.rotation.x = 0.15 * elapsedTime

    // torus.rotation.y = 0.1 * elapsedTime
    // plane.rotation.y = 0.1 * elapsedTime
    // sphere.rotation.y = 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()