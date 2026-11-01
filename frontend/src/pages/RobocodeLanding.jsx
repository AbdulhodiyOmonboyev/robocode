import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function RobocodeLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.THREE = THREE;
    let isMounted = true;
    let animationFrameId = null;
    let idleTimeout = null;
    let emotionInterval = null;
    let typewriterTimer = null;
    let thinkingDelayTimer = null;
    let thinkingPhaseTimer = null;
    let mentorSwipeInterval = null;

      // 2. Course Category Filtering
      const filterBtns = document.querySelectorAll('.course-tab-btn');
      const courseCards = document.querySelectorAll('.course-card');

      filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          filterBtns.forEach(function(b) {
            b.classList.remove('active', 'bg-brand-purple', 'text-white');
            b.classList.add('bg-brand-card', 'text-slate-300');
          });
          btn.classList.add('active', 'bg-brand-purple', 'text-white');
          btn.classList.remove('bg-brand-card', 'text-slate-300');

          const filter = btn.getAttribute('data-filter');
          courseCards.forEach(function(card) {
            const cat = card.getAttribute('data-cat');
            if (filter === 'all' || cat === filter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });

      // 3. Quick Course Selection for Registration Form
      const selectCourseBtns = document.querySelectorAll('.select-course-btn');
      const courseSelect = document.getElementById('lead-course');
      const arizaSection = document.getElementById('ariza');

      selectCourseBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          const courseName = btn.getAttribute('data-course');
          if (courseSelect) {
            for (let i = 0; i < courseSelect.options.length; i++) {
              if (courseSelect.options[i].text.includes(courseName) || courseSelect.options[i].value.includes(courseName)) {
                courseSelect.selectedIndex = i;
                break;
              }
            }
          }
          if (arizaSection) {
            arizaSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      // 4. FAQ Accordion Toggle
      const faqButtons = document.querySelectorAll('.faq-btn');
      faqButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          const item = btn.closest('.faq-item');
          const content = item.querySelector('.faq-content');
          const icon = item.querySelector('.faq-icon');
          const isHidden = content.classList.contains('hidden');

          document.querySelectorAll('.faq-content').forEach(function(c) { c.classList.add('hidden'); });
          document.querySelectorAll('.faq-icon').forEach(function(ic) { ic.textContent = '+'; });

          if (isHidden) {
            content.classList.remove('hidden');
            icon.textContent = '−';
          }
        });
      });

      // 5. CRM Modal Toggles
      const crmModal = document.getElementById('crm-modal');
      const openCrmBtns = [
        document.getElementById('view-interactive-crm'),
        document.getElementById('footer-crm-btn')
      ];
      const closeCrmBtn = document.getElementById('close-crm-modal');
      const closeCrmBtn2 = document.getElementById('close-crm-modal-btn');

      openCrmBtns.forEach(function(b) {
        if (b) {
          b.addEventListener('click', function() {
            crmModal.classList.remove('hidden');
          });
        }
      });

      if (closeCrmBtn) {
        closeCrmBtn.addEventListener('click', function() {
          crmModal.classList.add('hidden');
        });
      }
      if (closeCrmBtn2) {
        closeCrmBtn2.addEventListener('click', function() {
          crmModal.classList.add('hidden');
        });
      }

      // 6. Lead Form Submission
      const leadForm = document.getElementById('lead-form');
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toast-message');

      if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const name = document.getElementById('lead-name').value;
          const course = document.getElementById('lead-course').value;

          try {
            const leads = JSON.parse(localStorage.getItem('robocode_leads') || '[]');
            leads.push({ name: name, course: course, date: new Date().toISOString() });
            localStorage.setItem('robocode_leads', JSON.stringify(leads));
          } catch(err) {
            console.warn(err);
          }

          toastMsg.textContent = 'Rahmat, ' + name + '! ' + course + ' kursi bo‘yicha arizangiz qabul qilindi. Tez orada bog‘lanamiz!';
          toast.classList.remove('hidden');
          setTimeout(function() {
            toast.classList.add('hidden');
          }, 4500);

          leadForm.reset();
        });
      }

      



      
      // 9. Three.js 3D Robot Mascot (True 3D Model, Cursor Tracking & Cute Autonomous Emotions)
      const canvasContainer = document.getElementById('robot-canvas-container');
      const canvas3d = document.getElementById('robot-3d-canvas');
      const speechBubble = document.getElementById('robot-speech-bubble');
      const speechIcon = document.getElementById('robot-speech-icon');
      const speechText = document.getElementById('robot-speech-text');
      const statusText = document.getElementById('robot-status-text');
      const statusDot = document.getElementById('robot-status-dot');

      if (canvas3d && canvasContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();

        const width = canvasContainer.clientWidth || 340;
        const height = canvasContainer.clientHeight || 340;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 7.5;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lights - Radiant neon & specular illumination matching original mascot
        const ambientLight = new THREE.AmbientLight(0x9333EA, 1.6);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
        keyLight.position.set(4, 6, 5);
        scene.add(keyLight);

        const frontSoftLight = new THREE.DirectionalLight(0xF5F3FF, 1.2);
        frontSoftLight.position.set(-2, 2, 6);
        scene.add(frontSoftLight);

        const purpleRim = new THREE.PointLight(0xA855F7, 4.2, 16);
        purpleRim.position.set(-3.5, 2, 2.5);
        scene.add(purpleRim);

        const cyanAccent = new THREE.PointLight(0xC084FC, 3.4, 14);
        cyanAccent.position.set(3.5, -1, 2);
        scene.add(cyanAccent);

        const bottomGlow = new THREE.PointLight(0xE879F9, 4.5, 14);
        bottomGlow.position.set(0, -3.2, 1.8);
        scene.add(bottomGlow);

        const topAntennaGlow = new THREE.PointLight(0xF472B6, 3.2, 10);
        topAntennaGlow.position.set(0, 3.5, 1);
        scene.add(topAntennaGlow);

        // 3D Robot Head Group
        const robotGroup = new THREE.Group();
        scene.add(robotGroup);

        const headGroup = new THREE.Group();
        robotGroup.add(headGroup);

        // 1. Glossy White/Lilac Helmet Body (Radius 1.68, scaled Z 0.92, outer front Z = 1.54)
        const helmetGeo = new THREE.SphereGeometry(1.68, 48, 48);
        helmetGeo.scale(1.06, 1.0, 0.92);
        const helmetMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          roughness: 0.08,
          metalness: 0.12,
          emissive: 0x3B0764,
          emissiveIntensity: 0.35
        });
        const helmet = new THREE.Mesh(helmetGeo, helmetMat);
        headGroup.add(helmet);

        // 2. Visor (Dark Purple Screen protruding proudly on the front, outer front Z = 1.69)
        const visorGeo = new THREE.SphereGeometry(1.3, 48, 48);
        visorGeo.scale(1.02, 0.88, 0.65);
        const visorMat = new THREE.MeshStandardMaterial({
          color: 0x140428,
          roughness: 0.08,
          metalness: 0.35,
          emissive: 0x1E063D,
          emissiveIntensity: 0.9
        });
        const visor = new THREE.Mesh(visorGeo, visorMat);
        visor.position.set(0, 0.08, 0.85);
        headGroup.add(visor);

        // 2b. Visor Neon Bezel Ring (glowing purple rim framing the face, as in image_6f4620.png)
        const bezelGeo = new THREE.TorusGeometry(1.24, 0.045, 16, 48);
        const bezelMat = new THREE.MeshStandardMaterial({
          color: 0xC084FC,
          emissive: 0x9333EA,
          emissiveIntensity: 3.5,
          roughness: 0.1,
          metalness: 0.2
        });
        const bezel = new THREE.Mesh(bezelGeo, bezelMat);
        bezel.position.set(0, 0.08, 1.48);
        bezel.scale.set(1.0, 0.86, 1.0);
        headGroup.add(bezel);

        // 3. Antennas (Stems + Glossy Spheres + Glowing Purple Tips)
        const stemGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.72, 16);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.1, metalness: 0.2 });
        const ballGeo = new THREE.SphereGeometry(0.2, 24, 24);
        const ballMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          roughness: 0.06,
          metalness: 0.08,
          emissive: 0xC084FC,
          emissiveIntensity: 0.5
        });
        const tipGeo = new THREE.SphereGeometry(0.09, 16, 16);
        const tipMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          emissive: 0xEC4899,
          emissiveIntensity: 3.5
        });

        // Left Antenna
        const leftStem = new THREE.Mesh(stemGeo, stemMat);
        leftStem.position.set(-0.72, 1.85, 0);
        leftStem.rotation.z = 0.35;
        headGroup.add(leftStem);

        const leftBall = new THREE.Mesh(ballGeo, ballMat);
        leftBall.position.set(-0.86, 2.18, 0);
        headGroup.add(leftBall);

        const leftTip = new THREE.Mesh(tipGeo, tipMat);
        leftTip.position.copy(leftBall.position);
        headGroup.add(leftTip);

        // Right Antenna
        const rightStem = new THREE.Mesh(stemGeo, stemMat);
        rightStem.position.set(0.72, 1.85, 0);
        rightStem.rotation.z = -0.35;
        headGroup.add(rightStem);

        const rightBall = new THREE.Mesh(ballGeo, ballMat);
        rightBall.position.set(0.86, 2.18, 0);
        headGroup.add(rightBall);

        const rightTip = new THREE.Mesh(tipGeo, tipMat);
        rightTip.position.copy(rightBall.position);
        headGroup.add(rightTip);

        // 4. Digital Glowing Eyes (Placed on the front of the visor at Z = 1.72)
        const eyesGroup = new THREE.Group();
        eyesGroup.position.set(0, 0.18, 1.72);
        headGroup.add(eyesGroup);

        const eyeGeo = new THREE.SphereGeometry(0.155, 24, 24);
        const eyeMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          emissive: 0xF5F3FF,
          emissiveIntensity: 4.5,
          roughness: 0.02
        });

        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.scale.set(1.0, 1.65, 0.4);
        leftEye.position.set(-0.46, 0, 0);
        eyesGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.scale.set(1.0, 1.65, 0.4);
        rightEye.position.set(0.46, 0, 0);
        eyesGroup.add(rightEye);

        // 5. Smiling Mouth (Placed on the front of the visor at Z = 1.70)
        const mouthGeo = new THREE.TorusGeometry(0.22, 0.04, 12, 32, Math.PI * 0.75);
        const mouthMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          emissive: 0xE9D5FF,
          emissiveIntensity: 3.5
        });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, -0.22, 1.70);
        mouth.rotation.z = Math.PI; // upside down creates friendly smile
        headGroup.add(mouth);

        // 6. Glowing Orbital Halo Ring
        const ringGeo = new THREE.TorusGeometry(2.35, 0.02, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xC084FC,
          emissive: 0xA855F7,
          emissiveIntensity: 2.2,
          transparent: true,
          opacity: 0.65
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        headGroup.add(ring);

        // Cute Autonomous Emotions Definitions with Dynamic 3D SVG Icons
        function getEmotionSvg(type) {
          if (type === 'think') {
            return `<svg class="w-5 h-5 text-amber-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>`;
          }
          if (type === 'code') {
            return `<svg class="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
          }
          if (type === 'learn') {
            return `<svg class="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.7)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>`;
          }
          return `<svg class="w-5 h-5 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.7)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>`;
        }

        const emotions = [
          {
            name: 'think',
            status: 'Bosh qotirmoqda...',
            color: '#F59E0B',
            text: 'Bosh qotiryapman: Bu masalani qanday optimal yechsam ekan...?',
            targetRotZ: 0.25,
            targetRotY: -0.25,
            targetRotX: -0.18,
            eyeScaleY: 1.1,
            eyeShiftX: 0.08,
            eyeShiftY: 0.08
          },
          {
            name: 'code',
            status: 'Kod yozmoqda...',
            color: '#10B981',
            text: 'Code yozmoqdaman: Yangi Web va Sun’iy Intellekt loyihasi...',
            targetRotZ: 0.0,
            targetRotY: 0.0,
            targetRotX: 0.22,
            eyeScaleY: 0.85,
            eyeShiftX: 0.0,
            eyeShiftY: -0.06
          },
          {
            name: 'learn',
            status: 'O‘rganmoqda...',
            color: '#8B5CF6',
            text: 'Yangi bilim: Robototexnika, datchiklar va algoritmlar!',
            targetRotZ: -0.18,
            targetRotY: 0.22,
            targetRotX: -0.12,
            eyeScaleY: 1.75,
            eyeShiftX: 0.08,
            eyeShiftY: 0.05
          },
          {
            name: 'happy',
            status: 'Quvnoq & Faol',
            color: '#EC4899',
            text: 'Robocode bilan kelajak kasbini egallang!',
            targetRotZ: 0.05,
            targetRotY: 0.0,
            targetRotX: 0.0,
            eyeScaleY: 1.4,
            eyeShiftX: 0.0,
            eyeShiftY: 0.0
          }
        ];

        let currentEmotionIdx = 0;
        let isIdle = false;
        let idleTimeout = null;
        let emotionInterval = null;
        let heroTypewriterInterval = null;
        let heroThinkingTimeout = null;

        let mouseX = 0;
        let mouseY = 0;
        let targetRotX = 0;
        let targetRotY = 0;
        let targetRotZ = 0;
        let targetEyeX = 0;
        let targetEyeY = 0;
        let targetEyeScaleY = 1.65;

        // Realistic typewriter effect with streaming characters and blinking cursor
        function typeWriterText(targetEl, fullText, speed, onDone) {
          if (!targetEl) return;
          if (heroTypewriterInterval) clearInterval(heroTypewriterInterval);

          let charIdx = 0;
          const cursorHtml = '<span class="inline-block w-1.5 h-3.5 bg-brand-neon ml-1 rounded-sm animate-pulse align-middle"></span>';
          targetEl.innerHTML = cursorHtml;

          heroTypewriterInterval = setInterval(function() {
            if (charIdx >= fullText.length) {
              clearInterval(heroTypewriterInterval);
              heroTypewriterInterval = null;
              targetEl.textContent = fullText;
              if (onDone) onDone();
              return;
            }
            charIdx++;
            targetEl.innerHTML = fullText.slice(0, charIdx) + cursorHtml;
          }, speed || 28);
        }

        function setEmotion(idx) {
          const emo = emotions[idx];
          if (heroThinkingTimeout) clearTimeout(heroThinkingTimeout);
          if (heroTypewriterInterval) clearInterval(heroTypewriterInterval);

          // 1. Enter thinking phase first
          targetRotZ = emo.targetRotZ * 1.2;
          targetRotY = emo.targetRotY;
          targetRotX = -0.22;
          targetEyeScaleY = 1.1;
          targetEyeX = 0.06;
          targetEyeY = 0.06;

          if (speechIcon) speechIcon.innerHTML = getEmotionSvg('think');
          if (statusText) statusText.textContent = 'Robot o‘ylanmoqda...';
          if (statusDot) {
            statusDot.style.backgroundColor = '#F59E0B';
            statusDot.classList.add('animate-ping');
          }
          if (speechText) {
            speechText.innerHTML = '<span class="inline-flex items-center gap-1.5 py-0.5 text-xs text-amber-300 font-mono italic"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span><span class="w-1.5 h-1.5 rounded-full bg-brand-neon animate-bounce" style="animation-delay:0.15s"></span><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style="animation-delay:0.3s"></span><span>fikrlamoqda...</span></span>';
          }

          // 2. Realistic transition from thinking to typing
          heroThinkingTimeout = setTimeout(function() {
            targetRotZ = emo.targetRotZ;
            targetRotX = emo.targetRotX;
            targetEyeScaleY = emo.eyeScaleY;
            targetEyeX = emo.eyeShiftX;
            targetEyeY = emo.eyeShiftY;

            if (speechIcon) speechIcon.innerHTML = getEmotionSvg(emo.name);
            if (statusText) statusText.textContent = 'Faoliyat: ' + emo.status;
            if (statusDot) {
              statusDot.style.backgroundColor = emo.color;
              statusDot.classList.remove('animate-ping');
            }

            // Real letter-by-letter typing animation
            typeWriterText(speechText, emo.text, 28);
          }, 450);
        }

        function startIdleEmotions() {
          isIdle = true;
          setEmotion(currentEmotionIdx);
          if (emotionInterval) clearInterval(emotionInterval);
          emotionInterval = setInterval(function() {
            currentEmotionIdx = (currentEmotionIdx + 1) % emotions.length;
            setEmotion(currentEmotionIdx);
          }, 3800);
        }

        function resetToCursorMode() {
          isIdle = false;
          targetRotZ = 0;
          targetEyeScaleY = 1.65;
          if (emotionInterval) {
            clearInterval(emotionInterval);
            emotionInterval = null;
          }
          if (speechIcon) speechIcon.innerHTML = getEmotionSvg('happy');
          if (speechText) speechText.textContent = 'Kursoringizni ko‘rib turibman!';
          if (statusText) statusText.textContent = 'Faoliyat: Kursorni kuzatmoqda';
          if (statusDot) statusDot.style.backgroundColor = '#8B5CF6';
        }

        // Mouse Move on Window
        window.addEventListener('mousemove', function(e) {
          const rect = canvas3d.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          mouseX = Math.max(-1, Math.min(1, (e.clientX - cx) / 450));
          mouseY = Math.max(-1, Math.min(1, (e.clientY - cy) / 450));

          resetToCursorMode();

          if (idleTimeout) clearTimeout(idleTimeout);
          idleTimeout = setTimeout(function() {
            startIdleEmotions();
          }, 2000);
        });

        // Mouse leaves document
        document.addEventListener('mouseleave', function() {
          startIdleEmotions();
        });

        // Click on 3D Robot triggers a cute friendly bounce
        canvasContainer.addEventListener('click', function() {
          resetToCursorMode();
          if (speechIcon) speechIcon.textContent = '✨';
          if (speechText) speechText.textContent = 'Salom! Robocode IT akademiyasiga xush kelibsiz!';
          // Mini jump
          robotGroup.position.y = 0.45;
          setTimeout(function() {
            robotGroup.position.y = 0;
          }, 280);
        });

        // Resize handler
        window.addEventListener('resize', function() {
          const nw = canvasContainer.clientWidth || 340;
          const nh = canvasContainer.clientHeight || 340;
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        });

        // Initial idle timer kick-off
        idleTimeout = setTimeout(function() {
          startIdleEmotions();
        }, 1800);

        // Animation Render Loop
        const mascotStartTime = performance.now();
        function animate() {
          requestAnimationFrame(animate);
          const elapsed = (performance.now() - mascotStartTime) / 1000;

          // Gentle floating bob
          robotGroup.position.y += ((Math.sin(elapsed * 2.2) * 0.12) - robotGroup.position.y) * 0.1;
          ring.rotation.z = elapsed * 0.35;

          // Cute antenna bulb pulse
          tipMat.emissiveIntensity = 2.0 + Math.sin(elapsed * 4) * 0.8;

          if (!isIdle) {
            targetRotY = mouseX * 0.48;
            targetRotX = -mouseY * 0.38;
            targetEyeX = mouseX * 0.12;
            targetEyeY = -mouseY * 0.08;
          }

          // Smooth interpolation (Lerp) for natural robotic movement
          headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.08;
          headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.08;
          headGroup.rotation.z += (targetRotZ - headGroup.rotation.z) * 0.08;

          eyesGroup.position.x += (targetEyeX - eyesGroup.position.x) * 0.1;
          eyesGroup.position.y += (0.15 + targetEyeY - eyesGroup.position.y) * 0.1;

          leftEye.scale.y += (targetEyeScaleY - leftEye.scale.y) * 0.1;
          rightEye.scale.y += (targetEyeScaleY - rightEye.scale.y) * 0.1;

          renderer.render(scene, camera);
        }
        animate();
      }


      
      // 10. Floating Robot Widget & AI Chat Assistant Logic with Real Typing Animation
      const floatingWidget = document.getElementById('floating-robot-widget');
      const floatingBtn = document.getElementById('floating-robot-btn');
      const chatWindow = document.getElementById('robot-chat-window');
      const closeChatBtn = document.getElementById('close-chat-btn');
      const openChatFromHero = document.getElementById('open-chat-from-hero');
      const heroRobotBox = document.getElementById('hero-robot-box');
      const chatForm = document.getElementById('chat-input-form');
      const chatInput = document.getElementById('chat-user-input');
      const chatMessages = document.getElementById('chat-messages-container');
      const quickChips = document.querySelectorAll('.quick-chip');

      // Floating robot widget is always visible and interactive in bottom-right corner
      if (floatingWidget) {
        floatingWidget.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
        floatingWidget.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
      }

      function toggleChatWindow() {
        if (!chatWindow) return;
        const isHidden = chatWindow.classList.contains('hidden');
        if (isHidden) {
          chatWindow.classList.remove('hidden');
          if (chatInput) chatInput.focus();
        } else {
          chatWindow.classList.add('hidden');
        }
      }

      function openChatWindow() {
        if (!chatWindow) return;
        chatWindow.classList.remove('hidden');
        if (chatInput) chatInput.focus();
      }

      function closeChatWindow() {
        if (!chatWindow) return;
        chatWindow.classList.add('hidden');
      }

      // Robot & Chat Click Triggers (both right-side floating robot icon and Hero robot mascot)
      const robotTriggers = [
        document.getElementById('floating-robot-btn'),
        document.getElementById('floating-robot-tooltip'),
        document.getElementById('open-chat-from-hero'),
        document.getElementById('hero-robot-box'),
        document.getElementById('robot-canvas-container'),
        document.getElementById('robot-3d-canvas'),
        document.getElementById('robot-speech-bubble')
      ];

      robotTriggers.forEach(function(trigger) {
        if (trigger) {
          trigger.style.cursor = 'pointer';
          trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openChatWindow();
          });
        }
      });

      if (closeChatBtn) {
        closeChatBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          closeChatWindow();
        });
      }

      // 11. Mentors Swiper Carousel (Continuous Auto-swiping, Touch Gestures & Mouse Drag)
      const mentorTrack = document.getElementById('mentor-carousel-track');
      const prevMentorBtn = document.getElementById('mentor-swipe-prev');
      const nextMentorBtn = document.getElementById('mentor-swipe-next');
      const mentorDots = document.querySelectorAll('.mentor-dot');

      if (mentorTrack) {
        let isPaused = false;
        let resumeTimer = null;
        let isMouseDown = false;
        let mouseStartX = 0;
        let mouseScrollLeft = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartScroll = 0;
        let isSwiping = false;

        function getCardStep() {
          const firstCard = mentorTrack.querySelector('.mentor-card-item');
          if (firstCard) {
            return firstCard.offsetWidth + 20; // card width + gap (20px)
          }
          return window.innerWidth < 640 ? 300 : 340;
        }

        function updateActiveDot() {
          if (!mentorDots.length) return;
          const step = getCardStep();
          const currentIdx = Math.round(mentorTrack.scrollLeft / step);
          mentorDots.forEach((dot, idx) => {
            if (idx === Math.min(Math.max(currentIdx, 0), mentorDots.length - 1)) {
              dot.classList.remove('w-2', 'bg-brand-border');
              dot.classList.add('w-8', 'bg-brand-neon', 'shadow-md', 'shadow-purple-500/50');
            } else {
              dot.classList.remove('w-8', 'bg-brand-neon', 'shadow-md', 'shadow-purple-500/50');
              dot.classList.add('w-2', 'bg-brand-border');
            }
          });
        }

        mentorTrack.addEventListener('scroll', () => {
          updateActiveDot();
        }, { passive: true });

        function swipeMentor(direction) {
          if (!mentorTrack) return;
          const step = getCardStep();
          const maxScroll = mentorTrack.scrollWidth - mentorTrack.clientWidth;
          
          if (direction === 'next') {
            if (mentorTrack.scrollLeft >= maxScroll - 35) {
              mentorTrack.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              mentorTrack.scrollBy({ left: step, behavior: 'smooth' });
            }
          } else {
            if (mentorTrack.scrollLeft <= 35) {
              mentorTrack.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
              mentorTrack.scrollBy({ left: -step, behavior: 'smooth' });
            }
          }
        }

        function pauseTemporarily(durationMs = 4500) {
          isPaused = true;
          if (resumeTimer) clearTimeout(resumeTimer);
          resumeTimer = setTimeout(() => {
            isPaused = false;
          }, durationMs);
        }

        if (nextMentorBtn) {
          nextMentorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pauseTemporarily();
            swipeMentor('next');
          });
        }
        if (prevMentorBtn) {
          prevMentorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pauseTemporarily();
            swipeMentor('prev');
          });
        }

        // Dot navigation
        mentorDots.forEach((dot, idx) => {
          dot.addEventListener('click', (e) => {
            e.preventDefault();
            pauseTemporarily();
            const step = getCardStep();
            mentorTrack.scrollTo({ left: idx * step, behavior: 'smooth' });
          });
        });

        // Continuous Auto-swipe interval
        mentorSwipeInterval = setInterval(() => {
          if (!isPaused && mentorTrack) {
            swipeMentor('next');
          }
        }, 3200);

        // Hover pause on desktop only (using matchMedia to avoid sticky pause on mobile touchscreens)
        mentorTrack.addEventListener('mouseenter', () => {
          if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
            isPaused = true;
          }
        });
        mentorTrack.addEventListener('mouseleave', () => {
          if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
            isPaused = false;
          }
        });

        // Touch gestures for mobile & tablet
        mentorTrack.addEventListener('touchstart', (e) => {
          pauseTemporarily(6000);
          if (e.touches && e.touches[0]) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartScroll = mentorTrack.scrollLeft;
            isSwiping = true;
          }
        }, { passive: true });

        mentorTrack.addEventListener('touchmove', (e) => {
          if (!isSwiping || !e.touches || !e.touches[0]) return;
          const currentX = e.touches[0].clientX;
          const currentY = e.touches[0].clientY;
          const diffX = touchStartX - currentX;
          const diffY = touchStartY - currentY;
          if (Math.abs(diffX) > Math.abs(diffY)) {
            mentorTrack.scrollLeft = touchStartScroll + diffX;
          }
        }, { passive: true });

        mentorTrack.addEventListener('touchend', (e) => {
          if (!isSwiping || !e.changedTouches || !e.changedTouches[0]) return;
          isSwiping = false;
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const diffX = touchStartX - touchEndX;
          const diffY = touchStartY - touchEndY;

          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if (diffX > 0) {
              swipeMentor('next');
            } else {
              swipeMentor('prev');
            }
          }
          pauseTemporarily(4000);
        }, { passive: true });

        // Mouse drag handling for desktop
        mentorTrack.addEventListener('mousedown', (e) => {
          isMouseDown = true;
          pauseTemporarily(6000);
          mouseStartX = e.pageX - mentorTrack.offsetLeft;
          mouseScrollLeft = mentorTrack.scrollLeft;
          mentorTrack.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
          if (!isMouseDown || !mentorTrack) return;
          e.preventDefault();
          const x = e.pageX - mentorTrack.offsetLeft;
          const walk = (x - mouseStartX) * 1.4;
          mentorTrack.scrollLeft = mouseScrollLeft - walk;
        });

        window.addEventListener('mouseup', () => {
          if (isMouseDown) {
            isMouseDown = false;
            if (mentorTrack) {
              mentorTrack.style.cursor = 'grab';
            }
            pauseTemporarily(4000);
          }
        });
      }

      // Knowledge Base grounded strictly in crm-oquv-markaz2.vercel.app
      function getBotAnswer(question) {
        const q = question.toLowerCase();

        if (q.includes('kurs') || q.includes('yo‘nalish') || q.includes('dasturlash') || q.includes('ta’lim') || q.includes('qanday')) {
          return '<span class="inline-flex items-center gap-1.5 text-brand-neon font-bold text-sm"><svg class="w-4 h-4 text-brand-neon inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Robocode IT Akademiyasining barcha yo‘nalishlari:</span><br><br>' +
            '🤖 **1. Robototexnika (10 oy, 7-15 yosh):**<br>Elektronika, mikrosxemalar, datchiklar, Scratch, mBlock va masofadan boshqariladigan aqlli robotlar yaratish.<br><br>' +
            '💻 **2. Front-End React (6 oy, 16+ yosh):**<br>HTML5, CSS3, JavaScript, React.js, Tailwind CSS va real portfolio loyihalari.<br><br>' +
            '⚙️ **3. Back-End Dasturlash (6 oy):**<br>REST API arxitekturasi, Node.js/Python, PostgreSQL/MongoDB, server boshqaruvi va deploy.<br><br>' +
            '🎨 **4. Grafik va Web (UI/UX) Dizayn (6 oy):**<br>Photoshop, Illustrator va Figma orqali brending, veb va mobil ilovalar dizayni.<br><br>' +
            '⚡ **5. Vibe Coding & AI (2 oy):**<br>Sun’iy intellekt (AI) yordamida tezkor veb-dasturlash va real loyihalar yaratish.<br><br>' +
            '🚀 **6. Startup Inkubator (5 oy):**<br>UZCombinator hamkorligida $20 000 gacha investitsiya jalb qilish va MVP chiqarish.<br><br>' +
            '💰 **To‘lov:** Barcha kurslarimiz oyiga **743 000 so‘m** dan boshlanadi. Bepul sinov darsi mavjud!';
        }

        if (q.includes('narx') || q.includes('qancha') || q.includes('to‘lov') || q.includes('pul') || q.includes('oyiga')) {
          return 'Barcha kurslarimiz narxi atiga **743 000 so‘m/oy** dan boshlanadi! Bo‘lib to‘lash imkoniyati, xalqaro sertifikat hamda iqtidorli talabalar uchun bepul grant o‘rinlari mavjud.';
        }
        if (q.includes('robot') || q.includes('konstruktor') || q.includes('datchik')) {
          return '<span class="inline-flex items-center gap-1.5 text-brand-neon font-bold"><svg class="w-4 h-4 text-brand-neon inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg> Robototexnika kursi (10 oy):</span><br>• 1. Elektronika va fizika: mikrosxemalar, tranzistorlar va datchiklar.<br>• 2. Dasturlash: Scratch, mBlock, o‘yinlar va multfilmlar yaratish.<br>• 3. Aqlli robotlar: Wi-Fi/Bluetooth masofaviy boshqaruv va amaliy konstruksiya.<br>Oylik to‘lov: 743 000 so‘m.';
        }
        if (q.includes('front') || q.includes('react') || q.includes('veb') || q.includes('html')) {
          return '<span class="inline-flex items-center gap-1.5 text-cyan-400 font-bold"><svg class="w-4 h-4 text-cyan-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Front-End kursi (6 oy):</span><br>• 1-oy: HTML5 asoslari va semantika.<br>• 2-3-oy: CSS3, Flexbox, Grid va responsiv dizayn.<br>• 4-5-oy: JavaScript, DOM, funksiyalar va asinxron so‘rovlar.<br>• 6-oy: React.js va real SPA mijoz loyihalari, GitHub portfolio.';
        }
        if (q.includes('back') || q.includes('server') || q.includes('api') || q.includes('baza')) {
          return '<span class="inline-flex items-center gap-1.5 text-emerald-400 font-bold"><svg class="w-4 h-4 text-emerald-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg> Back-End kursi (6 oy):</span><br>REST API arxitekturasi, ma’lumotlar bazasi (PostgreSQL / MongoDB), autentifikatsiya va serverga deploy qilish. Bitiruvchilar haqiqiy e-tijorat va CRM tizimlari backendini yaratishadi.';
        }
        if (q.includes('vibe') || q.includes('ai') || q.includes('sun’iy') || q.includes('tezkor')) {
          return '<span class="inline-flex items-center gap-1.5 text-amber-300 font-bold"><svg class="w-4 h-4 text-amber-300 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Vibe Coding kursi (2 oy):</span><br>AI vositalari yordamida zamonaviy front-end texnologiyalarida tezkor dasturlash, real mijoz loyihalari va responsiv veb-interfeyslar yaratish.';
        }
        if (q.includes('dizayn') || q.includes('figma') || q.includes('ui') || q.includes('ux') || q.includes('photoshop')) {
          return '<span class="inline-flex items-center gap-1.5 text-pink-400 font-bold"><svg class="w-4 h-4 text-pink-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="7" r="1" fill="currentColor"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/></svg> Grafik va Web (UI/UX) Dizayn (6 oy):</span><br>Photoshop (3 oy), Illustrator (3 oy) va Figma UI/UX (6 oy). Foydalanuvchi tajribasi, brending va mobil ilovalar interfeysini loyihalash o‘rgatiladi.';
        }
        if (q.includes('manzil') || q.includes('qayerda') || q.includes('joylashuv') || q.includes('telefon') || q.includes('aloqa')) {
          return '<span class="inline-flex items-center gap-1.5 text-rose-400 font-bold"><svg class="w-4 h-4 text-rose-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Manzilimiz:</span> Andijon shahri, P8WW+P7G, Ulitsa Lermontova (Robocode IT markazi laboratoriyasi).<br><span class="inline-flex items-center gap-1.5 text-emerald-400 font-bold"><svg class="w-4 h-4 text-emerald-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Telefonlar:</span> +998 99 899 9005, +998 93 075 9005.<br>⏰ **Ish vaqti:** Har kuni 9:00 dan 18:00 gacha.';
        }
        if (q.includes('startup') || q.includes('startap') || q.includes('20') || q.includes('investitsiya') || q.includes('grant')) {
          return '<span class="inline-flex items-center gap-1.5 text-pink-400 font-bold"><svg class="w-4 h-4 text-pink-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg> Startup Inkubator (5 oy):</span><br>UZCombinator hamkorligida eng iqtidorli talabalar loyihalari uchun **$20 000 gacha investitsiya** jalb qilish, MVP mahsulot yaratish va xalqaro bozorga chiqish imkoniyati!';
        }
        if (q.includes('mentor') || q.includes('o‘qituvchi') || q.includes('ustoz') || q.includes('jamoa')) {
          return '<span class="inline-flex items-center gap-1.5 text-brand-neon font-bold"><svg class="w-4 h-4 text-brand-neon inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Mentorlarimiz:</span><br>• Abdulaziz Yakubov (Asoschi, Yoshlar Ventures)<br>• Akhmadullo Nurmakhamatov (Team Lead, Turin bitiruvchisi)<br>• Shuxratbek Aliyev (UI/UX Lead, Vodiy Brend)<br>• Ziyodullo Shuxratbekov (Startup Mentor, $700k+ investitsiya)<br>Hamda 10 nafardan ortiq xalqaro tajribaga ega amaliyotchi dasturchilar!';
        }
        if (q.includes('yosh') || q.includes('bolalar') || q.includes('katta')) {
          return 'Akademiyamizda 7 yoshdan 15 yoshgacha bolalar uchun Robototexnika va Foundation, 16 yoshdan 45 yoshgacha esa Dasturlash (Front/Back), Vibe Coding, Dizayn va Startup guruhlari mavjud.';
        }
        if (q.includes('yozil') || q.includes('ro‘yxat') || q.includes('ariza')) {
          return 'Arizangizni sahifadagi "Ariza topshirish" bo‘limida qoldirishingiz mumkin. Administratorlarimiz 15 daqiqa ichida siz bilan bog‘lanib, bepul sinov darsiga yozib qo‘yadilar!';
        }
        return 'Savolingiz uchun tashakkur! Robocode IT akademiyasida bepul sinov darsiga yozilish uchun sahifa pastidagi ariza shaklini to‘ldiring yoki **+998 99 899 9005** raqamiga qo‘ng‘iroq qiling!';
      }

      function appendMessage(sender, text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' ? 'flex justify-end' : 'flex items-start gap-2.5';

        if (sender === 'user') {
          msgDiv.innerHTML = '<div class="p-3 rounded-2xl rounded-tr-sm bg-brand-purple text-white leading-relaxed max-w-[85%] font-medium">' + text + '</div>';
        } else {
          msgDiv.innerHTML = '<div class="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-brand-neon/60 bg-brand-card p-1 flex items-center justify-center">' +
            '<svg class="w-4 h-4 text-brand-neon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>' +
            '</div><div class="bot-msg-content p-3.5 rounded-2xl rounded-tl-sm bg-brand-card border border-brand-border text-slate-200 leading-relaxed max-w-[85%] space-y-2">' + text + '</div>';
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
      }

      // Live streaming typewriter animation with tokenized HTML tags and blinking cursor
      function streamBotAnswer(targetEl, fullHtml, speed, onComplete) {
        let tokens = [];
        let i = 0;
        while (i < fullHtml.length) {
          if (fullHtml[i] === '<') {
            let closeIdx = fullHtml.indexOf('>', i);
            if (closeIdx !== -1) {
              tokens.push({ isTag: true, val: fullHtml.slice(i, closeIdx + 1) });
              i = closeIdx + 1;
              continue;
            }
          }
          tokens.push({ isTag: false, val: fullHtml[i] });
          i++;
        }

        let tokenIdx = 0;
        let currentHtml = '';
        const cursorHtml = '<span class="inline-block w-1.5 h-3.5 bg-brand-neon ml-1 rounded-sm animate-pulse align-middle"></span>';
        targetEl.innerHTML = cursorHtml;

        const interval = setInterval(function() {
          if (tokenIdx >= tokens.length) {
            clearInterval(interval);
            targetEl.innerHTML = currentHtml;
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
            if (onComplete) onComplete();
            return;
          }

          while (tokenIdx < tokens.length && tokens[tokenIdx].isTag) {
            currentHtml += tokens[tokenIdx].val;
            tokenIdx++;
          }

          if (tokenIdx < tokens.length) {
            currentHtml += tokens[tokenIdx].val;
            tokenIdx++;
          }

          targetEl.innerHTML = currentHtml + cursorHtml;
          if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        }, speed || 20);
      }

      function handleUserQuestion(userText) {
        if (!userText || !userText.trim()) return;
        appendMessage('user', userText.trim());

        // 1. Show animated thinking indicator
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'flex items-start gap-2.5 bot-thinking-indicator';
        thinkingDiv.innerHTML = '<div class="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-brand-neon/60 bg-brand-card p-1 flex items-center justify-center">' +
          '<svg class="w-4 h-4 text-brand-neon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>' +
          '</div>' +
          '<div class="p-3.5 rounded-2xl rounded-tl-sm bg-brand-card border border-brand-border text-slate-200 leading-relaxed max-w-[85%] space-y-1.5 shadow-lg">' +
          '<div class="flex items-center gap-2 text-xs text-brand-neon font-bold">' +
          '<svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>' +
          '<span>Robocode AI o‘ylanmoqda...</span>' +
          '</div>' +
          '<div class="flex items-center gap-1.5 pt-1">' +
          '<span class="w-2 h-2 rounded-full bg-brand-neon animate-bounce" style="animation-delay:0s"></span>' +
          '<span class="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style="animation-delay:0.15s"></span>' +
          '<span class="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style="animation-delay:0.3s"></span>' +
          '<span class="text-xs text-slate-400 ml-2 italic">javob tahlil qilinmoqda</span>' +
          '</div>' +
          '</div>';

        chatMessages.appendChild(thinkingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 2. Realistic thinking delay, then live typewriter streaming
        setTimeout(function() {
          if (thinkingDiv && thinkingDiv.parentNode) {
            thinkingDiv.parentNode.removeChild(thinkingDiv);
          }
          const rawAnswer = getBotAnswer(userText);
          const formattedAnswer = rawAnswer.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-brand-light font-bold">$1</strong>');

          const botMsgDiv = appendMessage('bot', '');
          if (botMsgDiv) {
            const contentBox = botMsgDiv.querySelector('.bot-msg-content');
            if (contentBox) {
              streamBotAnswer(contentBox, formattedAnswer, 22);
            }
          }
        }, 550);
      }

      if (chatForm && chatInput) {
        chatForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const val = chatInput.value;
          chatInput.value = '';
          handleUserQuestion(val);
        });
      }

      quickChips.forEach(function(chip) {
        chip.addEventListener('click', function() {
          const text = chip.textContent.replace(/^[^\w\sЀ-ӿ]+/, '').trim();
          handleUserQuestion(text);
        });
      });

      // 7. Language Switcher Buttons
      const langBtns = [
        document.getElementById('lang-uz'),
        document.getElementById('lang-ru'),
        document.getElementById('lang-en')
      ];
      langBtns.forEach(function(btn) {
        if (btn) {
          btn.addEventListener('click', function() {
            langBtns.forEach(function(b) {
              b.classList.remove('bg-brand-purple', 'text-white');
              b.classList.add('text-slate-300');
            });
            btn.classList.add('bg-brand-purple', 'text-white');
            btn.classList.remove('text-slate-300');
          });
        }
      });
    

    return () => {
      isMounted = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (idleTimeout) clearTimeout(idleTimeout);
      if (emotionInterval) clearInterval(emotionInterval);
      if (typewriterTimer) clearTimeout(typewriterTimer);
      if (thinkingDelayTimer) clearTimeout(thinkingDelayTimer);
      if (thinkingPhaseTimer) clearTimeout(thinkingPhaseTimer);
      if (mentorSwipeInterval) clearInterval(mentorSwipeInterval);
    };
  }, []);

  return (
    <div className="bg-brand-dark text-slate-100 font-sans antialiased selection:bg-brand-purple selection:text-white relative overflow-x-hidden min-h-screen">
      {/* Background Ambient Glows */}
  <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none -z-10 animate-glow"></div>
  <div className="fixed bottom-1/3 right-10 w-[500px] h-[500px] bg-brand-neon/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow"></div>
  <div className="fixed top-1/2 left-10 w-80 h-80 bg-brand-glow/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

  {/* Header / Navigation Bar: Fixed to top with floating rounded-full pill on scroll */}
  <header id="main-header" className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
    <div id="navbar-wrapper" className={`transition-all duration-300 w-full ${isScrolled ? 'px-3 sm:px-6 pt-2.5 sm:pt-4 max-w-7xl mx-auto' : 'px-0 pt-0'}`}>
      <div id="navbar-pill" className={`transition-all duration-300 w-full bg-brand-dark/95 backdrop-blur-md px-3.5 sm:px-8 flex items-center justify-between ${
        isScrolled
          ? 'rounded-2xl sm:rounded-full border border-brand-purple/50 bg-brand-surface/95 shadow-2xl shadow-purple-950/60 py-2 sm:py-3 px-3.5 sm:px-7'
          : 'rounded-none border-b border-brand-border/60 shadow-none py-3 sm:py-4'
      }`}>
        
        {/* Left: Robocode Logo & Brand */}
        <a href="#hero" className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-neon rounded-lg p-1 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-neon p-0.5 shadow-md shadow-brand-purple/40 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
            <img src="/assets/landing/landing_img_0.jpg" alt="Robocode Logo" className="w-full h-full object-cover rounded-[10px]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-brand-light transition-colors">Robocode</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-brand-purple/40 text-brand-light border border-brand-purple/50 font-medium">Academy</span>
            </div>
            <span className="text-[10px] text-brand-light/60 -mt-0.5 hidden sm:block">Andijondagi 1-IT Markaz</span>
          </div>
        </a>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-brand-light transition-colors py-1">Biz haqimizda</a>
          <a href="#courses" className="hover:text-brand-light transition-colors py-1">Kurslar</a>
          <a href="#startup" className="hover:text-brand-light transition-colors py-1">Startup $20k</a>
          <a href="#crm-preview" className="hover:text-brand-light transition-colors py-1">CRM Tizimi</a>
          <a href="#team" className="hover:text-brand-light transition-colors py-1">Jamoa</a>
          <a href="#faq" className="hover:text-brand-light transition-colors py-1">Savollar</a>
        </nav>

        {/* Right Side Controls: Language Switcher + Ariza topshirish (CTA) + Mobile Menu Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Language Switcher UZ | RU | EN */}
          <div className="flex items-center bg-brand-card/90 border border-brand-border/80 rounded-full px-1.5 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-slate-300">
            <button id="lang-uz" className="px-1.5 sm:px-2 py-0.5 rounded-full bg-brand-purple text-white shadow-sm transition-colors">UZ</button>
            <button id="lang-ru" className="px-1.5 sm:px-2 py-0.5 rounded-full hover:text-white transition-colors">RU</button>
            <button id="lang-en" className="px-1.5 sm:px-2 py-0.5 rounded-full hover:text-white transition-colors">EN</button>
          </div>

          {/* Ariza topshirish CTA Button: Hidden on small mobile screens to prevent overflow; visible on md: and up */}
          <a href="#ariza" className="hidden md:inline-flex items-center justify-center px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-neon hover:from-purple-600 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-brand-purple/30 hover:shadow-brand-purple/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0">
            Ariza topshirish
          </a>

          {/* Mobile Hamburger Menu Button: Always visible on < lg screens */}
          <button
            id="mobile-menu-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Menyuni ochish"
            className="lg:hidden p-2 rounded-xl bg-brand-card border border-brand-border text-slate-200 hover:text-white focus:outline-none flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
          >
            {isMobileMenuOpen ? (
              <svg id="close-icon" className="w-5 h-5 sm:w-6 sm:h-6 text-brand-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg id="menu-icon" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <div
        id="mobile-menu"
        className={`lg:hidden bg-brand-surface/98 backdrop-blur-xl px-5 pt-4 pb-6 space-y-3 shadow-2xl transition-all duration-300 ${
          isScrolled ? 'rounded-2xl mt-2 border border-brand-border' : 'border-b border-brand-border'
        } ${isMobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-1">Biz haqimizda</a>
        <a href="#courses" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-1">Kurslar</a>
        <a href="#startup" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-1">Startup $20k</a>
        <a href="#crm-preview" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-1 flex items-center justify-between">
          <span>CRM Boshqaruv Tizimi</span>
        </a>
        <a href="#team" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-1">Jamoa</a>
        <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-1">Savollar</a>
        <div className="pt-2 border-t border-brand-border/60">
          <a href="#ariza" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-purple to-brand-neon hover:from-purple-600 hover:to-indigo-500 text-white text-center transition-all shadow-md shadow-brand-purple/30">
            Ariza topshirish
          </a>
        </div>
      </div>
    </div>
  </header>

  {/* SECTION 1: HERO SECTION */}
  <section id="hero" className="relative pt-24 sm:pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-card/90 border border-brand-neon/40 text-xs font-medium text-brand-light shadow-md shadow-brand-purple/20">
            <span className="text-brand-neon font-bold text-sm">✦</span>
            <span>Andijondagi 1-raqamli IT va Robototexnika Akademiyasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            ROBOCODE — <br />
            <span className="bg-gradient-to-r from-brand-light via-brand-neon to-brand-purple bg-clip-text text-transparent neon-text-glow">
              ANDIJONDAGI BIRINCHI
            </span> <br />
            IT AKADEMIYA
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Biz bilan doim birinchi bo‘ling! Zamonaviy dasturlash tillari, robototexnika, AI vositalari, amaliy loyihalar va $20 000 lik startap inkubatsiyasi.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <a href="#courses" className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-neon hover:from-purple-600 hover:to-indigo-500 shadow-xl shadow-brand-purple/40 hover:shadow-brand-purple/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"  /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"  /></svg>
              Kurslarni ko‘rish
            </a>
            <a href="#ariza" className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-brand-light bg-brand-card hover:bg-brand-surface border border-brand-border hover:border-brand-neon transition-all flex items-center justify-center gap-2">
              <span>Konsultatsiya olish</span>
              <svg className="w-4 h-4 text-brand-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"  /></svg>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
              <span>100% Amaliy ta’lim</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
              <span>Rasmiy Diplom & Sertifikat</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
              <span>Ish bilan ta’minlash ko‘magi</span>
            </div>
          </div>
        </div>

        {/* Right Hero Visual: Three.js 3D Robot Mascot in Glowing Rounded Box */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          
          {/* Glowing Rounded Box Container (Mascot Qutichasi) with enhanced shadow */}
          <div id="hero-robot-box" className="relative w-full max-w-[360px] glass-card rounded-[32px] p-5 sm:p-6 border-2 border-brand-neon/80 robot-card-glow flex flex-col items-center group cursor-pointer transition-all duration-300 transform hover:scale-[1.02]" title="Robotga bosing! AI Chat ochilib, barcha kurslar haqida ma'lumot beradi">
            
            {/* Dynamic Speech / Emotion Bubble */}
            <div id="robot-speech-bubble" className="mb-2 px-4 py-2 rounded-2xl bg-brand-dark/90 border border-brand-neon/60 text-xs text-white shadow-xl shadow-purple-950/50 transition-all duration-500 flex items-center gap-2 max-w-xs text-center cursor-pointer hover:border-brand-neon">
              <span id="robot-speech-icon" className="w-6 h-6 flex items-center justify-center shrink-0"></span>
              <span id="robot-speech-text" className="font-medium text-slate-200">Salom! Savolingiz bo‘lsa, meni bosing!</span>
            </div>

            {/* 3D Three.js Canvas Container with Vibrant Glowing Halo Shadow */}
            <div id="robot-canvas-container" className="relative w-full h-[260px] sm:h-[280px] flex items-center justify-center select-none cursor-pointer">
              {/* Multi-layered Neon Ambient Aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/60 via-brand-neon/50 to-pink-500/40 rounded-full blur-2xl -z-10 pointer-events-none animate-pulse"></div>
              <div className="absolute -inset-4 bg-purple-600/30 rounded-full blur-3xl -z-20 pointer-events-none"></div>
              <canvas id="robot-3d-canvas" className="w-full h-full block rounded-2xl"></canvas>
            </div>

            {/* Box Bottom Badge & Chat Trigger */}
            <div className="mt-3 w-full flex items-center justify-between pt-3 border-t border-brand-border/60 text-xs">
              <div className="flex items-center gap-2">
                <span id="robot-status-dot" className="w-2.5 h-2.5 rounded-full bg-brand-neon"></span>
                <span id="robot-status-text" className="font-medium text-slate-300">Robocode AI Yordamchi</span>
              </div>
              <button id="open-chat-from-hero" className="px-3 py-1.5 rounded-xl bg-brand-purple/40 hover:bg-brand-purple text-brand-light hover:text-white border border-brand-purple text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-md">
                <span>Savol berish</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"  /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KEY METRICS BAR */}
      <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 sm:p-8 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white group-hover:text-brand-light transition-colors">3500+</div>
          <p className="mt-2 text-sm font-medium text-brand-light/80">Muvaffaqiyatli Bitiruvchilar</p>
          <div className="mt-3 text-xs text-slate-400">Andijon va butun O‘zbekiston bo‘ylab</div>
        </div>
        <div className="glass-card p-6 sm:p-8 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white group-hover:text-brand-light transition-colors">85%</div>
          <p className="mt-2 text-sm font-medium text-brand-light/80">Daromad Topayotganlar</p>
          <div className="mt-3 text-xs text-slate-400">Kursni tamomlagan bitiruvchilar bandligi</div>
        </div>
        <div className="glass-card p-6 sm:p-8 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white group-hover:text-brand-light transition-colors">$150 – $2500</div>
          <p className="mt-2 text-sm font-medium text-brand-light/80">O‘rtacha Oylik Maosh</p>
          <div className="mt-3 text-xs text-slate-400">Junior dan Senior darajagacha daromad</div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 2: SIZNI NIMALAR KUTYAPTI? */}
  <section id="about" className="py-20 relative bg-brand-surface/40 border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-bold tracking-widest text-brand-neon uppercase mb-2">Imkoniyatlar</h2>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">SIZNI NIMALAR KUTYAPTI</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Robocode IT akademiyasida har bir talaba faqat nazariya bilan cheklanmay, real ish bozori talablariga mos tajriba to‘playdi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl flex items-start gap-5 group hover:bg-brand-card/90 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/30 border border-brand-purple/60 flex items-center justify-center text-brand-neon shrink-0 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">Real Startup loyihalarda amaliy tajriba</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              O‘quv davomida har bir talaba haqiqiy mijozlar uchun dastur, bot yoki veb-sayt yaratadi hamda eng iqtidorlilar jamoamizga ishga taklif qilinadi.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl flex items-start gap-5 group hover:bg-brand-card/90 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/30 border border-brand-purple/60 flex items-center justify-center text-brand-neon shrink-0 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-brand-neon drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="m18 8 4-2-4-2v4z"/></svg></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">Tajribali Team Lead rahbarligida doimiy o‘sish</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Katta xalqaro va mahalliy kompaniyalarda faoliyat yuritgan tajribali dasturchilar sizga har kuni kod tahlili (Code Review) va mentorlik qiladi.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl flex items-start gap-5 group hover:bg-brand-card/90 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/30 border border-brand-purple/60 flex items-center justify-center text-brand-neon shrink-0 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">Bepul grant imkoniyati</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Kuchli bilim bazasi va ingliz tili darajasiga ega bo‘lgan iqtidorli yoshlar uchun to‘liq yoki qisman bepul o‘qish grantlari mavjud.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl flex items-start gap-5 group hover:bg-brand-card/90 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/30 border border-brand-purple/60 flex items-center justify-center text-brand-neon shrink-0 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">Faqat bilim emas — haqiqiy karyera</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              GitHub portfolioni shakllantirish, rezyume tayyorlash, texnik intervyulardan o‘tish va xalqaro frilans birjalarida buyurtma olish o‘rgatiladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 3: BIZNI TANLASH UCHUN SABABLAR (with 3D Icons Banner & Motivational Pedestal Cards) */}
  <section className="py-20 relative overflow-hidden" id="about">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-xs font-bold tracking-widest text-brand-neon uppercase mb-2">Afzalliklarimiz</h2>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">BIZNI TANLASH UCHUN SABABLAR</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Andijonda zamonaviy ta’lim standartlarini o‘rnatgan akademiyamizning 5 ta asosiy ustuni va motivatsiyasi.
        </p>
      </div>

      {/* 3D Feature Icons Showcase Banner (The 5 Pedestals / Kubiklar) */}
      <div className="glass-card rounded-3xl p-3 sm:p-6 mb-8 border-brand-neon/30 overflow-hidden shadow-2xl">
        <div className="relative rounded-2xl overflow-hidden group">
          <img src="/assets/landing/landing_img_1.jpg" alt="3D Feature Icons Set" className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-500" />
        </div>
      </div>

      {/* 5 Motivational Cards Aligned Directly to the 5 Pedestals (Kubiklarga mos motivatsion yozuvlar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Kubik 1: Asboblar (Wrench & Hammer) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-cyan-400 flex items-center justify-center text-lg shadow-sm"><svg className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">1-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Amaliyot & Real Loyihalar</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nazariya bilan cheklanmang! Birinchi oydanoq o‘z qo‘lingiz bilan real dasturlar va robotlar yarating. Har bir amaliy loyiha — katta IT sohasiga qo‘yilgan dadil qadamdir.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-pink-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg> O‘rgan, Yasa, Natijaga Erish!
            </span>
          </div>
        </div>

        {/* Kubik 2: Diplom va Shapka (Graduation Cap & Diploma) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-purple-400 flex items-center justify-center text-lg shadow-sm"><svg className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">2-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Xalqaro Sertifikat & Bilim</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Haqiqiy bilim — sizning eng ishonchli sarmoyangiz! Xalqaro darajadagi nufuzli sertifikatga ega bo‘lib, nafaqat O‘zbekiston, balki xorijiy IT bozorida ham yuqori qadrlaning.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              ⭐ Bilim — Kelajak Eshigining Kaliti!
            </span>
          </div>
        </div>

        {/* Kubik 3: CPU Mikrosxema (Central Processor) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-brand-neon flex items-center justify-center text-lg shadow-sm">⚡</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">3-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Ilg‘or Texnologiya & AI</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kelajakni kutmang, uni o‘zingiz dasturlang! Zamonaviy datchiklar, aqlli mikrosxemalar va sun’iy intellekt vositalarini o‘rganib, texnologiyalar asrining yetakchisiga aylaning.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-300 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg> Innovatsiyani Boshqar, Birinchi Bo‘l!
            </span>
          </div>
        </div>

        {/* Kubik 4: Qalqon va Sifat (Shield & Quality Checkmark) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-blue-400 flex items-center justify-center text-lg shadow-sm"><svg className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">4-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Kafolatlangan Sifat & Natija</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Biz sifatga va sizning natijangizga 100% kafolat beramiz! Shaxsiy mentorlik, doimiy sifat nazorati va har bir mavzuni chuqur o‘zlashtirish orqali kutilgan maqsadga erishing.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-rose-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Ishonchli Sifat — Mustahkam Kelajak!
            </span>
          </div>
        </div>

        {/* Kubik 5: Do'stona Robotlar Jamoasi (Team of Avatars) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-emerald-400 flex items-center justify-center text-lg shadow-sm"><svg className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a2 2 0 0 0 0-2.8l-4.2-4.2a2 2 0 0 0-2.8 0L7 12"/><path d="m18 10 1.4-1.4a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L14 6"/><path d="M10 14 7 17a2 2 0 0 1-2.8 0l-1.4-1.4a2 2 0 0 1 0-2.8L6 10"/><path d="m2 17 4 4"/></svg></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">5-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Do‘stona Hamjamiyat & Jamoa</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Yolg‘iz o‘rganishdan ko‘ra, kuchlilar safida bo‘ling! Tajribali ustozlar va intiluvchan safdoshlar muhiti sizni har kuni yangi marralar sari ilhomlantiradi.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              ✨ Birgalikda Biz Yengilmas Jamoamiz!
            </span>
          </div>
        </div>

      </div>
    </div>
  </section>

  {/* SECTION 4: SIZGA MOS YO'NALISHNI TANLANG (Courses Showcase) */}
  <section id="courses" className="py-20 relative bg-brand-surface/40 border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/30 border border-brand-purple/60 text-xs font-semibold text-brand-light mb-3">
          Barcha kurslarimiz oyiga atigi 743 ming so‘mdan boshlanadi
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">SIZGA MOS YO‘NALISHNI TANLANG</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Bolalar, maktab o‘quvchilari va kattalar uchun zamonaviy IT va robototexnika sohalari.
        </p>
      </div>

      {/* 3D Courses Showcase Visual Grid */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 mb-12 border-brand-neon/30 overflow-hidden shadow-2xl">
        <img src="/assets/landing/landing_img_2.jpg" alt="Robocode Course Showcase 3D" className="w-full h-auto object-cover rounded-2xl" />
      </div>

      {/* Interactive Course Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
        <button className="course-tab-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-purple text-white shadow-md transition-all" data-filter="all">Barchasi (8)</button>
        <button className="course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-card text-slate-300 hover:text-white border border-brand-border transition-all" data-filter="coding">Dasturlash</button>
        <button className="course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-card text-slate-300 hover:text-white border border-brand-border transition-all" data-filter="robotics">Robototexnika & AI</button>
        <button className="course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-card text-slate-300 hover:text-white border border-brand-border transition-all" data-filter="design">Dizayn</button>
        <button className="course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-card text-slate-300 hover:text-white border border-brand-border transition-all" data-filter="startup">Startup</button>
      </div>

      {/* Courses 8 Cards Grid */}
      <div id="course-cards-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Robototexnika */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="robotics">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">10 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">ROBOTOTEXNIKA</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Elektronika va fizika — mikrosxemalar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Dasturlash: Scratch, mBlock, o‘yinlar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Aqlli robotlar, datchiklar, Wi-Fi boshqaruvi</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Robototexnika">
            Kursga yozilish
          </button>
        </div>

        {/* 2. Foundation */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="coding">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-purple/20 text-brand-light border border-brand-purple/40">2 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">FOUNDATION</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Kompyuter asoslari va tizimlar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Word, Excel, PowerPoint, Canva</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> AI tools, Figma va Cloud vositalar</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Foundation">
            Kursga yozilish
          </button>
        </div>

        {/* 3. Front-End */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="coding">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">6 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">FRONT-END</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> HTML5, CSS3, Flexbox, Tailwind</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> JavaScript DOM, funksiyalar, API</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> React.js va real SPA loyihalar</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Front-End">
            Kursga yozilish
          </button>
        </div>

        {/* 4. Back-End */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="coding">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">6 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">BACK-END</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> REST API, ma’lumotlar bazasi (SQL)</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Autentifikatsiya, xavfsizlik, JWT</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Serverga joylash va GitHub portfolio</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Back-End">
            Kursga yozilish
          </button>
        </div>

        {/* 5. Web & UI/UX Dizayn */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="design">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">6 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">WEB (UI/UX) DIZAYN</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Figma, Auto-layout, komponentlar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Responsiv veb-sayt va mobil ilovalar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> UX audit, prototip va brending</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="UI/UX Dizayn">
            Kursga yozilish
          </button>
        </div>

        {/* 6. Grafik Dizayn */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="design">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">6 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">GRAFIK DIZAYN</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Adobe Photoshop — 3 oy fotomanipulyatsiya</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Adobe Illustrator — 3 oy vektor grafika</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> SMM postlar, logotip va bannerlar</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Grafik Dizayn">
            Kursga yozilish
          </button>
        </div>

        {/* 7. Vibe Coding */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="coding">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">2 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">VIBE CODING (AI + DEV)</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Zamonaviy front-end va AI yordamchilari</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Tezkor interfeyslar va prototiplar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Haqiqiy mijoz loyihalari bilan ishlash</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Vibe Coding">
            Kursga yozilish
          </button>
        </div>

        {/* 8. Startup Inkubator */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="startup">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">5 oy</span>
              <span className="text-xs text-slate-400">Grant asosida</span>
            </div>
            <h4 className="text-lg font-bold text-white">STARTUP INKUBATOR</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> G‘oya va MVP mahsulot yaratish</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> API + AI integratsiya, Auth, Dashboard</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> $20 000 gacha investitsiya jalb qilish</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Startup Inkubator">
            Kursga yozilish
          </button>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 5: STARTUP $20,000 INKUBATSIYA */}
  <section id="startup" className="py-20 relative overflow-hidden border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border-brand-neon/40 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="px-3 py-1 rounded-full bg-brand-neon/20 text-brand-light text-xs font-bold border border-brand-neon/40">
              UZCombinator Hamkorligida
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              STARTAPINGIZ UCHUN <br />
              <span className="text-brand-neon neon-text-glow">$20 000 INVESTITSIYA</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Startup — innovatsion g‘oya asosida yaratilgan loyiha bo‘lib, muammoni hal qilish va tez rivojlanishga qaratilgan. Robocode akademiyasida eng yaxshi bitiruvchilar o‘z startap loyihalari uchun moliyaviy va texnik ko‘mak oladilar.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-brand-dark/60 border border-brand-border">
                <div className="text-brand-neon font-bold text-lg flex items-center gap-2"><svg className="w-5 h-5 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.7)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg> Innovatsiya</div>
                <div className="text-xs text-slate-300 mt-1">Yangi yechimlar va texnologiyalar orqali muammolarni hal qilish</div>
              </div>
              <div className="p-4 rounded-xl bg-brand-dark/60 border border-brand-border">
                <div className="text-brand-neon font-bold text-lg flex items-center gap-2"><svg className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Tez Rivojlanish</div>
                <div className="text-xs text-slate-300 mt-1">Qisqa vaqt ichida katta miqyosda o‘sish va bozorga chiqish</div>
              </div>
            </div>
            <div className="pt-2">
              <a href="#ariza" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-neon shadow-lg shadow-brand-purple/30 transition-all">
                <span>Startap loyihani topshirish</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"  /></svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden glass-card p-3 border-brand-neon/30">
              <img src="/assets/landing/landing_img_3.jpg" alt="3D Startup Tech Illustration" className="w-full h-auto object-cover rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 6: ROBOCODE CRM BOSHQARUV TIZIMI */}
  <section id="crm-preview" className="py-20 relative bg-brand-surface/40 border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
          Avtomatlashtirilgan Ta’lim
        </span>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">ROBOCODE CRM — O‘QUV MARKAZ TIZIMI</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          O‘quvchilar, guruhlar jadvallari, o‘qituvchilar maoshi, to‘lovlar va davomat monitoringini yagona raqamli tizimda boshqaring.
        </p>
      </div>

      {/* CRM Mockup Showcase Card */}
      <div className="glass-card rounded-3xl p-4 sm:p-8 border-brand-neon/40 shadow-2xl overflow-hidden mb-12">
        <div className="relative group rounded-2xl overflow-hidden">
          <img src="/assets/landing/landing_img_4.jpg" alt="Robocode CRM Dashboard UI" className="w-full h-auto object-cover rounded-2xl" />
          <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
            <button id="view-interactive-crm" className="px-6 py-3 rounded-xl bg-brand-purple text-white font-bold text-sm shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"  /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"  /></svg>
              Interaktiv CRM Demoni Ochish
            </button>
          </div>
        </div>
      </div>

      {/* CRM Key Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-brand-purple/50 flex items-center justify-center text-brand-neon"><svg className="w-6 h-6 text-brand-neon drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></div>
          <h4 className="font-bold text-white text-base">To‘liq hisobot va tahlillar</h4>
          <p className="text-xs text-slate-300">O‘quvchilar soni, daromadlar o‘sishi va guruhlar yuklamasining real vaqt statistikasi.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-900/40 border border-cyan-500/50 flex items-center justify-center text-cyan-400"><svg className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <h4 className="font-bold text-white text-base">Avtomatik davomat</h4>
          <p className="text-xs text-slate-300">Har bir dars bo‘yicha QR-kod yoki planshet orqali tezkor davomat yuritish.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pink-900/40 border border-pink-500/50 flex items-center justify-center text-pink-400"><svg className="w-6 h-6 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
          <h4 className="font-bold text-white text-base">To‘lovlar nazorati</h4>
          <p className="text-xs text-slate-300">Payme, Click va naqd to‘lovlar integratsiyasi, qarzdorlik haqida avtomatik SMS eslatmalar.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-500/50 flex items-center justify-center text-rose-400"><svg className="w-6 h-6 text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
          <h4 className="font-bold text-white text-base">Lidlar va arizalar</h4>
          <p className="text-xs text-slate-300">Sayt va ijtimoiy tarmoqlardan tushgan barcha yangi arizalarni avtomatik saralash.</p>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 7: ANDIJONDAGI AMALIY O'QUV MUHITI & JAMOA */}
  <section id="team" className="py-20 relative border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xs font-bold tracking-widest text-brand-neon uppercase mb-2">Muhit va Mentorlar</h2>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">ANDIJONDAGI O‘QUV MUHITI VA TAJRIBALI JAMOA</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Akademiyamizda har bir o‘quvchi zamonaviy texnologik laboratoriyada tajribali ustozlar ko‘magida bilim oladi.
        </p>
      </div>

      {/* Real Classroom Experience Photo */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 mb-16 border-brand-neon/30 overflow-hidden shadow-2xl">
        <div className="relative rounded-2xl overflow-hidden group">
          <img src="/assets/landing/landing_img_5.jpg" alt="Robocode Classroom Environment" className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-500" />
          <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-white">
            <svg className="w-3.5 h-3.5 text-rose-400 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Andijon shahri, P8WW+P7G, Ulitsa Lermontova, Robocode IT markazi laboratoriyasi
          </div>
        </div>
      </div>

      {/* Mentors Swiper Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-brand-neon uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Amaliyotchi Ustozlar Jamoasi
          </span>
          <h4 className="text-xl sm:text-3xl font-extrabold text-white mt-1">Xalqaro tajribaga ega professional mentorlar</h4>
        </div>
        <div className="flex items-center gap-3">
          <button id="mentor-swipe-prev" aria-label="Oldingi ustoz" className="w-11 h-11 rounded-2xl bg-brand-card hover:bg-brand-purple border border-brand-border hover:border-brand-neon text-white flex items-center justify-center transition-all shadow-lg active:scale-90 group cursor-pointer">
            <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button id="mentor-swipe-next" aria-label="Keyingi ustoz" className="w-11 h-11 rounded-2xl bg-brand-card hover:bg-brand-purple border border-brand-border hover:border-brand-neon text-white flex items-center justify-center transition-all shadow-lg active:scale-90 group cursor-pointer">
            <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Swipeable & Auto-swiping Mentors Carousel */}
      <div id="mentor-carousel-track" className="flex gap-5 overflow-x-auto pb-6 pt-2 no-scrollbar cursor-grab active:cursor-grabbing select-none mb-6 relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Mentor 1: Abdulaziz Yakubov */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80" alt="Abdulaziz Yakubov" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-brand-neon/60 text-[10px] font-bold text-brand-neon shadow-lg">
                10+ yil IT tajriba
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Abdulaziz Yakubov</h4>
                <p className="text-xs font-semibold text-brand-light">Founder & Serial Startapper</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>Yoshlar Ventures direktori, 10+ yillik IT va venture kapital tajribasi. 30 dan ortiq yirik IT va ta’lim platformalari muallifi.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Asoschi
            </span>
            <span className="text-brand-light/80 font-semibold">Startup & Boshqaruv</span>
          </div>
        </div>

        {/* Mentor 2: Akhmadullo Nurmakhamatov */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=600&q=80" alt="Akhmadullo Nurmakhamatov" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-cyan-400/60 text-[10px] font-bold text-cyan-300 shadow-lg">
                Torino (Italiya)
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Akhmadullo Nurmakhamatov</h4>
                <p className="text-xs font-semibold text-cyan-400">Team Lead & Senior Full-Stack</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>Politecnico di Torino (Italiya) bitiruvchisi, 6+ yil xalqaro dasturlash tajribasi. React, TypeScript, Node.js va Enterprise tizimlar me’mori.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Senior Dev
            </span>
            <span className="text-cyan-400 font-semibold">Front-End & React</span>
          </div>
        </div>

        {/* Mentor 3: Shuxratbek Aliyev */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=600&q=80" alt="Shuxratbek Aliyev" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-pink-400/60 text-[10px] font-bold text-pink-300 shadow-lg">
                150+ shogird
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Shuxratbek Aliyev</h4>
                <p className="text-xs font-semibold text-pink-400">UI/UX & Art Director</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>Vodiy Brend agentligi asoschisi, 5+ yil amaliy dizayn tajribasi. 30+ brendlar uchun korporativ UI/UX va mobil ilovalar loyihalagan.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Art Lead
            </span>
            <span className="text-pink-400 font-semibold">UI/UX & Figma</span>
          </div>
        </div>

        {/* Mentor 4: Ziyodullo Shuxratbekov */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&h=600&q=80" alt="Ziyodullo Shuxratbekov" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-amber-400/60 text-[10px] font-bold text-amber-300 shadow-lg">
                $700k+ investitsiya
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Ziyodullo Shuxratbekov</h4>
                <p className="text-xs font-semibold text-amber-400">Startup Mentor & Biznes</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>EduCompass platformasi asoschisi, $250 000 loyiha muallifi, xalqaro venchur fondlardan $700 000+ investitsiya jalb qilgan tajribali mentor.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Mentor
            </span>
            <span className="text-amber-400 font-semibold">Startup $20k</span>
          </div>
        </div>

        {/* Mentor 5: Saidislom To'lqinov */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&h=600&q=80" alt="Saidislom To‘lqinov" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-brand-neon/60 text-[10px] font-bold text-brand-neon shadow-lg">
                NFINITE (Fransiya)
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Saidislom To‘lqinov</h4>
                <p className="text-xs font-semibold text-brand-neon">Front-End & 3D Web Muhandisi</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>Fransiyaning NFINITE kompaniyasi muhandisi, 5 yil xalqaro staj. Walmart, Castorama loyihalari, WebGL, Three.js va yuqori darajadagi SPA.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Xalqaro Dev
            </span>
            <span className="text-brand-neon font-semibold">3D Web & Three.js</span>
          </div>
        </div>

        {/* Mentor 6: Abduvahob Qahhorov */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&h=600&q=80" alt="Abduvahob Qahhorov" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-indigo-400/60 text-[10px] font-bold text-indigo-300 shadow-lg">
                UIC Group & Prolab
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Abduvahob Qahhorov</h4>
                <p className="text-xs font-semibold text-indigo-400">Back-End / System Architect</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>UIC Group va Prolab tajribasi, 5+ yil staj. Yuqori yuklamali server arxitekturasi, PostgreSQL, Docker, Microservices mutaxassisi.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Architect
            </span>
            <span className="text-indigo-400 font-semibold">Back-End & Microservices</span>
          </div>
        </div>

        {/* Mentor 7: Nazrullo Raxmatov */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&h=600&q=80" alt="Nazrullo Raxmatov" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-emerald-400/60 text-[10px] font-bold text-emerald-300 shadow-lg">
                20+ API tizimlar
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Nazrullo Raxmatov</h4>
                <p className="text-xs font-semibold text-emerald-400">Back-End & Database Lead</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>EduCompass bosh dasturchisi, 3+ yil tajriba. 20 dan ortiq yirik backend loyihalar, xavfsiz REST API va murakkab SQL arxitektori.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Lead Dev
            </span>
            <span className="text-emerald-400 font-semibold">Python & PostgreSQL</span>
          </div>
        </div>

        {/* Mentor 8: Husanboy Zafarov */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&h=600&q=80" alt="Husanboy Zafarov" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-violet-400/60 text-[10px] font-bold text-violet-300 shadow-lg">
                React & Next.js
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Husanboy Zafarov</h4>
                <p className="text-xs font-semibold text-violet-400">Front-End React Mentor</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>Bozorly va EduCompass dasturchisi, 3+ yil amaliy tajriba. Next.js, Redux, murakkab veb-interfeyslar va amaliy kod yozish yetakchisi.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Mentor
            </span>
            <span className="text-violet-400 font-semibold">Front-End & SPA</span>
          </div>
        </div>

        {/* Mentor 9: Hasanboy Zafarov */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&h=600&q=80" alt="Hasanboy Zafarov" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-fuchsia-400/60 text-[10px] font-bold text-fuchsia-300 shadow-lg">
                Vibe Coding & AI
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Hasanboy Zafarov</h4>
                <p className="text-xs font-semibold text-fuchsia-400">Vibe Coding & AI Mentor</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>Robocode tezkor AI-dasturlash murabbiyi, Prompt Engineering, zamonaviy AI agentlar va responsiv veb-mahsulotlar ishlab chiqish ustasi.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              AI Murabbiy
            </span>
            <span className="text-fuchsia-400 font-semibold">AI & Vibe Coding</span>
          </div>
        </div>

        {/* Mentor 10: Alimjanov Saidmurod */}
        <div className="mentor-card-item w-[280px] sm:w-[320px] shrink-0 glass-card rounded-3xl p-5 border border-brand-border/70 hover:border-brand-neon transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/70 flex flex-col justify-between group">
          <div>
            <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-4 border border-brand-purple/40 group-hover:border-brand-neon transition-colors">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80" alt="Alimjanov Saidmurod" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/20 to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-rose-400/60 text-[10px] font-bold text-rose-300 shadow-lg">
                Robototexnika & IT
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="font-bold text-white text-base leading-snug drop-shadow-md">Alimjanov Saidmurod</h4>
                <p className="text-xs font-semibold text-rose-400">Foundation & Robototexnika</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>Bozorly loyihasi muhandisi, 2+ yil staj. O‘zbek va rus tillarida IT asoslari, Arduino, Scratch, datchiklar va robototexnika laboratoriyasi yetakchisi.</p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Mentor
            </span>
            <span className="text-rose-400 font-semibold">Robototexnika</span>
          </div>
        </div>

      </div>

      {/* Interactive Mentor Swiper Pagination Dots */}
      <div id="mentor-dots-container" className="flex items-center justify-center gap-2 mb-16">
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            data-mentor-index={i}
            aria-label={`Ustoz ${i + 1}`}
            className={`mentor-dot h-2 rounded-full transition-all duration-300 cursor-pointer ${i === 0 ? 'w-8 bg-brand-neon shadow-md shadow-purple-500/50' : 'w-2 bg-brand-border hover:bg-slate-500'}`}
          />
        ))}
      </div>

      {/* Testimonials / Bitiruvchilar Fikrlari (from CRM) */}
      <div className="mt-14">
        <div className="text-center mb-8">
          <h3 className="text-xs font-bold tracking-widest text-brand-neon uppercase">Muvaffaqiyat Tarixlari</h3>
          <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">BITIRUVCHILARIMIZ NATIJALARI VA FIKRLARI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="glass-card p-6 rounded-2xl border border-brand-border/60 space-y-4 hover:border-brand-neon transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-900/50 border border-brand-purple/60 flex items-center justify-center font-bold text-white text-sm">
                BT
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Bekzod Toshpulatov</h5>
                <p className="text-[11px] text-brand-neon font-medium">STEM markazi instruktori</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Robototexnika kursi menga nafaqat texnik bilim, balki o‘quvchilarga ta’lim berish tajribasini ham berdi. Hozir o‘zim STEM markazida dars beraman."
            </p>
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-brand-border/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Robototexnika kursi bitiruvchisi
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="glass-card p-6 rounded-2xl border border-brand-border/60 space-y-4 hover:border-brand-neon transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pink-900/50 border border-pink-500/60 flex items-center justify-center font-bold text-white text-sm">
                MY
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Madina Yusupova</h5>
                <p className="text-[11px] text-pink-400 font-medium">Frilanser UI/UX dizayner</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Figma va UI/UX asoslarini Robocode‘da o‘rgandim. Kursdan keyin darhol frilans loyihalar bilan ishlay boshladim va o‘z mijozlar bazamni shakllantirdim."
            </p>
            <div className="text-[11px] font-semibold text-pink-400 flex items-center gap-1.5 pt-2 border-t border-brand-border/40">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span> Grafik & Web Dizayn bitiruvchisi
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="glass-card p-6 rounded-2xl border border-brand-border/60 space-y-4 hover:border-brand-neon transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-900/50 border border-blue-500/60 flex items-center justify-center font-bold text-white text-sm">
                AK
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Aziza Karimova</h5>
                <p className="text-[11px] text-blue-400 font-medium">Frontend Developer</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Robocode‘dagi 6 oy davomida noldan React‘da real loyihalar qura oladigan darajaga yetdim. Mentorlar har doim kod tahlilida yordamga tayyor edi."
            </p>
            <div className="text-[11px] font-semibold text-blue-400 flex items-center gap-1.5 pt-2 border-t border-brand-border/40">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Front-End kursi bitiruvchisi
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 8: BIZ BILAN HAMKORLAR (Partners Showcase with Official Logos) */}
  <section className="py-20 relative bg-brand-surface/50 border-t border-brand-border/60">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-neon/40 text-brand-neon text-xs font-bold uppercase tracking-wider mb-3">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a2 2 0 0 0 0-2.8l-4.2-4.2a2 2 0 0 0-2.8 0L7 12"/><path d="m18 10 1.4-1.4a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L14 6"/><path d="M10 14 7 17a2 2 0 0 1-2.8 0l-1.4-1.4a2 2 0 0 1 0-2.8L6 10"/><path d="m2 17 4 4"/></svg>
          Ishonchli Hamkorlarimiz
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">BIZ BILAN HAMKOR TASHKILOTLAR</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
          O‘quvchilarimiz va bitiruvchilarimizga xalqaro standartdagi ta’lim, stajirovka hamda $20 000 gacha startap investitsiyalari taqdim etuvchi nufuzli ekotizim hamkorlari.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {/* 1. IT Park Uzbekistan */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-emerald-400/80 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* IT Park Hexagonal Cube SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" stroke="#00D285" strokeWidth="2.5" fill="rgba(0,210,133,0.15)"/>
              <line x1="24" y1="4" x2="24" y2="44" stroke="#00D285" strokeWidth="2"/>
              <line x1="24" y1="24" x2="42" y2="14" stroke="#00D285" strokeWidth="2"/>
              <line x1="24" y1="24" x2="6" y2="14" stroke="#00D285" strokeWidth="2"/>
              <circle cx="24" cy="24" r="3" fill="#00D285"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">IT PARK UZBEKISTAN</h4>
          <span className="mt-1 text-[11px] font-medium text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Rasmiy Rezidentlik & Sertifikat</span>
          <p className="mt-2 text-[11px] text-slate-400">Raqamli texnologiyalar vazirligi qoshidagi IT ekotizim</p>
        </div>

        {/* 2. Yoshlar Texnoparki */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-cyan-400/80 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* Yoshlar Texnoparki Emblem SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 2" fill="rgba(6,182,212,0.12)"/>
              <path d="M16 16 L24 28 L32 16" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="24" y1="28" x2="24" y2="36" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="24" cy="14" r="2.5" fill="#38BDF8"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">YOSHLAR TEXNOPARKI</h4>
          <span className="mt-1 text-[11px] font-medium text-cyan-400/90 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Innovatsion Laboratoriya</span>
          <p className="mt-2 text-[11px] text-slate-400">Robototexnika va ixtirochilik bo‘yicha texnopark</p>
        </div>

        {/* 3. Turin Polytechnic University */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-blue-400/80 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* Academic Gear & Pillar SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <path d="M24 6 L38 14 L38 34 L24 42 L10 34 L10 14 Z" stroke="#3B82F6" strokeWidth="2" fill="rgba(59,130,246,0.15)"/>
              <circle cx="24" cy="24" r="8" stroke="#60A5FA" strokeWidth="2"/>
              <path d="M24 18 V30 M18 24 H30" stroke="#93C5FD" strokeWidth="1.8"/>
              <polygon points="24,10 27,15 21,15" fill="#F59E0B"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">TURIN POLYTECHNIC</h4>
          <span className="mt-1 text-[11px] font-medium text-blue-400/90 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Xalqaro Ta’lim Hamkori</span>
          <p className="mt-2 text-[11px] text-slate-400">Toshkentdagi Turin Politexnika Universiteti (TTPU)</p>
        </div>

        {/* 4. UZCombinator */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-amber-400/80 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* UZCombinator Startup Rocket Emblem SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="8" width="32" height="32" rx="10" stroke="#F59E0B" strokeWidth="2" fill="rgba(245,158,11,0.15)"/>
              <path d="M16 16 L24 32 L32 16" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 24 L24 36" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="24" cy="16" r="3" fill="#F59E0B"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">UZCOMBINATOR</h4>
          <span className="mt-1 text-[11px] font-medium text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">$20 000 Startup Track</span>
          <p className="mt-2 text-[11px] text-slate-400">Xalqaro venchur va startap akselerator jamg‘armasi</p>
        </div>

        {/* 5. MECON */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-purple-400/80 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* MECON Engineering Hexagon SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <polygon points="24,6 40,15 40,33 24,42 8,33 8,15" stroke="#A855F7" strokeWidth="2" fill="rgba(168,85,247,0.15)"/>
              <path d="M14 30 V18 L24 25 L34 18 V30" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">MECON ENGINEERING</h4>
          <span className="mt-1 text-[11px] font-medium text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Sanoat & Robototexnika</span>
          <p className="mt-2 text-[11px] text-slate-400">Muhandislik va texnik loyihalar konsaltingi</p>
        </div>

        {/* 6. Yandex Ecosystem */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-rose-400/80 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* Yandex Circle Badge SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" fill="#E11D48"/>
              <circle cx="24" cy="24" r="16" fill="#180B2B"/>
              <path d="M28 14 H24 C20 14 17 17 17 21 C17 24 19 26 21 28 L16 34 H20 L25 28 H26 V34 H29 V14 Z M26 25 H24 C22 25 20 23.5 20 21 C20 18.5 22 17 24 17 H26 V25 Z" fill="#FFFFFF"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-rose-400 transition-colors">YANDEX ECOSYSTEM</h4>
          <span className="mt-1 text-[11px] font-medium text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">AI & Cloud Amaliyot</span>
          <p className="mt-2 text-[11px] text-slate-400">Yandex bulut va xaritalar texnologiyalari integratsiyasi</p>
        </div>

        {/* 7. Yoshlar Agentligi */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-indigo-400/80 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* Yoshlar Agentligi Wings Emblem SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <path d="M24 8 C14 18 10 26 12 36 C18 38 24 34 24 34 C24 34 30 38 36 36 C38 26 34 18 24 8 Z" stroke="#6366F1" strokeWidth="2" fill="rgba(99,102,241,0.15)"/>
              <circle cx="24" cy="22" r="4" fill="#818CF8"/>
              <path d="M16 26 C20 30 28 30 32 26" stroke="#A5B4FC" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">YOSHLAR ISHLARI AGENTLIGI</h4>
          <span className="mt-1 text-[11px] font-medium text-indigo-400/90 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Ijtimoiy & Ta’lim Grantlari</span>
          <p className="mt-2 text-[11px] text-slate-400">Andijon yoshlarining IT sohasidagi faol tashabbuslari</p>
        </div>

        {/* 8. EPAM Systems */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-teal-400/80 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* EPAM Tag Brackets SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="10" width="36" height="28" rx="8" stroke="#14B8A6" strokeWidth="2" fill="rgba(20,184,166,0.15)"/>
              <path d="M16 20 L12 24 L16 28" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 20 L36 24 L32 28" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="26" y1="18" x2="22" y2="30" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">EPAM SYSTEMS</h4>
          <span className="mt-1 text-[11px] font-medium text-teal-400/90 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">Global Dasturiy Tajriba</span>
          <p className="mt-2 text-[11px] text-slate-400">Xalqaro dasturlash metodologiyasi va Code Review</p>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 9: KO'P BERILADIGAN SAVOLLAR (FAQ) */}
  <section id="faq" className="py-20 relative border-t border-brand-border/40">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h3 className="text-xs font-bold tracking-widest text-brand-neon uppercase">Yordam & Javoblar</h3>
        <p className="text-2xl sm:text-4xl font-extrabold text-white mt-1">KO‘P BERILADIGAN SAVOLLAR</p>
      </div>

      <div className="space-y-4">
        {/* FAQ Item 1 */}
        <div className="faq-item glass-card rounded-2xl overflow-hidden border-brand-border">
          <button className="faq-btn w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-brand-light transition-colors">
            <span>Dasturlash yoki robototexnikani o‘rganish uchun yosh chegarasi bormi?</span>
            <span className="faq-icon text-brand-neon text-xl font-bold transition-transform">+</span>
          </button>
          <div className="faq-content hidden px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-brand-border/40 pt-3">
            Yo‘q, kurslarimiz 7 yoshdan boshlab (Robototexnika va Scratch) to talabalar va kattalargacha (Full-Stack, UI/UX, Startup) mo‘ljallangan guruhlarga ajratilgan.
          </div>
        </div>

        {/* FAQ Item 2 */}
        <div className="faq-item glass-card rounded-2xl overflow-hidden border-brand-border">
          <button className="faq-btn w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-brand-light transition-colors">
            <span>Avvaldan hech qanday bilim bo‘lmasa ham o‘qisa bo‘ladimi?</span>
            <span className="faq-icon text-brand-neon text-xl font-bold transition-transform">+</span>
          </button>
          <div className="faq-content hidden px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-brand-border/40 pt-3">
            Albatta! Barcha kurslarimiz noldan boshlab bosqichma-bosqich o‘rgatiladi. Dastlabki 2 haftada tayyorgarlik va asosiy tushunchalar mustahkamlanadi.
          </div>
        </div>

        {/* FAQ Item 3 */}
        <div className="faq-item glass-card rounded-2xl overflow-hidden border-brand-border">
          <button className="faq-btn w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-brand-light transition-colors">
            <span>Darslar qachon va qaysi vaqtlarda o‘tiladi?</span>
            <span className="faq-icon text-brand-neon text-xl font-bold transition-transform">+</span>
          </button>
          <div className="faq-content hidden px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-brand-border/40 pt-3">
            Darslar haftada 3 kun, 2 soatdan o‘tiladi. Ertalabki, tushki va kechki qulay vaqt oraliqlaridan birini tanlashingiz mumkin.
          </div>
        </div>

        {/* FAQ Item 4 */}
        <div className="faq-item glass-card rounded-2xl overflow-hidden border-brand-border">
          <button className="faq-btn w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-brand-light transition-colors">
            <span>Kurs yakunida sertifikat beriladimi va ish topishda yordam berasizmi?</span>
            <span className="faq-icon text-brand-neon text-xl font-bold transition-transform">+</span>
          </button>
          <div className="faq-content hidden px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-brand-border/40 pt-3">
            Ha, barcha bitiruvchilarga rasmiy sertifikat taqdim etiladi. Eng a’lochi talabalar esa akademiyamizning ichki loyihalariga yoki hamkor IT kompaniyalarga ishga tavsiya etiladi.
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 10: ARIZA TOPSHIRISH / KURSGA YOZILISH */}
  <section id="ariza" className="py-20 relative bg-brand-surface/60 border-t border-brand-border/60">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border-brand-neon/40 shadow-2xl relative">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="px-3 py-1 rounded-full bg-brand-purple/40 text-brand-light text-xs font-bold border border-brand-purple">
            Birinchi dars — Bepul sinov darsi!
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">KURSGA YOZILISH VA KONSULTATSIYA</h3>
          <p className="mt-2 text-sm text-slate-300">
            Ma’lumotlaringizni qoldiring, administratorlarimiz 15 daqiqa ichida siz bilan bog‘lanib, bepul sinov darsiga yozib qo‘yadilar.
          </p>
        </div>

        <form id="lead-form" className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Ism va familiyangiz *</label>
              <input type="text" id="lead-name" required placeholder="Masalan: Sardor Aliyev" className="w-full px-4 py-3 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-neon transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Telefon raqamingiz *</label>
              <input type="tel" id="lead-phone" required placeholder="+998 90 123 45 67" defaultValue="+998 " className="w-full px-4 py-3 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-neon transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Qiziqqan yo‘nalishingiz *</label>
            <select id="lead-course" className="w-full px-4 py-3 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-neon transition-colors">
              <option value="Robototexnika">Robototexnika (10 oy)</option>
              <option value="Front-End">Front-End Dasturlash (6 oy)</option>
              <option value="Back-End">Back-End Dasturlash (6 oy)</option>
              <option value="UI/UX Dizayn">Web & UI/UX Dizayn (6 oy)</option>
              <option value="Foundation">Foundation — IT Asoslari (2 oy)</option>
              <option value="Grafik Dizayn">Grafik Dizayn (6 oy)</option>
              <option value="Vibe Coding">Vibe Coding & AI (2 oy)</option>
              <option value="Startup Inkubator">Startup Inkubator ($20 000)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Qo‘shimcha izoh yoki savollaringiz</label>
            <textarea id="lead-note" rows="3" placeholder="Qo‘shimcha savolingiz bo‘lsa yozing..." className="w-full px-4 py-3 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-neon transition-colors"></textarea>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-purple via-brand-neon to-indigo-600 hover:opacity-95 shadow-xl shadow-brand-purple/40 transition-all flex items-center justify-center gap-2">
              <span>Arizani yuborish</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"  /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>

  {/* FOOTER */}
  <footer className="bg-brand-dark border-t border-brand-border py-12 text-slate-400 text-xs">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span>Robocode IT Academy</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Andijondagi birinchi va yetakchi IT akademiyasi. Bolalar va yoshlarni kelajak kasblariga tayyorlaymiz.
          </p>
          <p className="text-slate-500 text-[11px]">© 2018–2026 Robocode IT Academy. Barcha huquqlar himoyalangan.</p>
        </div>

        {/* Col 2 */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-sm">Yo‘nalishlar</h4>
          <ul className="space-y-1.5">
            <li><a href="#courses" className="hover:text-brand-light">Robototexnika</a></li>
            <li><a href="#courses" className="hover:text-brand-light">Front-End & Back-End</a></li>
            <li><a href="#courses" className="hover:text-brand-light">Web & UI/UX Dizayn</a></li>
            <li><a href="#courses" className="hover:text-brand-light">Startup Inkubator</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-sm">Aloqa</h4>
          <p className="flex items-center gap-1.5"><svg className="w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Manzil: Andijon shahri, P8WW+P7G, Ulitsa Lermontova (Robocode IT Markazi)</p>
          <p className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Tel: +998 99 899 9005 / +998 93 075 9005</p>
          <p>✉️ Email: info@robocode.uz</p>
        </div>

        {/* Col 4 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm">CRM Tizimi</h4>
          <p className="text-slate-400">O‘quv markaz xodimlari va administratorlar uchun boshqaruv portali.</p>
          <button id="footer-crm-btn" className="px-4 py-2 rounded-lg bg-brand-card hover:bg-brand-surface border border-brand-border text-brand-light font-semibold text-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-brand-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"  /></svg>
            <span>Tizimga kirish (/login)</span>
          </button>
        </div>
      </div>
    </div>
  </footer>

  {/* MODAL: INTERACTIVE CRM DASHBOARD DEMO */}
  <div id="crm-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div className="bg-brand-surface border border-brand-neon/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-brand-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold">R</div>
          <div>
            <h3 className="font-bold text-white text-base">Robocode CRM — Markaz Boshqaruv Tizimi</h3>
            <p className="text-xs text-brand-light">Administrator Demo Paneli (Jonli rejim)</p>
          </div>
        </div>
        <button id="close-crm-modal" className="p-2 rounded-lg bg-brand-card text-slate-400 hover:text-white">✕</button>
      </div>

      {/* CRM Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-xs text-slate-400">Jami O‘quvchilar</span>
          <div className="text-2xl font-bold text-white mt-1">3,520</div>
          <span className="text-[10px] text-emerald-400">+12% o‘sish</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-xs text-slate-400">O‘rtacha Davomat</span>
          <div className="text-2xl font-bold text-white mt-1">94.2%</div>
          <span className="text-[10px] text-emerald-400">Yuqori faollik</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-xs text-slate-400">Faol Guruhlar</span>
          <div className="text-2xl font-bold text-white mt-1">128 ta</div>
          <span className="text-[10px] text-brand-neon">Dasturlash & Robototexnika</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-xs text-slate-400">Yangi Lidlar (Haftalik)</span>
          <div className="text-2xl font-bold text-white mt-1">214 ta</div>
          <span className="text-[10px] text-emerald-400">Qabul davom etmoqda</span>
        </div>
      </div>

      {/* CRM Table */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3">So‘nggi qabul qilingan o‘quvchilar ro‘yxati</h4>
        <div className="overflow-x-auto rounded-xl border border-brand-border">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-card text-slate-400 border-b border-brand-border">
              <tr>
                <th className="p-3">O‘quvchi</th>
                <th className="p-3">Yo‘nalish</th>
                <th className="p-3">Guruh</th>
                <th className="p-3">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              <tr className="hover:bg-brand-card/40">
                <td className="p-3 font-semibold text-white">Davronbek Ismoilov</td>
                <td className="p-3">Front-End React</td>
                <td className="p-3">FE-104</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">To‘langan</span></td>
              </tr>
              <tr className="hover:bg-brand-card/40">
                <td className="p-3 font-semibold text-white">Madinabonu Rahimova</td>
                <td className="p-3">Robototexnika</td>
                <td className="p-3">ROBO-22</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">To‘langan</span></td>
              </tr>
              <tr className="hover:bg-brand-card/40">
                <td className="p-3 font-semibold text-white">Jasurbek Qodirov</td>
                <td className="p-3">UI/UX Dizayn</td>
                <td className="p-3">UX-12</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Kutilmoqda</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button id="close-crm-modal-btn" className="px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-neon transition-colors">
          Yopish
        </button>
      </div>
    </div>
  </div>

  {/* TOAST NOTIFICATION */}
  <div id="toast" className="fixed bottom-6 right-6 z-50 glass-card border border-emerald-500/50 text-white px-5 py-4 rounded-xl shadow-2xl hidden flex items-center gap-3">
    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
    <span id="toast-message" className="text-xs font-semibold">Arizangiz muvaffaqiyatli qabul qilindi! Tez orada bog‘lanamiz.</span>
  </div>

  {/* FLOATING ROBOT WIDGET (Always visible in bottom-right corner) */}
  <div id="floating-robot-widget" className="fixed bottom-6 right-6 z-50 transition-all duration-300 flex flex-col items-end">
    {/* Mini tooltip badge */}
    <div id="floating-robot-tooltip" className="mb-2 px-3 py-1.5 rounded-full glass-card border border-brand-neon/60 text-[11px] font-medium text-white shadow-xl flex items-center gap-1.5 animate-bounce">
      <span>Savolingiz bormi?</span>
      <span className="text-brand-neon">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </span>
    </div>

    {/* Glowing 3D Robot Mascot Icon Box */}
    <button id="floating-robot-btn" aria-label="Robot yordamchi bilan suhbatlashish" className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-brand-surface/90 border-2 border-brand-neon/80 shadow-2xl shadow-purple-950/80 p-1 flex items-center justify-center relative group focus:outline-none focus:ring-2 focus:ring-brand-neon transition-transform hover:scale-105 active:scale-95 neon-border-glow cursor-pointer">
      <img src="/assets/landing/landing_img_8.jpg" alt="Robocode AI Robot" className="w-full h-full object-cover rounded-xl pointer-events-none select-none" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-brand-dark animate-ping"></span>
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-brand-dark"></span>
    </button>
  </div>

  {/* INTERACTIVE ROBOT AI CHAT WINDOW (Opens on the right side) */}
  <div id="robot-chat-window" className="fixed bottom-24 right-4 sm:right-6 z-50 w-[360px] sm:w-[390px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[82vh] glass-card rounded-3xl border border-brand-neon/60 shadow-2xl flex flex-col overflow-hidden hidden transition-all duration-300">
    {/* Chat Header */}
    <div className="px-5 py-4 bg-brand-card/90 border-b border-brand-border flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl border border-brand-neon/60 overflow-hidden shrink-0 shadow-md">
          <img src="/assets/landing/landing_img_8.jpg" alt="Robot Avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Robocode AI Yordamchi</h3>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Onlayn • Andijon IT Akademiyasi
          </p>
        </div>
      </div>
      <button id="close-chat-btn" aria-label="Chatni yopish" className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-brand-surface transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Messages Container */}
    <div id="chat-messages-container" className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
      {/* Bot Intro Message */}
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-brand-neon/40">
          <img src="/assets/landing/landing_img_8.jpg" alt="Bot" className="w-full h-full object-cover" />
        </div>
        <div className="p-3.5 rounded-2xl rounded-tl-sm bg-brand-card border border-brand-border text-slate-200 leading-relaxed max-w-[85%] space-y-2">
          <p className="flex items-center gap-2">
            <span>Assalomu alaykum!</span>
            <svg className="w-4 h-4 text-pink-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
            <span>Men Robocode IT akademiyasining 3D AI robot yordamchisiman.</span>
          </p>
          <p>Sizga kurslarimiz, narxlar, dars vaqtlari yoki qabul bo‘yicha qanday ma’lumot kerak? Quyidagi tayyor savollardan birini tanlashingiz yoki o‘z savolingizni yozishingiz mumkin:</p>
        </div>
      </div>

      {/* Quick Question Suggestion Chips */}
      <div id="quick-questions" className="flex flex-wrap gap-1.5 pt-1">
        <button className="quick-chip px-3 py-1.5 rounded-xl bg-brand-purple/50 hover:bg-brand-purple border border-brand-neon text-[11px] text-white font-medium transition-all text-left shadow-sm">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-brand-neon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Barcha kurslar haqida to‘liq ma’lumot
          </span>
        </button>
        <button className="quick-chip px-3 py-1.5 rounded-xl bg-brand-surface/80 hover:bg-brand-purple/40 border border-brand-border hover:border-brand-neon text-[11px] text-slate-300 hover:text-white transition-all text-left">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <line x1="12" y1="6" x2="12" y2="8" />
              <line x1="12" y1="16" x2="12" y2="18" />
            </svg>
            Kurslar narxi qancha?
          </span>
        </button>
        <button className="quick-chip px-3 py-1.5 rounded-xl bg-brand-surface/80 hover:bg-brand-purple/40 border border-brand-border hover:border-brand-neon text-[11px] text-slate-300 hover:text-white transition-all text-left">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-brand-neon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8.01" y2="16" />
              <line x1="16" y1="16" x2="16.01" y2="16" />
            </svg>
            Robototexnika kursi haqida
          </span>
        </button>
        <button className="quick-chip px-3 py-1.5 rounded-xl bg-brand-surface/80 hover:bg-brand-purple/40 border border-brand-border hover:border-brand-neon text-[11px] text-slate-300 hover:text-white transition-all text-left">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Front-End nimalarni o‘rgatadi?
          </span>
        </button>
        <button className="quick-chip px-3 py-1.5 rounded-xl bg-brand-surface/80 hover:bg-brand-purple/40 border border-brand-border hover:border-brand-neon text-[11px] text-slate-300 hover:text-white transition-all text-left">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Manzil va dars vaqtlari
          </span>
        </button>
        <button className="quick-chip px-3 py-1.5 rounded-xl bg-brand-surface/80 hover:bg-brand-purple/40 border border-brand-border hover:border-brand-neon text-[11px] text-slate-300 hover:text-white transition-all text-left">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-pink-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
            $20 000 lik Startup nima?
          </span>
        </button>
      </div>
    </div>

    {/* Input Bar */}
    <form id="chat-input-form" className="p-3 bg-brand-card/90 border-t border-brand-border flex items-center gap-2 shrink-0">
      <input type="text" id="chat-user-input" required placeholder="Savolingizni yozing..." className="flex-1 px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:outline-none focus:border-brand-neon transition-colors" />
      <button type="submit" aria-label="Yuborish" className="p-2.5 rounded-xl bg-brand-purple hover:bg-brand-neon text-white shadow-md transition-colors shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  </div>

  {/* JAVASCRIPT LOGIC */}
    </div>
  );
}
