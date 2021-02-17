import pallets from './pallets.js'

const colors = {
    pallet: 0x0000FF,
    background: 0xB6D7A8
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(colors.background);

const light = new THREE.AmbientLight(0xffffff); 
scene.add(light);

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight,1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );

const controls = new THREE.OrbitControls( camera, renderer.domElement );

const drawPallet = (x, y, z, color, name) => {
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({color:color});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    cube.name = name;
    scene.add(cube)
}

const drawXPallets = (totalPallets) => {
    for (let pallet = 0; pallet < totalPallets; pallet++) {
        drawPallet(pallets[pallet][0], pallets[pallet][1], pallets[pallet][2], colors.pallet, "Pallet "+pallet)
    }
}

const drawPallets = () => {

    const xoffset = 1.1;
    const zoffset = -1.1;

    for (let i= 0; i < 7; i++) {
        drawPallet(xoffset, .75, (zoffset*i)+.5, colors.pallet);
        drawPallet(-0, .75, (zoffset*i)+.5, colors.pallet);
        drawPallet(-xoffset, .75, (zoffset*i)+.5, colors.pallet);
    }
    
    for (let i= 0; i < 7; i++) {
        drawPallet(xoffset, 1.85, (zoffset*i)+.5, colors.pallet);
        drawPallet(-0, 1.85, (zoffset*i)+.5, colors.pallet);
        drawPallet(-xoffset, 1.85, (zoffset*i)+.5, colors.pallet);
    }
}

let palletCount = 0;
const totalPallets = 42;

const addPallet = () => {
    if (palletCount < totalPallets) {
        drawPallet(pallets[palletCount][0], pallets[palletCount][1], pallets[palletCount][2], colors.pallet, "Pallet "+palletCount)
        palletCount++;
    }
}

const removePallet = () => {
    if (palletCount > 0) {
        palletCount--;
        const pallet = "Pallet "+palletCount
        const selectedObject = scene.getObjectByName(pallet);
        scene.remove( selectedObject );
    }
}

document.getElementById("addBtn").addEventListener("click", addPallet);
document.getElementById("removeBtn").addEventListener("click", removePallet);

camera.lookAt(0, 0, 0)
camera.position.set( 5, 10, 10 );
controls.update();

const loader = new THREE.GLTFLoader();

loader.load( './assets/model.glb', gltf => {
    scene.add( gltf.scene );
}, undefined, err => {
	console.error( err );
});

const animate = () => {
    requestAnimationFrame( animate );
    controls.update();
	renderer.render( scene, camera );
}

animate();