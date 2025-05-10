// bubbleCharacter.js - Crystal Runner Bubble Character
// This file contains the bubble character creation and update logic for the Crystal Runner WebXR game

export function createBubbleCharacter() {
  const grp = new THREE.Group();
  
  // Sphere geometry for soap bubble
  const geom = new THREE.SphereGeometry(0.12, 32, 32);
  
  // Create soap bubble material (iridescent, transparent)
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.95,
    thickness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    iridescence: 1.0,
    iridescenceIOR: 1.3,
    envMapIntensity: 2.0,
    opacity: 0.8,
    transparent: true
  });
  
  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  grp.add(mesh);
  
  // Rainbow colored point light
  const bubbleLight = new THREE.PointLight(0xffffff, 1.0, 0.5);
  grp.add(bubbleLight);
  
  return grp;
}

export function updateBubbleCharacter(bubble, clock, targetX, currentX) {
  // Handle bubble movement and animation
  bubble.position.x += (targetX - currentX) * 0.2;
  bubble.position.y = Math.sin(clock.getElapsedTime() * 3) * 0.02;
  bubble.rotation.y += (targetX - currentX) * 0.1 + clock.getDelta() * 0.5;
  bubble.rotation.z = (targetX - currentX) * 0.3;
  
  // Make the bubble wobble slightly
  bubble.scale.x = 1.0 + Math.sin(clock.getElapsedTime() * 5) * 0.03;
  bubble.scale.y = 1.0 + Math.sin(clock.getElapsedTime() * 4.5) * 0.02;
  bubble.scale.z = 1.0 + Math.sin(clock.getElapsedTime() * 4.2) * 0.025;
  
  // Update bubble light color to create rainbow effect
  if (bubble.children.length > 1) {
    const bubbleLight = bubble.children[1];
    const hue = (clock.getElapsedTime() * 0.2) % 1;
    const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
    bubbleLight.color = color;
  }

  return bubble.position.x;
}

export function createTrailEffect(scene, position, count, trailParticles) {
  // Create shimmery bubble trail
  for (let i = 0; i < count; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.01 + Math.random() * 0.02, 8, 8),
      new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(
          0.7 + Math.random() * 0.3, 
          0.7 + Math.random() * 0.3, 
          0.7 + Math.random() * 0.3
        ), 
        transparent: true, 
        opacity: 0.5 
      })
    );
    
    p.position.copy(position);
    p.position.x += (Math.random() - 0.5) * 0.1;
    p.position.y += (Math.random() - 0.5) * 0.1;
    p.position.z += (Math.random() - 0.5) * 0.1;
    
    p.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.03, 
        Math.random() * 0.03, 
        (Math.random() - 0.5) * 0.03
      ),
      life: 0.7 + Math.random() * 0.3
    };
    
    scene.add(p);
    trailParticles.push(p);
  }
  
  return trailParticles;
}

export function createExplosionEffect(scene, position, trailParticles) {
  // Water splash effect for bubble popping
  for (let i = 0; i < 20; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.MeshBasicMaterial({ 
        color: 0x84f7fd, 
        transparent: true, 
        opacity: 0.8 
      })
    );
    
    p.position.copy(position);
    p.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1, 
        (Math.random() - 0.5) * 0.1, 
        (Math.random() - 0.5) * 0.1
      ),
      life: 1.0
    };
    
    scene.add(p);
    trailParticles.push(p);
  }
  
  const flash = new THREE.PointLight(0x84f7fd, 3, 1.5);
  flash.position.copy(position);
  scene.add(flash);
  setTimeout(() => scene.remove(flash), 200);
  
  return trailParticles;
}

export function updateBubbleTrailParticles(scene, trailParticles, dt) {
  for (let i = trailParticles.length - 1; i >= 0; i--) {
    const p = trailParticles[i];
    p.position.add(p.userData.velocity);
    p.userData.life -= dt;
    p.material.opacity = p.userData.life * 0.5;
    
    if (p.userData.life <= 0) {
      scene.remove(p);
      trailParticles.splice(i, 1);
    }
  }
  
  return trailParticles;
}

export function resetBubbleCharacter(bubble) {
  const bubbleMesh = bubble.children[0];
  const pm = bubbleMesh.material;
  pm.opacity = 0.8;
  pm.emissive.set(0xffffff);
  pm.emissiveIntensity = 0.2;
  
  return bubble;
}
