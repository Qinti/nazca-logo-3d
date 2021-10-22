import * as THREE from "./node_modules/three/build/three.module.js";
import OBJLoader from "./objLoader.js";

export default class NazcaLogo {
    constructor(element) {
        let renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(800, 600);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        let scene = new THREE.Scene();

        let ambientLight = new THREE.AmbientLight(0x777777);
        scene.add(ambientLight);

        let light = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        light.position.set(-30, 70, 0);
        light.castShadow = true;
        const h = 120;
        const w = 40;
        light.shadow.camera.left = -w;
        light.shadow.camera.right = w;
        light.shadow.camera.top = h;
        light.shadow.camera.bottom = -h;
        scene.add(light);

        let camera = new THREE.PerspectiveCamera(60, 800 / 600, 100, 900);
        camera.position.set(0, 200, 0);
        camera.lookAt(0, 0, 0);
        scene.add(camera);

        element.appendChild(renderer.domElement);
        element.style = 'position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);';

        let loader = new OBJLoader();
        loader.open('https://raw.githubusercontent.com/Qinti/nazca-logo-3d/main/model/logo.obj').then((logo) => {
            logo.material = new THREE.MeshPhongMaterial({color: 0xFFE100, flatShading: true});
            logo.position.y += 6;
            scene.add(logo);
            logo.castShadow = true;
            logo.receiveShadow = true;

            let plane = new THREE.Mesh(new THREE.PlaneGeometry(3000, 1000),
                new THREE.MeshPhongMaterial({color: 0xFFFFFF}));
            plane.rotation.x = Math.PI / 2
            plane.rotation.y = Math.PI;
            scene.add(plane);
            plane.receiveShadow = true;
        });

        loader.open('https://raw.githubusercontent.com/Qinti/nazca-logo-3d/main/model/grass.obj').then((grass) => {
            grass.material = new THREE.MeshPhongMaterial({color: 0x1A5619, flatShading: true, side: THREE.DoubleSide});
            grass.position.y += 6;
            scene.add(grass);
            grass.castShadow = true;
        });

        let data = {angle: Math.PI / 4};

        let script = document.createElement("script");
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js';
        document.head.appendChild(script);

        script.onload = () => {
            let tween = new TWEEN.Tween(data);
            let sign = 1;
            completeTweenHandler();

            function updateTweenHandler() {
                camera.position.set(200 * Math.sin(this.angle), 200 * Math.cos(this.angle), 0);
                camera.rotation.y = this.angle;
            }

            function completeTweenHandler() {
                sign *= -1;
                tween.to({angle: sign * Math.PI / 4}, 2000).onUpdate(updateTweenHandler).onComplete(completeTweenHandler).start();
            }

            requestAnimationFrame(animate);

            function animate(time) {
                requestAnimationFrame(animate);
                TWEEN.update(time);
                renderer.render(scene, camera);
            }
        };
    }
}