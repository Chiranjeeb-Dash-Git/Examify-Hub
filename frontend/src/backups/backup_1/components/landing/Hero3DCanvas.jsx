import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Clean container before appending
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Mesh Group (Core + Wireframe)
    const meshGroup = new THREE.Group();

    // Solid Faceted Core (Icosahedron)
    const coreGeometry = new THREE.IcosahedronGeometry(1.55, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x17171a,
      metalness: 0.65,
      roughness: 0.32,
      emissive: 0x0a0a0c,
      emissiveIntensity: 0.4,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    meshGroup.add(coreMesh);

    // Outer Wireframe Outer Shell
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.6, 0);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    meshGroup.add(wireframeMesh);

    scene.add(meshGroup);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 90);
    spotLight.position.set(5, 6, 4);
    spotLight.angle = 0.5;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    const pointLight1 = new THREE.PointLight(0x8a8a9a, 40);
    pointLight1.position.set(-4, -2, -3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 30);
    pointLight2.position.set(0, 3, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 35);
    pointLight3.position.set(2, -1, 4);
    scene.add(pointLight3);

    // 4. Mouse Pointer Track
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = (y / rect.height) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    let animationFrameId;

    const animate = () => {
      const elapsedTime = performance.now() * 0.001;

      // Continuous rotation
      meshGroup.rotation.y += 0.0025;

      // Floating sine oscillation
      meshGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.08;

      // Mouse lerp tilt
      targetX = mouseY * 0.35;
      targetY = meshGroup.rotation.y + mouseX * 0.002;

      meshGroup.rotation.x += (targetX - meshGroup.rotation.x) * 0.04;
      meshGroup.rotation.z += (-mouseX * 0.15 - meshGroup.rotation.z) * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[550px] flex items-center justify-center">
      {/* Radial overlay to blend canvas seamlessly into dark background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050505_85%)] pointer-events-none z-10" />
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
};
