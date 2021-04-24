import logo from './logo.svg'
import './App.css'
// import scene from './assets/scene.gltf'
import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import ModelViewer from 'react-model-viewer'
import model from './assets/scene.gltf'
import texture from './assets/texture.jpg'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import Tree from './tree1.js'

// import './Tree.js'
// import './TreeGeometry.js'
// import './TreeHelper.js'

function box () {
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  var renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  var geometry = new THREE.BoxGeometry(1, 1, 1)
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  var cube = new THREE.Mesh(geometry, material)
  // scene.add(cube)
  camera.position.z = 5
  var animate = function () {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()
}
// tree()
function tree () {
  var scene, camera, renderer, geometry, group

  init()
  render()

  function init () {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    geometry = new THREE.CylinderGeometry(1, 1, 1, 25)

    const texture1 = new THREE.TextureLoader().load(texture)
    var leaveDarkMaterial = new THREE.MeshLambertMaterial({
      //   color: 0xffffff,
      map: texture1
    })

    var leaveLightMaterial = new THREE.MeshLambertMaterial({
      //   color: 0xa2ff7a,
      map: texture1
    })
    var leaveDarkDarkMaterial = new THREE.MeshLambertMaterial({
      //   color: 0x71b356,
      map: texture1
    })
    var stemMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })

    var light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 0, 1)
    scene.add(light)

    var light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 0, 0)
    scene.add(light)

    var light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 1, 0)
    scene.add(light)

    var stem = new THREE.Mesh(geometry, stemMaterial)
    stem.position.set(0, 0, 0)
    stem.scale.set(0.3, 1.5, 0.3)

    var squareLeave01 = new THREE.Mesh(geometry, leaveDarkMaterial)
    squareLeave01.position.set(0.5, 1.6, 0.5)
    squareLeave01.scale.set(0.8, 0.8, 0.8)

    var squareLeave02 = new THREE.Mesh(geometry, leaveDarkMaterial)
    squareLeave02.position.set(-0.4, 1.3, -0.4)
    squareLeave02.scale.set(0.7, 0.7, 0.7)

    var squareLeave03 = new THREE.Mesh(geometry, leaveDarkMaterial)
    squareLeave03.position.set(0.4, 1.7, -0.5)
    squareLeave03.scale.set(0.7, 0.7, 0.7)

    var squareLeave04 = new THREE.Mesh(geometry, leaveDarkMaterial)
    squareLeave03.position.set(0.6, 2, -0.5)
    squareLeave03.scale.set(0.7, 0.7, 0.7)

    var leaveDark = new THREE.Mesh(geometry, leaveDarkMaterial)
    leaveDark.position.set(0, 1.2, 0)
    leaveDark.scale.set(1, 2, 1)

    var leaveLight = new THREE.Mesh(geometry, leaveLightMaterial)
    leaveLight.position.set(0, 1.2, 0)
    leaveLight.scale.set(1.1, 0.5, 1.1)

    var ground = new THREE.Mesh(geometry, leaveDarkDarkMaterial)
    ground.position.set(0, -1, 0)
    ground.scale.set(2.4, 0.8, 2.4)

    tree = new THREE.Group()
    tree.add(leaveDark)
    tree.add(leaveLight)
    tree.add(squareLeave01)
    tree.add(squareLeave02)
    tree.add(squareLeave03)
    tree.add(squareLeave04)
    tree.add(ground)
    tree.add(stem)

    tree.rotation.y = 1
    tree.rotation.x = 0.5

    scene.add(tree)

    renderer = new THREE.WebGLRenderer()

    renderer.setSize(window.innerWidth, window.innerHeight)
    var controls = new OrbitControls(camera, renderer.domElement)
    document.body.innerHTML = ''
    document.body.appendChild(renderer.domElement)
  }

  function render () {
    requestAnimationFrame(render)

    tree.rotation.y += 0

    renderer.render(scene, camera)
  }
}

var Tree = function (opt) {
  // options
  opt = opt || {}
  this.sections = opt.sections || 5
  this.conesPerSection = opt.conesPerSection || 7
  this.coneMaterial =
    opt.coneMaterial ||
    new THREE.MeshBasicMaterial({
      color: 0xa5e6ab
    })
  //   this.coneMaxRadius = opt.coneMaxRadius || 0.7
  //   this.coneRadiusReduction = opt.coneRadiusReduction || 0.3
  //   this.coneMaxLength = opt.coneRadiusReduction || 5
  //   this.coneLengthReduction = opt.coneRadiusReduction || 4.5
  this.coneMaxRadius = opt.coneMaxRadius || 0.7
  this.coneRadiusReduction = opt.coneRadiusReduction || 0.1
  this.coneMaxLength = opt.coneRadiusReduction || 9
  this.coneLengthReduction = opt.coneRadiusReduction || 4.5

  // call backs
  this.forConeValues = opt.forConeValues || function () {}
  this.forConeMesh = opt.forConeMesh || function () {}
  this.forSection = opt.forSection || function () {}
  this.onDone = opt.onDone || function () {}

  // the main group to add to scene
  this.group = new THREE.Group()

  // section object
  var secObj = {
    i: 0
  }

  // loop sections
  while (secObj.i < this.sections) {
    var groupSection = new THREE.Group()
    // cone object
    var coneObj = {
      i: 0
    }
    // standard radius and length
    // and set default radius and y position of section
    secObj.stdRadius =
      this.coneMaxRadius - this.coneRadiusReduction * (secObj.i / this.sections)
    secObj.stdLength =
      this.coneMaxLength -
      (this.coneLengthReduction * (Math.pow(2, secObj.i) - 1)) /
        Math.pow(2, this.sections)
    secObj.radius = secObj.stdLength - secObj.stdLength / 2
    secObj.y = secObj.stdRadius * 2 * secObj.i
    secObj.radOffset = (secObj.i % 2) * Math.PI

    // call for section
    this.forSection.call(this, secObj)

    // loop cones
    while (coneObj.i < this.conesPerSection) {
      Tree.defaultConeObj(this, coneObj, secObj)

      // call any forConeValues method that may be given
      this.forConeValues.call(this, coneObj, secObj)

      // create the cone geometry
      var cone = new THREE.CylinderGeometry(
        coneObj.radius,
        coneObj.length,
        coneObj.segRad,
        20
        // coneObj.segLength
        // coneObj.open,
        // coneObj.thetaStart,
        // coneObj.thetaLength
      )

      // create the mesh
      var mesh = new THREE.Mesh(cone, coneObj.material || this.coneMaterial)

      // position and rotate
      mesh.position.set(coneObj.x, coneObj.y, coneObj.z)
      mesh.rotation.set(coneObj.r.x, coneObj.r.y, coneObj.r.z)

      // call forConeMesh
      this.forConeMesh.call(this, mesh, coneObj, secObj)

      groupSection.rotation.set(0, secObj.radOffset, 0)

      // add mesh to group
      groupSection.add(mesh)

      // next cone
      coneObj.i += 1
    }

    // set y position of section
    // and add the section to the group
    groupSection.position.y = secObj.y
    this.group.add(groupSection)

    // next section
    secObj.i += 1
  }

  // call on done if given
  this.onDone.call(this)
}

Tree.defaultConeObj = function (tree, coneObj, secObj) {
  coneObj.per = coneObj.i / tree.conesPerSection
  coneObj.radian = Math.PI * 2 * coneObj.per
  Tree.setConePos(coneObj, secObj)
  coneObj.r = {
    // x: Math.PI / 2,
    x: -4.5,
    y: 0,
    // z: ((Math.PI * 2) / tree.conesPerSection) * coneObj.i - Math.PI / 2
    z: 0
  }
  coneObj.radius = secObj.stdRadius
  coneObj.length = secObj.stdLength
  coneObj.segRad = 32
  coneObj.seglength = 1
  coneObj.open = false
  coneObj.thetaStart = 0
  coneObj.thetaLength = Math.PI * 2
}

Tree.setConePos = function (coneObj, secObj) {
  var radian = coneObj.radian
  //   coneObj.x = Math.cos(radian) * secObj.radius
  coneObj.x = 0
  coneObj.y = 0
  coneObj.z = secObj.stdLength / 2
  //   coneObj.z = Math.sin(radian) * secObj.radius
}
function App () {
  let renderer = { domElement: '' }
  var scene = new THREE.Scene()
  const func = () => {
    // CAMERA
    var camera = new THREE.PerspectiveCamera(50, 1, 0.5, 1000)
    camera.position.set(27, 5, 20)
    camera.lookAt(5, -3, 66)
    // LIGHT
    scene.add(camera)
    var light = new THREE.PointLight(0xffffff)
    camera.add(light)

    // BASIC TREE
    var tree = new Tree({
      coneMaterial: new THREE.MeshStandardMaterial({
        color: 0xa5e6ab,
        map: new THREE.TextureLoader().load(texture)
      }),
      conesPerSection: 1,
      sections: 1
    })
    scene.add(tree.group)
    const geometry = new THREE.PlaneGeometry(20, 20, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00f00,
      side: THREE.DoubleSide
    })
    const plane = new THREE.Mesh(geometry, material)
    scene.add(plane)
    // RENDER
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('root').innerHTML = ''
    document.getElementById('root').appendChild(renderer.domElement)

    // CONTROLS
    var controls = new OrbitControls(camera, renderer.domElement)
    // LOOP
    // controls.addEventListener('change', event => {
    //   console.log(controls.object.position)
    // })
    var loop = function () {
      requestAnimationFrame(loop)
      renderer.render(scene, camera)
    }
    // SCENE
    loop()
    console.log(model)
  }

  useEffect(() => {
    func()
  })
  //   return renderer.domElement
  // const loader = new GLTFLoader()

  // loader.load(
  //   // resource URL
  //   '/static/media/scene.3f6e2257.gltf',
  //   // called when the resource is loaded
  //   function (gltf) {
  //     scene.add(gltf.scene)

  //     gltf.animations // Array<THREE.AnimationClip>
  //     gltf.scene // THREE.Group
  //     gltf.scenes // Array<THREE.Group>
  //     gltf.cameras // Array<THREE.Camera>
  //     gltf.asset // Object
  //   }
  // )

  // loader.load(model, function ( gltf ) {

  // 	const scene = gltf.scene;

  // 	const mesh = scene.children[ 3 ];

  // 	const fooExtension = mesh.userData.gltfExtensions.EXT_foo;

  // 	gltf.parser.getDependency( 'bufferView', fooExtension.bufferView )
  // 		.then( function ( fooBuffer ) { ... } );

  // }
  // );

  // const App = () => {
  //   return <ModelViewer type='gtlf' src={scene} />
  return ''
  // }
}
export default App
