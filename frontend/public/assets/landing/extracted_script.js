
    document.addEventListener('DOMContentLoaded', function() {
      // 1. Mobile Menu Toggle
      const mobileBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      const menuIcon = document.getElementById('menu-icon');
      const closeIcon = document.getElementById('close-icon');

      if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function() {
          const isHidden = mobileMenu.classList.contains('hidden');
          if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
          } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }
        });
      }

      // Close mobile menu on anchor click
      document.querySelectorAll('#mobile-menu a').forEach(function(link) {
        link.addEventListener('click', function() {
          if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }
        });
      });

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

      
      // 8. Sticky Header Scroll Effect (Full-width rounded-none at top, rounded-full floating pill on scroll)
      const navbarWrapper = document.getElementById('navbar-wrapper');
      const navbarPill = document.getElementById('navbar-pill');
      const mobileDrawer = document.getElementById('mobile-menu');

      function updateHeaderScroll() {
        if (!navbarWrapper || !navbarPill) return;
        if (window.scrollY > 25) {
          navbarWrapper.classList.remove('px-0', 'pt-0');
          navbarWrapper.classList.add('px-3', 'sm:px-6', 'pt-3', 'sm:pt-4', 'max-w-7xl', 'mx-auto');
          
          navbarPill.classList.remove('rounded-none', 'border-b', 'border-brand-border/60', 'shadow-none', 'py-4', 'sm:px-8');
          navbarPill.classList.add('rounded-full', 'border', 'border-brand-purple/50', 'bg-brand-surface/90', 'shadow-2xl', 'shadow-purple-950/60', 'py-2.5', 'sm:py-3', 'sm:px-7');
          
          if (mobileDrawer) {
            mobileDrawer.classList.add('rounded-3xl', 'mt-2', 'border', 'border-brand-border');
            mobileDrawer.classList.remove('border-b');
          }
        } else {
          navbarWrapper.classList.add('px-0', 'pt-0');
          navbarWrapper.classList.remove('px-3', 'sm:px-6', 'pt-3', 'sm:pt-4', 'max-w-7xl', 'mx-auto');
          
          navbarPill.classList.add('rounded-none', 'border-b', 'border-brand-border/60', 'shadow-none', 'py-4', 'sm:px-8');
          navbarPill.classList.remove('rounded-full', 'border', 'border-brand-purple/50', 'bg-brand-surface/90', 'shadow-2xl', 'shadow-purple-950/60', 'py-2.5', 'sm:py-3', 'sm:px-7');
          
          if (mobileDrawer) {
            mobileDrawer.classList.remove('rounded-3xl', 'mt-2', 'border');
            mobileDrawer.classList.add('border-b');
          }
        }
      }

      window.addEventListener('scroll', updateHeaderScroll);
      updateHeaderScroll();


      
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

        // Lights
        const ambientLight = new THREE.AmbientLight(0x7C3AED, 1.2);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.4);
        keyLight.position.set(4, 6, 5);
        scene.add(keyLight);

        const purpleRim = new THREE.PointLight(0x8B5CF6, 2.8, 12);
        purpleRim.position.set(-3, 2, 2);
        scene.add(purpleRim);

        const cyanAccent = new THREE.PointLight(0xA855F7, 2.0, 10);
        cyanAccent.position.set(3, -2, -2);
        scene.add(cyanAccent);

        // 3D Robot Head Group
        const robotGroup = new THREE.Group();
        scene.add(robotGroup);

        const headGroup = new THREE.Group();
        robotGroup.add(headGroup);

        // 1. Glossy White Helmet Body (Radius 1.68, scaled Z 0.92, outer front Z = 1.54)
        const helmetGeo = new THREE.SphereGeometry(1.68, 48, 48);
        helmetGeo.scale(1.06, 1.0, 0.92);
        const helmetMat = new THREE.MeshStandardMaterial({
          color: 0xF8FAFC,
          roughness: 0.12,
          metalness: 0.06
        });
        const helmet = new THREE.Mesh(helmetGeo, helmetMat);
        headGroup.add(helmet);

        // 2. Visor (Dark Purple Screen protruding proudly on the front, outer front Z = 1.69)
        const visorGeo = new THREE.SphereGeometry(1.3, 48, 48);
        visorGeo.scale(1.02, 0.88, 0.65);
        const visorMat = new THREE.MeshStandardMaterial({
          color: 0x1A083D,
          roughness: 0.15,
          metalness: 0.25,
          emissive: 0x180736
        });
        const visor = new THREE.Mesh(visorGeo, visorMat);
        visor.position.set(0, 0.08, 0.85);
        headGroup.add(visor);

        // 2b. Visor Neon Bezel Ring (glowing purple rim framing the face, as in image_6f4620.png)
        const bezelGeo = new THREE.TorusGeometry(1.24, 0.045, 16, 48);
        const bezelMat = new THREE.MeshStandardMaterial({
          color: 0xA855F7,
          emissive: 0x8B5CF6,
          emissiveIntensity: 2.2,
          roughness: 0.2,
          metalness: 0.3
        });
        const bezel = new THREE.Mesh(bezelGeo, bezelMat);
        bezel.position.set(0, 0.08, 1.48);
        bezel.scale.set(1.0, 0.86, 1.0);
        headGroup.add(bezel);

        // 3. Antennas (Stems + Glossy Spheres + Glowing Purple Tips)
        const stemGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.72, 16);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.2, metalness: 0.1 });
        const ballGeo = new THREE.SphereGeometry(0.2, 24, 24);
        const ballMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.1, metalness: 0.05 });
        const tipGeo = new THREE.SphereGeometry(0.09, 16, 16);
        const tipMat = new THREE.MeshStandardMaterial({ color: 0xC084FC, emissive: 0x8B5CF6, emissiveIntensity: 2.5 });

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

        const eyeGeo = new THREE.SphereGeometry(0.15, 24, 24);
        const eyeMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          emissive: 0xD8B4FE,
          emissiveIntensity: 3.5,
          roughness: 0.05
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
        const mouthGeo = new THREE.TorusGeometry(0.22, 0.038, 12, 32, Math.PI * 0.75);
        const mouthMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          emissive: 0xC084FC,
          emissiveIntensity: 2.8
        });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, -0.22, 1.70);
        mouth.rotation.z = Math.PI; // upside down creates friendly smile
        headGroup.add(mouth);

        // 6. Glowing Orbital Halo Ring
        const ringGeo = new THREE.TorusGeometry(2.35, 0.018, 12, 48);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0x8B5CF6,
          emissive: 0x8B5CF6,
          emissiveIntensity: 1.2,
          transparent: true,
          opacity: 0.4
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
        const clock = new THREE.Clock();
        function animate() {
          requestAnimationFrame(animate);
          const elapsed = clock.getElapsedTime();

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

      window.addEventListener('scroll', function() {
        if (!floatingWidget) return;
        if (window.scrollY > 400) {
          floatingWidget.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
          floatingWidget.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        } else {
          floatingWidget.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
          floatingWidget.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        }
      });

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

      if (floatingBtn) floatingBtn.addEventListener('click', toggleChatWindow);
      if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChatWindow);
      if (openChatFromHero) openChatFromHero.addEventListener('click', function(e) {
        e.preventDefault();
        toggleChatWindow();
      });
      if (heroRobotBox) heroRobotBox.addEventListener('click', function() {
        toggleChatWindow();
      });

      // Knowledge Base grounded strictly in crm-oquv-markaz2.vercel.app
      function getBotAnswer(question) {
        const q = question.toLowerCase();

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
    });
  