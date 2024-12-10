// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38486-2024 牧田　彪勢
"use strict"; // 厳格モード

import * as THREE from 'three';
import GUI from 'ili-gui';
import { myTriangleGeometry } from './myTriangleGeometry.js';

// ３Ｄページ作成関数の定義
function init() {
  const param = { // カメラの設定値
    fov: 60, // 視野角
    x: 30,
    y: 10,
    z: 40,
    wireframe: false
  };

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);
  axes.visible = false;

  // 素材の設定
  const glassMaterial = new THREE.MeshPhongMaterial({ color: 'skyblue' });
  const tyreMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

  // 車のサイズ
  const carW = 1.8;  // 幅
  const carL = 4.0;  // 長さ
  const carH = 1.0;  // 高さ
  const LoofH = 0.6; // 屋根の高さ

  // 座標点
  const v = [
    new THREE.Vector3(carW / 2, 0, carL / 8),  // 0
    new THREE.Vector3(carW / 2, 0, -carL / 2), // 1
    new THREE.Vector3(carW / 2, LoofH, 0),     // 2
    new THREE.Vector3(carW / 2, LoofH, -carL / 4), // 3
    new THREE.Vector3(-carW / 2, 0, carL / 8), // 4
    new THREE.Vector3(-carW / 2, 0, -carL / 2), // 5
    new THREE.Vector3(-carW / 2, LoofH, 0),     // 6
    new THREE.Vector3(-carW / 2, LoofH, -carL / 4) // 7
  ];

  function createCar(offsetX, offsetZ, carColor) {
    const car = new THREE.Group();
    let mesh;
  
    // ボディの作成
    mesh = new THREE.Mesh(new THREE.BoxGeometry(carW, carH, carL), carColor);
    mesh.position.y = -carH / 2;
    car.add(mesh);
  
    // 屋根の作成
    mesh = new THREE.Mesh(new myTriangleGeometry(v[6], v[2], v[7]), carColor);
    car.add(mesh);
    mesh = new THREE.Mesh(new myTriangleGeometry(v[2], v[3], v[7]), carColor);
    car.add(mesh);
  
    // 窓の作成
    mesh = new THREE.Mesh(new myTriangleGeometry(v[0], v[1], v[2]), glassMaterial);
    car.add(mesh);
    mesh = new THREE.Mesh(new myTriangleGeometry(v[3], v[2], v[1]), glassMaterial);
    car.add(mesh);
    mesh = new THREE.Mesh(new myTriangleGeometry(v[5], v[4], v[7]), glassMaterial);
    car.add(mesh);
    mesh = new THREE.Mesh(new myTriangleGeometry(v[6], v[7], v[4]), glassMaterial);
    car.add(mesh);
    mesh = new THREE.Mesh(new myTriangleGeometry(v[4], v[0], v[6]), glassMaterial);
    car.add(mesh);
    mesh = new THREE.Mesh(new myTriangleGeometry(v[2], v[6], v[0]), glassMaterial);
    car.add(mesh);
    mesh = new THREE.Mesh(new myTriangleGeometry(v[1], v[5], v[3]), glassMaterial);
    car.add(mesh);
    mesh = new THREE.Mesh(new myTriangleGeometry(v[7], v[3], v[5]), glassMaterial);
    car.add(mesh);
  
    // タイヤの作成
    const tyreR = 0.5;
    const tyreW = 0.3;
    mesh = new THREE.Mesh(new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1), tyreMaterial);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(carW / 2, -carH, 3 / 8 * carL);
    car.add(mesh);
    mesh = new THREE.Mesh(new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1), tyreMaterial);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(-carW / 2, -carH, 3 / 8 * carL);
    car.add(mesh);
    mesh = new THREE.Mesh(new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1), tyreMaterial);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(-carW / 2, -carH, -3 / 8 * carL);
    car.add(mesh);
    mesh = new THREE.Mesh(new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1), tyreMaterial);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(carW / 2, -carH, -3 / 8 * carL);
    car.add(mesh);
  
    // 高さの調整
    car.position.y = carH + tyreR;
    
    // スタート位置を常に (0, 0) に設定
    car.position.set(0, car.position.y, 0); // X, Z座標を0に設定
  
    // 影の設定
    car.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
  
    return car;
  }
  



  // 車の色設定
  const carColors = [
    new THREE.MeshPhongMaterial({ color: 'red' }),
    new THREE.MeshPhongMaterial({ color: 'blue' }),
    new THREE.MeshPhongMaterial({ color: 'green' }),
    new THREE.MeshPhongMaterial({ color: 'yellow' })
  ];

  // ランダムなスピード設定 (各車ごとに異なるスピード)
  const carSpeeds = [Math.random() + 1, Math.random() + 1, Math.random() + 1, Math.random() + 1];
  const carMaxAngles = [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2]; // 各車が一周するまでの角度

 // 車の作成 (すべての車を同じ初期位置からスタート)
const cars = [];
for (let i = 0; i < 4; i++) {
  // すべての車を同じ位置 (0, 0) で作成
  cars.push(createCar(0, 0, carColors[i])); // x, z 座標を0に設定
  scene.add(cars[i]);
}




  // 平面の設定
  const plane = new THREE.Mesh(
    new THREE.RingGeometry(15, 30, 32),
    new THREE.MeshLambertMaterial({ color: 0x303030 })
  );
  plane.rotateX(-Math.PI / 2);
  plane.receiveShadow = true;
  scene.add(plane);

  // 光源の設定
  const light1 = new THREE.SpotLight(0xffffff, 20000);
  light1.position.set(0, 70, -3);
  light1.castShadow = true;
  scene.add(light1);
  const light2 = new THREE.AmbientLight('white', 0.5);
  light2.castShadow = true;
  scene.add(light2);

  // カメラの設定
  const camera = new THREE.PerspectiveCamera(
    param.fov, window.innerWidth / window.innerHeight, 0.1, 1000
  );

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x406080);
  renderer.shadowMap.enabled = true;
  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  const carAngles = [0, 0, 0, 0]; // 車ごとの角度（theta）
  const radius = 22;
  const carLapCounts = [0, 0, 0, 0]; // 各車の周回数
  const maxLaps = 3; // 周回数の上限

  // レースが開始されたかどうか
  let raceStarted = false;
  let winner = null;  // 1位の車
  let selectedCar = null;  // ユーザーが選んだ車

  // 終了メッセージ用のテキスト
  const endMessage = document.createElement("div");
  endMessage.style.position = "absolute";
  endMessage.style.top = "50%";
  endMessage.style.left = "50%";
  endMessage.style.transform = "translate(-50%, -50%)";
  endMessage.style.fontSize = "30px";
  endMessage.style.color = "white";
  endMessage.style.display = "none";
  endMessage.innerHTML = "終了";
  document.body.appendChild(endMessage);

  // 車ごとの周回数表示用テキスト
  const lapCounters = [];
  for (let i = 0; i < 4; i++) {
    const lapCounter = document.createElement("div");
    lapCounter.style.position = "absolute";
    lapCounter.style.top = `${20 + i * 30}px`;
    lapCounter.style.left = "10px";
    lapCounter.style.fontSize = "20px";
    lapCounter.style.color = "white";
    lapCounter.innerHTML = `車 ${i + 1}: 周回数: 0`;
    document.body.appendChild(lapCounter);
    lapCounters.push(lapCounter);
  }
  // スコア表示
  let score = 0;
  const scoreText = document.createElement("div");
  scoreText.style.position = "absolute";
  scoreText.style.top = "10px";
  scoreText.style.left = "1300px";
  scoreText.style.fontSize = "20px";
  scoreText.style.color = "white";
  scoreText.innerHTML = `スコア: ${score}`;
  document.body.appendChild(scoreText);

// 車の色名
const carColorNames = ['赤', '青', '緑', '黄色'];

// 車の色名を表示するための div を一度だけ作成
const colorText = document.createElement("div");
colorText.id = "colorText";  // 一意のIDを付けて後から更新できるようにする
colorText.style.position = "absolute";
colorText.style.top = "150px";  // 周回数表示の下に配置するために位置調整
colorText.style.left = "10px";
colorText.style.fontSize = "20px";
colorText.style.color = "white";
colorText.innerHTML = "選んだ車の色: 未選択";  // 初期状態は「未選択」
document.body.appendChild(colorText);  // 最初に一度だけ追加

// 車を選んでもらうためのボタン作成
const buttons = ['車1', '車2', '車3', '車4'].map((car, index) => {
  const button = document.createElement('button');
  button.innerHTML = `${car} を選ぶ`;
  button.style.position = 'absolute';
  button.style.top = `${20 + index * 40}px`;
  button.style.left = '10px';
  button.style.fontSize = '20px';

  button.onclick = () => {
    selectedCar = index;
    
    // 色名を更新
    const selectedColor = carColorNames[index];  // 色名を取得
    colorText.innerHTML = `選んだ車の色: ${selectedColor}`;  // 色名を表示
    
    // ボタンを非表示にしてレースを開始
    buttons.forEach((btn) => btn.style.display = 'none');
    raceStarted = true;
    console.log(`車 ${index + 1} を選びました`);
  };
  
  document.body.appendChild(button);
  return button;
});
// 選択した車の色を表示するためのdivを作成
const colorDisplay = document.createElement("div");
colorDisplay.style.position = "absolute";
colorDisplay.style.top = "100px";  // 画面上部に表示される位置
colorDisplay.style.left = "10px";
colorDisplay.style.fontSize = "20px";
colorDisplay.style.color = "white";
document.body.appendChild(colorDisplay);


  // リセットボタンの作成
  const resetButton = document.createElement("button");
  resetButton.innerHTML = "リセット";
  resetButton.style.position = "absolute";
  resetButton.style.top = "50px";
  resetButton.style.left = "10px";
  resetButton.style.fontSize = "20px";
  resetButton.style.display = "none";  // 初期状態では非表示
  resetButton.onclick = () => {
    // ゲームの状態をリセット
    raceStarted = false;
    winner = null;
    carLapCounts.fill(0);
    carAngles.fill(0);
    cars.forEach(car => {
      car.position.set(0, car.position.y, 0);
      car.rotation.set(0, 0, 0);
    });
    // 結果メッセージを非表示にし、スコアをリセットしない
    endMessage.style.display = "none";
    resetButton.style.display = "none";
    // ボタンを再表示
    buttons.forEach(btn => btn.style.display = 'block');
  };
  document.body.appendChild(resetButton);


  // 描画関数の定義
function render() {
  camera.fov = param.fov;
  camera.position.x = param.x;
  camera.position.y = param.y;
  camera.position.z = param.z;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  
  if (raceStarted) {
    cars.forEach((car, index) => {
      if (winner === null) {
        // 角度を更新
        carAngles[index] += carSpeeds[index] * 0.01; // 速度に応じて角度を更新
        if (carAngles[index] >= 2 * Math.PI) {
          carAngles[index] -= 2 * Math.PI; // 周回リセット
          carLapCounts[index]++;
          
          // 1周ごとにスピードをランダムに変更
          carSpeeds[index] = Math.random() + 1; // 新しいスピードを設定
        }
    
        // 車の位置更新
        const theta = carAngles[index];
        car.position.x = radius * Math.cos(theta + index * Math.PI / 6);
        car.position.z = radius * Math.sin(theta + index * Math.PI / 6);
    
        // 車の回転方向
        car.rotation.y = -theta + -(index * Math.PI / 6);
    
        // 周回数更新
        lapCounters[index].innerHTML = `車 ${index + 1}: 周回数: ${carLapCounts[index]}`;
    
        // ゴール判定
        if (carLapCounts[index] >= maxLaps) {
          if (winner === null) { // まだ勝者が決まっていない場合
            winner = index;
            endMessage.innerHTML = `車 ${index + 1} が1位です！`;

            // ユーザーが選んだ車が1位ならボーナススコア
            if (selectedCar === winner) {
              score += 1000; // ボーナススコア
              endMessage.innerHTML += ` あなたの車が1位になりました！ボーナス+2000ポイント！`;
            } else {
              endMessage.innerHTML += ` 残念、1位は別の車でした。`;
            }

            // 通常スコアを追加
            endMessage.style.display = 'block';
            resetButton.style.display = 'block';
          }
        }
      }
    });
    
    scoreText.innerHTML = `スコア: ${score}`;
  }
  // シーンのレンダリング
  renderer.render(scene, camera);
}


  // アニメーションループ
  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  // アニメーション開始
  animate();
}

// ページ読み込み時にinit()を実行
window.onload = init;
