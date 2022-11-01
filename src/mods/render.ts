/*
TRON by Alexander Abraham, a.k.a. "Angel Dollface".
Licensed under the MIT license.
*/

// Standard three.js import.
import * as THREE from 'three';

// Importing the GLTF 2.0 loader.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Importing the shader for object glow-up.
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

// Importing a glitch filter for some funk.
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

// Importing the "composer" to slap a filter on our scene.
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

// Importing the filter.
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Importing the environment for rendering, lighting, etc.
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

// A function to render our models.
export function renderModel(
    textureURL: string,
    symbolName: string,
    modelURL: string,
    borderLightColor: number,
    stageLightColor: number,
    spinAxis: string
): void {

    // We make a new three.js scene.
    let scene: THREE.Scene = new THREE.Scene();

    // We make a new camera. Something has
    // to look at our scene.
    let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        90, // Angle.
        window.innerWidth/window.innerHeight, // FOV.
        0.01,
        1000
    );

    // Loading a remote image to display on the screen.
    const texURL: string = textureURL;
    const textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    const screenTexture = textureLoader.load(texURL);
    screenTexture.flipY = false;
    const screenMaterial: THREE.MeshMatcapMaterial= new THREE.MeshMatcapMaterial(
        {
           matcap: screenTexture
        }
    );

    // Setting the background color.
    scene.background = new THREE.Color(0x000000);

    // Something has to render our scene.
    // We use the "standard" WebGL renderer.
    var renderer = new THREE.WebGLRenderer(
        {
          antialias: true
        }
    );

    // We set the width of and height of the renderer.
    renderer.setSize(window.innerWidth, window.innerHeight);

    // We add the renderer to the document.
    document.body.appendChild(renderer.domElement);

    // We make a new environment to render the scene in.
    // Courtesy of Don McCurdy.
    const environment = new RoomEnvironment();

    // Not sure what this does.
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    // A shader?
    const renderScene = new RenderPass( scene, camera );

    // Parameters for making named objects emit light.
    const params = {
        exposure: 0.5,
        bloomStrength: 0.5,
        bloomThreshold: 0,
        bloomRadius: 0.0001
    };

    // A shader to make individual meshes glow up. (Pillars on the corners.)
	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;

    // We use a composer instead of the standard renderer
    // and add relevant data, because the shader is a "filter"
    // on the scene.
    var composer = new EffectComposer( renderer );
	composer.addPass( renderScene );
	composer.addPass( bloomPass );

    // Loading a GIF in.

    // And generate the scene from an environment.
    scene.environment = pmremGenerator.fromScene( environment ).texture;

    // Since the model is external we need to load it in.
    // For this we use the GLTF 2.0 loader three.js gives us.
    var loader = new GLTFLoader();


    // Empty variables to
    // populate with meshes from the loaded model.
    let obj: any;
    let sign: any;
    let lightOne: any;
    let lightTwo: any;
    let lightThree: any;
    let lightFour: any;
    let lightFive: any;
    let lightSix: any;
    let lightSeven: any;
    let lightEight: any;
    let lightNine: any;
    let lightTen: any;
    let lightEleven: any;
    let screen: any;

    // How intense should the light be?
    const lightIntensity: number = 2.5;

    // Different light intensities for the lights
    // on the border of the scene.
    let borderLightIntensity: number = 2.5;

    // Adding an effect on top of the whole scene.
    /*chPass: GlitchPass = new GlitchPass();
	composer.addPass(glitchPass);*/

    // Closure to load a model from a path (remote or local).
    loader.load(
        modelURL,
        function(gltf){

          // Main model.
          obj = gltf.scene;

          // Model size.
          gltf.scene.scale.set( 1, 1, 1 );
          
          // Model pos.
          gltf.scene.position.x = 0;                   
          gltf.scene.position.y = 0;
          gltf.scene.position.z = 0;   
          gltf.scene.rotation.y = 0; 

          // We add it to our scene...
          scene.add(gltf.scene);

          // ...and populate our variables with different
          // objects.
          sign = gltf.scene.getObjectByName(symbolName);

          // We fetch one of the corner pillars from the
          // GLTF model and set whether it can emit light,
          // what color that light should be and how strong
          // the emission should be. Same for the other three.

          /* ARCH LIGHTS START */

          // The three light arches on the stage itself.
          lightOne = gltf.scene.getObjectByName('Light01');
          lightOne.material.emissive = new THREE.Color(stageLightColor);
          lightOne.material.emissiveIntensity = lightIntensity;

          lightTwo = gltf.scene.getObjectByName('Light02');
          lightTwo.material.emissive = new THREE.Color(stageLightColor);
          lightTwo.material.emissiveIntensity = lightIntensity;

          lightThree = gltf.scene.getObjectByName('Light03');
          lightThree.material.emissive = new THREE.Color(stageLightColor);
          lightThree.material.emissiveIntensity = lightIntensity;

          /* ARCH LIGHTS END */

          /* STAGE CONTOURS START */

          // The lights around the main stage.
          lightFour = gltf.scene.getObjectByName('Light04');
          lightFour.material.emissive = new THREE.Color(stageLightColor);
          lightFour.material.emissiveIntensity = lightIntensity;
          
          lightFive = gltf.scene.getObjectByName('Light05');
          lightFive.material.emissive = new THREE.Color(stageLightColor);
          lightFive.material.emissiveIntensity = lightIntensity;
          
          lightSix = gltf.scene.getObjectByName('Light06');
          lightSix.material.emissive = new THREE.Color(stageLightColor);
          lightSix.material.emissiveIntensity = lightIntensity;

          lightSeven = gltf.scene.getObjectByName('Light07');
          lightSeven.material.emissive = new THREE.Color(stageLightColor);
          lightSeven.material.emissiveIntensity = lightIntensity;

          /* STAGE CONTOURS END */

          /* BORDER LIGHTS START */

          // The lights at the edges of the scene.
          lightEight = gltf.scene.getObjectByName('Light08');
          lightEight.material.emissive = new THREE.Color(borderLightColor);
          lightEight.material.emissiveIntensity = lightIntensity;

          lightNine = gltf.scene.getObjectByName('Light09');
          lightEight.material.emissive = new THREE.Color(borderLightColor);
          lightEight.material.emissiveIntensity = lightIntensity;          

          lightTen = gltf.scene.getObjectByName('Light10');
          lightTen.material.emissive = new THREE.Color(borderLightColor);
          lightTen.material.emissiveIntensity = borderLightIntensity;

          lightEleven = gltf.scene.getObjectByName('Light11');
          lightEleven.material.emissive = new THREE.Color(borderLightColor);
          lightEleven.material.emissiveIntensity = borderLightIntensity;

          /* BORDER LIGHTS END */

          // Adding some image to the screen.
          screen = gltf.scene.getObjectByName('Screen');
          screen.material = screenMaterial;


          // We call the animation function
          // otherwise nothing happens.
          animate();

        }
    );

    // And animate the whole scene
    // recursively.
    const animate = () => {

        // We blink the border lights 
        // and one arch light
        // for some animation.
        setInterval(blinkLights, 500);

        // Changing the Z position depending
        // on the user's device.
        detectDevice();

        // Adding an event listener to resize
        // the scene for different devices.
        window.addEventListener(
            'resize', 
            resize 
        );

        // Re-renders the scene on
        // every frame bounce.
        composer.render();

        // We want some movement
        // so we animate the moon 
        // by rotating it on the
        // given axis.
        if (spinAxis === 'x'){
            sign.rotation.x -= 0.015;
        }
        else if (spinAxis === 'y'){
            sign.rotation.y -= 0.015;
        }
        else {
            sign.rotation.z -= 0.015;
        }
        
        // The "frame bounce".
        requestAnimationFrame(animate);
    }

    // Defining a nested function to adjust some renderer
    // and camera settings.
    const resize = () => {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        composer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = camera.position.z - 0.001;
    }

    // We try to detect where the user is 
    // visiting the site from.
    const detectDevice = () => {
        var mq = window.matchMedia("(max-width: 800px)");
        if (mq.matches) {
            camera.position.set(0,1,5);
        }
        else {
            camera.position.set(0,1,3.5);
        }
    }

    const blinkLights = () => {
        if (
            lightOne.material.emissiveIntensity === lightIntensity &&
            lightEight.material.emissiveIntensity === borderLightIntensity &&
            lightNine.material.emissiveIntensity === borderLightIntensity &&
            lightTen.material.emissiveIntensity === borderLightIntensity &&
            lightEleven.material.emissiveIntensity === borderLightIntensity
        ){
            lightOne.material.emissiveIntensity = 0;
            lightEight.material.emissiveIntensity = 0;
            lightNine.material.emissiveIntensity = 0;
            lightTen.material.emissiveIntensity = 0;
            lightEleven.material.emissiveIntensity = 0;
        }
        else {
            lightOne.material.emissiveIntensity = lightIntensity;
            lightEight.material.emissiveIntensity = borderLightIntensity;
            lightNine.material.emissiveIntensity = borderLightIntensity;
            lightTen.material.emissiveIntensity = borderLightIntensity;
            lightEleven.material.emissiveIntensity = borderLightIntensity;
        }
    }
    
}

export default renderModel;
