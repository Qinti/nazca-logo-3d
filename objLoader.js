import * as THREE from "./node_modules/three/build/three.module.js";

/**
 * Simplified class to import OBJ file and return a mesh
 */
export default class OBJLoader {
    /**
     * Opens the OBJ file by the path specified
     * @param path Path to an OBJ file
     * @returns {Promise<Mesh>} Promise that resolves the THREE.Mesh object
     */
    open(path) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', path, true);
            request.send(null);
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    return resolve(this.load(request.responseText));
                }
            };

            request.onerror = () => {
                reject(new Error(`Can't read the OBJ file`));
            };
        });
    }

    /**
     * Loads the text data of the OBJ file and parses it to the geometry
     * (note that OBj is slightly modified specially for this lib. It contains only one model, only 'v' and 'f'
     * attributes are possible)
     * @param data Text OBJ data
     * @returns {Mesh}
     */
    load(data) {
        let lines = data.split(/\n/);
        let vertices = [];
        let faces = [];
        lines.forEach((line) => {
            let [identifier, x, y, z] = line.split(/\s+/);
            let isVertex = identifier === 'v';
            let isFace = identifier === 'f';
            [x, y, z] = [x, y, z].map((value) => isVertex ? parseFloat(value) : parseInt(value));
            if (isVertex) {
                vertices.push(x, y, z);
            } else if (isFace) {
                faces.push(x - 1, y - 1, z - 1);
            }
        });

        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(faces), 1));
        geometry.computeVertexNormals();

        return new THREE.Mesh(geometry);
    }
}