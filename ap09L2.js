//

//
//

"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import * as L1 from "./ap09L1.js";
import * as L2 from "./ap09L2.js";
import * as L3 from "./ap09L3.js";
import * as L4 from "./ap09L4.js";

let renderer;
let camera;
let course;
export const origin = new THREE.Vector3();
export const controlPoints = [
    [ 50,-20],
    [ 40,  0],
    [-20, 20],
    [-25, 40]
]
export function init(scene, size, id, offset, texture) {
    origin.set(offset.x, 0, offset.z);
    camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
    {
      camera.position.set(0, 10, 0);
      camera.lookAt(offset.x, 0, offset.z);
    }
    renderer =  new THREE.WebGLRenderer();
    {
      renderer.setClearColor(0x406080);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(size, size);
    }
    document.getElementById(id).appendChild(renderer.domElement);
    
    // 平面
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 80),
        new THREE.MeshLambertMaterial({color: "green"})
    )
    plane.rotateX(-Math.PI/2);
    plane.position.set(offset.x, -0.01, offset.z);
    scene.add(plane);

    // ビル
    function makeBuilding(x, z, type){
        const height = [2, 2, 7, 4, 5];
        const bldgH = height[type] * 5;
        const geometry = new THREE.BoxGeometry(8, bldgH, 8);
        const material = new THREE.MeshLambertMaterial({map: texture});
        const sideUvS = (type*2+1)/11;
        const sideUvE = (type*2+2)/11;
        const topUvS = (type*2+2)/11;
        const topUvE = (type*2+3)/11;
        const uvs = geometry.getAttribute("uv");
        for(let i = 0;i<48;i += 4){
            if(i < 16 || i > 22){
                uvs.array[i] = sideUvS;
                uvs.array[i+2] = sideUvE;
            }else{
                uvs.array[i] = topUvS;
                uvs.array[i+2] = topUvE;
            }
        }
        const bldg = new THREE.Mesh(
            geometry,
            material
        )
        bldg.position.set(x,bldgH/2,z);
        scene.add(bldg);
    }
    makeBuilding(20, 20, 0);
    makeBuilding(-10, 10, 2);
    makeBuilding(-4, 40, 1);
    makeBuilding(9, 5, 0);
    makeBuilding(40, 30, 2);
    
    const e = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshLambertMaterial({color: 0x13123}));
    e.position.set(10,30,30);
    scene.add(e);
    // コース(描画)
    //制御てんを保管して曲線を作る
    course = new THREE.CatmullRomCurve3(
        controlPoints.map((p) => {
            return (new THREE.Vector3()).set(
                offset.x + p[0],
                0,
                offset.z + p[1]
            );
        }), false
    )
    //曲線から100箇所を取り出し、円を並べる
    const points = course.getPoints(100);
    points.forEach((point) => {
        const road = new THREE.Mesh(
            new THREE.CircleGeometry(5,16),
            new THREE.MeshLambertMaterial({
                color: "gray",
            })
        )
        road.rotateX(-Math.PI/2);
        road.position.set(
            point.x,
            0,
            point.z
        );
        scene.add(road);
    });
}

// コース(自動運転用)
export function makeCourse(scene) {
    const courseVectors = [];
    const parts = [L1, L2, L3, L4];
    parts.forEach((part) => {
        part.controlPoints.forEach((p) => {
            courseVectors.push(
                new THREE.Vector3(
                    p[0] + part.origin.x,
                    0,
                    p[1] + part.origin.z,
                )
            )
        });
    })
    course = new THREE.CatmullRomCurve3(
        courseVectors, true
    )
}
//スコアの表示
let score = 0;
  let life = 3;
  export function setScore(score) {
    document.getElementById("score").innerText
    = String(Math.round(score)).padStart(8,"0");
  }

// カメラを返す
export function getCamera() {
    return camera;
}

// 車の設定
export function setCar(scene, car) {
    const SCALE = 0.01;
    car.position.copy(origin);
    car.scale.set(SCALE, SCALE, SCALE);
    scene.add(car);
}

// Windowサイズの変更処理
export function resize() {
    camera.updateProjectionMatrix();
    const sizeR = 0.2 * window.innerWidth;
    renderer.setSize(sizeR, sizeR);
}

const clock = new THREE.Clock();
const carPosition = new THREE.Vector3();
const carTarget = new THREE.Vector3();
const speed = Math.random()+0.5;
export function render(scene, car) {
    const time = (clock.getElapsedTime() * speed)/ 20;
    course.getPointAt(time % 1, carPosition);
    car.position.copy(carPosition);
    course.getPointAt((time + 0.01) % 1, carTarget);
    car.lookAt(carTarget);
    camera.lookAt(car.position.x, car.position.y, car.position.z);
    renderer.render(scene, camera);
}
