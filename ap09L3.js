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
    [-25,-40],
    [15,0],
    [-15,10],
    [8,30],
    [ 50, 20]
];
let cars = [];  // 車の配列
let carProgress = []; // 車ごとの進行状況を格納

export function init(scene, size, id, offset, texture) {
    origin.set(offset.x, 0, offset.z);
    camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
    {
        camera.position.set(0, 10, 0);
        camera.lookAt(offset.x, 0, offset.z);
    }
    renderer = new THREE.WebGLRenderer();
    {
        renderer.setClearColor(0x406080);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(size, size);
    }
    document.getElementById(id).appendChild(renderer.domElement);

    // 平面
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 80),
        new THREE.MeshLambertMaterial({ color: "green" })
    );
    plane.rotateX(-Math.PI / 2);
    plane.position.set(offset.x, -0.01, offset.z);
    scene.add(plane);
    // コース(描画)
    // 制御点を補間して曲線を作る
    course = new THREE.CatmullRomCurve3(
        controlPoints.map((p) => {
            return new THREE.Vector3().set(offset.x + p[0], 0, offset.z + p[1]);
        }),
        false
    );

    // 曲線から100箇所を取り出し,円を並べる
    const points = course.getPoints(100);
    points.forEach((point) => {
        const road = new THREE.Mesh(
            new THREE.CircleGeometry(5, 16),
            new THREE.MeshLambertMaterial({
                color: "gray",
            })
        );
        road.rotateX(-Math.PI / 2);
        road.position.set(point.x, 0, point.z);
        scene.add(road);
    });
}

// 車の設定
export function setCar(scene, car) {
    const SCALE = 0.01;
    car.position.copy(origin);
    car.scale.set(SCALE, SCALE, SCALE);
    carProgress.push(0);  // 進行状況を初期化
    scene.add(car);
}

// コース(自動運転用)
export function makeCourse(scene) {
    const courseVectors = [];
    const parts = [L4, L1, L2, L3];
    parts.forEach((part) => {
        part.controlPoints.forEach((p) => {
            courseVectors.push(
                new THREE.Vector3(p[0] + part.origin.x, 0, p[1] + part.origin.z)
            );
        });
    });
    course = new THREE.CatmullRomCurve3(courseVectors, true);
}

// スコアの表示
let score = 0;
let life = 3;
export function setScore(score) {
    document.getElementById("score").innerText = String(Math.round(score)).padStart(8, "0");
}

// カメラを返す
export function getCamera() {
    return camera;
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
const speed = Math.random() + 0.5;
export function render(scene) {
    let firstPlaceIndex = -1;
    let maxProgress = -1;
    
    cars.forEach((car, index) => {
        const time = (clock.getElapsedTime() * speed) / 20;
        course.getPointAt(time % 1, carPosition);
        car.position.copy(carPosition);

        // 車の進行状況を記録
        carProgress[index] = time % 1;

        // 1位の車を特定
        if (carProgress[index] > maxProgress) {
            maxProgress = carProgress[index];
            firstPlaceIndex = index;
        }

        // 車の向きを設定
        course.getPointAt((time + 0.01) % 1, carTarget);
        car.lookAt(carTarget);
    });

    // 1位の車が決まったらスコアを増加
    if (firstPlaceIndex !== -1) {
        score += 1;  // 1位の車にスコアを加算
        setScore(score);  // スコアを表示
    }

    camera.lookAt(cars[firstPlaceIndex].position.x, cars[firstPlaceIndex].position.y, cars[firstPlaceIndex].position.z);
    renderer.render(scene, camera);
}
camera.fov = param.fov;
    camera.position.x = param.x;
    camera.position.y = param.y;
    camera.position.z = param.z;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();