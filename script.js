// Scene setup
let scene, camera, renderer;
let textMesh, particleGroup = [];
let countdownComplete = false;
const targetTime = new Date('January 1, 2025 00:00:00').getTime();

// Initialize Three.js
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 50;

  // Add initial countdown text
  updateCountdown();

  window.addEventListener('resize', onWindowResize);
}

// Update countdown text
function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetTime - now;

  if (distance <= 0) {
    countdownComplete = true;
    createParticles("HAPPY NEW YEAR 2025");
    return;
  }

  const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');

  const timeString = `${hours}:${minutes}:${seconds}`;
  renderText(timeString, 20);

  setTimeout(updateCountdown, 1000);
}

// Render text in the scene
function renderText(message, size) {
  if (textMesh) scene.remove(textMesh);

  const loader = new THREE.FontLoader();
  loader.load('https://cdn.jsdelivr.net/npm/three@0.146.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry(message, {
      font: font,
      size: size,
      height: 2,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center();
    scene.add(textMesh);
  });
}

// Create particle explosion
function createParticles(message) {
  renderText(message, 10);

  for (let i = 0; i < 500; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);

    particle.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50
    );

    particle.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );

    scene.add(particle);
    particleGroup.push(particle);
  }
}

// Animate particles
function animateParticles() {
  particleGroup.forEach((particle) => {
    particle.position.add(particle.velocity);
    particle.material.opacity -= 0.01;
    if (particle.material.opacity <= 0) {
      scene.remove(particle);
    }
  });
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render loop
function animate() {
  requestAnimationFrame(animate);
  if (countdownComplete) animateParticles();
  renderer.render(scene, camera);
}

// Start the application
init();
animate();
