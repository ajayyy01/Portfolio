/* ===================================================================
   Jainesh Paneer Selvam — portfolio
   A dispatch desk rendered in Three.js. No spaceships, no neon grids —
   just the objects that show up in the resume: parcels, ledgers, a
   gate-pass stamp, a laptop, a camera, a shuttlecock, a chess pawn,
   a framed diploma, and an envelope. The camera settles on a
   different object as each section scrolls into view.
=================================================================== */

(function(){

  const canvas = document.getElementById('scene');
  const wrap = document.getElementById('scene-wrap');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1e2320);
  scene.fog = new THREE.Fog(0x1e2320, 9, 22);

  const camera = new THREE.PerspectiveCamera(38, wrap.clientWidth / wrap.clientHeight, 0.1, 100);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  renderer.shadowMap.enabled = true;

  // ---------------- lighting ----------------
  const ambient = new THREE.AmbientLight(0x8f9a8a, 0.55);
  scene.add(ambient);

  const window_light = new THREE.DirectionalLight(0xffe3b8, 1.05);
  window_light.position.set(-4, 6, 4);
  window_light.castShadow = true;
  window_light.shadow.mapSize.set(1024, 1024);
  window_light.shadow.camera.left = -6;
  window_light.shadow.camera.right = 6;
  window_light.shadow.camera.top = 6;
  window_light.shadow.camera.bottom = -6;
  scene.add(window_light);

  const rim = new THREE.PointLight(0xc68b4b, 0.5, 12);
  rim.position.set(3, 2, -3);
  scene.add(rim);

  // ---------------- helper: label texture ----------------
  function labelTexture(text, bg, fg){
    const c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = bg; ctx.fillRect(0,0,256,128);
    ctx.strokeStyle = fg; ctx.lineWidth = 4;
    ctx.strokeRect(6,6,244,116);
    ctx.fillStyle = fg;
    ctx.font = '600 26px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);
    return new THREE.CanvasTexture(c);
  }

  // ---------------- group root ----------------
  const desk = new THREE.Group();
  scene.add(desk);

  // Desk surface
  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(9, 0.25, 5.5),
    new THREE.MeshStandardMaterial({ color: 0x5a4330, roughness: 0.85 })
  );
  deskTop.position.set(0, -0.15, 0);
  deskTop.receiveShadow = true;
  desk.add(deskTop);

  const deskGrain = new THREE.Mesh(
    new THREE.PlaneGeometry(8.8, 5.3),
    new THREE.MeshStandardMaterial({ color: 0x6b503a, roughness: 0.95 })
  );
  deskGrain.rotation.x = -Math.PI/2;
  deskGrain.position.set(0, -0.02, 0);
  deskGrain.receiveShadow = true;
  desk.add(deskGrain);

  function box(w,h,d,color,rough){
    return new THREE.Mesh(new THREE.BoxGeometry(w,h,d), new THREE.MeshStandardMaterial({color, roughness: rough ?? 0.7}));
  }

  // ---- parcel stack (experience: J&T) ----
  const parcels = new THREE.Group();
  const p1 = box(1.1,0.9,1.1,0xc79256); p1.position.set(0,0.45,0);
  const p2 = box(0.85,0.7,0.85,0xd6a86a); p2.position.set(0.15,1.15,-0.1);
  const p3 = box(0.6,0.5,0.6,0xbf8a4f); p3.position.set(-0.35,1.05,0.35);
  [p1,p2,p3].forEach(p=>{ p.castShadow=true; p.receiveShadow=true; parcels.add(p); });

  // tape crosses on p1
  const tapeMat = new THREE.MeshStandardMaterial({ color: 0x2c2a26, roughness:0.6 });
  const tapeA = new THREE.Mesh(new THREE.BoxGeometry(1.14,0.08,1.14), tapeMat);
  tapeA.position.copy(p1.position);
  parcels.add(tapeA);

  const label1 = new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.32), new THREE.MeshBasicMaterial({ map: labelTexture('J&T', '#eee2c9', '#2c2a26') }));
  label1.position.set(0.56, 0.6, 0);
  label1.rotation.y = Math.PI/2;
  parcels.add(label1);

  parcels.position.set(2.6, 0, -1.1);
  desk.add(parcels);

  // ---- ledger stack (experience: admin clerk) ----
  const ledgers = new THREE.Group();
  const colors = [0x5c3a2e, 0x3f5233, 0x33475c];
  colors.forEach((c,i)=>{
    const book = box(1.3, 0.18, 0.95, c, 0.6);
    book.position.set(0, 0.09 + i*0.2, 0);
    book.castShadow = true; book.receiveShadow = true;
    ledgers.add(book);
    const page = box(1.22, 0.03, 0.88, 0xe9e0c8, 0.9);
    page.position.set(0, 0.09 + i*0.2 + 0.1, 0);
    ledgers.add(page);
  });
  ledgers.position.set(2.7, 0, 1.3);
  ledgers.rotation.y = 0.15;
  desk.add(ledgers);

  // gate-pass stamp resting on ledgers
  const stampHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.5,16), new THREE.MeshStandardMaterial({ color:0x2b2b2b, roughness:0.4 }));
  const stampHead = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.14,20), new THREE.MeshStandardMaterial({ color:0xb8443a, roughness:0.5 }));
  const stampGroup = new THREE.Group();
  stampHandle.position.y = 0.42; stampHead.position.y = 0.14;
  stampGroup.add(stampHandle, stampHead);
  stampGroup.position.set(2.15, 0.75, 1.55);
  stampGroup.rotation.z = -0.35;
  stampGroup.castShadow = true;
  desk.add(stampGroup);

  // ---- laptop (skills: development / office) ----
  const laptop = new THREE.Group();
  const lbase = box(1.5,0.08,1.05,0x2e332e,0.5);
  const lscreen = box(1.5,0.9,0.05,0x2e332e,0.5);
  lscreen.position.set(0,0.45,-0.5);
  lscreen.rotation.x = -0.28;
  const lglow = new THREE.Mesh(new THREE.PlaneGeometry(1.32,0.74), new THREE.MeshBasicMaterial({ color:0x9fd6a0, opacity:0.85, transparent:true }));
  lglow.position.set(0,0.45,-0.475);
  lglow.rotation.x = -0.28;
  laptop.add(lbase, lscreen, lglow);
  laptop.traverse(o=>{ if(o.isMesh){ o.castShadow = true; o.receiveShadow = true; }});
  laptop.position.set(-1.6, 0.04, -0.6);
  laptop.rotation.y = 0.4;
  desk.add(laptop);

  // small tool chips beside laptop representing languages
  const chipColors = [0x5c7a3f, 0x8c6438, 0xb8443a, 0x33475c];
  const chips = new THREE.Group();
  chipColors.forEach((c,i)=>{
    const chip = box(0.22,0.05,0.22,c,0.5);
    chip.position.set(-2.4 + i*0.28, 0.03, 0.6);
    chip.castShadow = true;
    chips.add(chip);
  });
  desk.add(chips);

  // ---- camera prop (creative / photography) ----
  const cam = new THREE.Group();
  const camBody = box(0.5,0.32,0.28,0x1c1c1c,0.4);
  const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.13,0.28,20), new THREE.MeshStandardMaterial({ color:0x111111, roughness:0.3 }));
  camLens.rotation.z = Math.PI/2;
  camLens.position.set(0.35,0,0);
  const camFlash = box(0.12,0.1,0.1,0xd7d7d7,0.4);
  camFlash.position.set(-0.05,0.2,0);
  cam.add(camBody, camLens, camFlash);
  cam.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  cam.position.set(-2.9, 0.2, -1.4);
  cam.rotation.y = 0.5;
  desk.add(cam);

  // ---- shuttlecock (badminton) ----
  const shuttle = new THREE.Group();
  const cork = new THREE.Mesh(new THREE.SphereGeometry(0.09,16,16), new THREE.MeshStandardMaterial({ color:0xe9e0c8, roughness:0.6 }));
  const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.16,0.32,16,1,true), new THREE.MeshStandardMaterial({ color:0xf4f0e6, roughness:0.5, side:THREE.DoubleSide }));
  skirt.position.y = -0.2;
  skirt.rotation.x = Math.PI;
  shuttle.add(cork, skirt);
  shuttle.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  shuttle.position.set(-1.1, 0.22, 1.6);
  shuttle.rotation.z = 0.4;
  desk.add(shuttle);

  // ---- chess pawn ----
  const pawn = new THREE.Group();
  const pawnBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.16,0.06,16), new THREE.MeshStandardMaterial({ color:0x1d1d1d, roughness:0.5 }));
  const pawnBody = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.11,0.22,16), new THREE.MeshStandardMaterial({ color:0x1d1d1d, roughness:0.5 }));
  pawnBody.position.y = 0.15;
  const pawnHead = new THREE.Mesh(new THREE.SphereGeometry(0.08,16,16), new THREE.MeshStandardMaterial({ color:0x1d1d1d, roughness:0.5 }));
  pawnHead.position.y = 0.3;
  pawn.add(pawnBase, pawnBody, pawnHead);
  pawn.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  pawn.position.set(-0.7, 0.03, 1.9);
  desk.add(pawn);

  // ---- framed diploma (education) leaning at back ----
  const frame = new THREE.Group();
  const frameBorder = box(1.5,1.05,0.05,0x8c6438,0.5);
  const frameInner = new THREE.Mesh(new THREE.PlaneGeometry(1.3,0.85), new THREE.MeshBasicMaterial({ map: labelTexture('DIPLOMA · IT', '#ede6d6', '#2c2a26') }));
  frameInner.position.z = 0.03;
  frame.add(frameBorder, frameInner);
  frame.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  frame.position.set(0.4, 0.9, -2.3);
  frame.rotation.x = -0.18;
  desk.add(frame);

  const easel = new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,0.06), new THREE.MeshStandardMaterial({ color:0x3a2c20 }));
  easel.position.set(0.4, 0.28, -2.15);
  easel.rotation.x = 0.4;
  desk.add(easel);

  // ---- envelope + stamp (contact) ----
  const envelope = new THREE.Group();
  const envBody = box(0.9,0.03,0.6,0xede6d6,0.7);
  const envFlap = new THREE.Mesh(new THREE.ConeGeometry(0.5,0.35,4), new THREE.MeshStandardMaterial({ color:0xdccdb0, roughness:0.7 }));
  envFlap.rotation.y = Math.PI/4;
  envFlap.rotation.x = Math.PI/2;
  envFlap.position.set(0,0.02,-0.13);
  envFlap.scale.set(1,0.55,1);
  envelope.add(envBody, envFlap);
  envelope.traverse(o=>{ if(o.isMesh){ o.castShadow = true; o.receiveShadow = true; }});
  envelope.position.set(1.1, 0.05, -2.0);
  envelope.rotation.y = -0.2;
  desk.add(envelope);

  const inkStamp = new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.02,24), new THREE.MeshStandardMaterial({ color:0xb8443a, roughness:0.6 }));
  inkStamp.rotation.x = Math.PI/2;
  inkStamp.position.set(1.55, 0.05, -1.85);
  desk.add(inkStamp);

  // ---------------- camera presets per section ----------------
  const presets = {
    profile:    { pos: new THREE.Vector3(3.2, 3.4, 5.2),  look: new THREE.Vector3(0, 0.3, 0) },
    experience: { pos: new THREE.Vector3(3.6, 1.9, 1.6),  look: new THREE.Vector3(2.6, 0.5, 0.1) },
    skills:     { pos: new THREE.Vector3(-2.0, 1.7, 2.2), look: new THREE.Vector3(-1.9, 0.3, -0.2) },
    education:  { pos: new THREE.Vector3(0.6, 1.6, -0.3), look: new THREE.Vector3(0.4, 0.8, -2.2) },
    contact:    { pos: new THREE.Vector3(1.6, 1.2, -0.9), look: new THREE.Vector3(1.2, 0.1, -1.95) }
  };

  camera.position.copy(presets.profile.pos);
  const lookTarget = presets.profile.look.clone();

  let targetPos = presets.profile.pos.clone();
  let targetLook = presets.profile.look.clone();

  function goTo(section){
    const p = presets[section];
    if(!p) return;
    targetPos = p.pos.clone();
    targetLook = p.look.clone();
    document.querySelectorAll('.tag').forEach(t=>{
      t.classList.toggle('active', t.dataset.section === section);
    });
  }

  // ---------------- scroll-linked section detection ----------------
  const sections = document.querySelectorAll('[data-section]');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && entry.intersectionRatio > 0.5){
        goTo(entry.target.dataset.section);
      }
    });
  }, { threshold: [0.5] });
  sections.forEach(s => observer.observe(s));

  document.querySelectorAll('.tag').forEach(tag=>{
    tag.addEventListener('click', ()=> goTo(tag.dataset.section));
  });

  // ---------------- animation loop ----------------
  const clock = new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    camera.position.lerp(targetPos, 0.045);
    lookTarget.lerp(targetLook, 0.045);
    camera.lookAt(lookTarget);

    // gentle idle motion — one shared bob, not per-object noise everywhere
    stampGroup.rotation.z = -0.35 + Math.sin(t*1.3) * 0.05;
    shuttle.rotation.y = t * 0.6;
    pawn.rotation.y = Math.sin(t*0.5) * 0.15;
    desk.position.y = Math.sin(t*0.4) * 0.015;

    renderer.render(scene, camera);
  }
  animate();

  // ---------------- resize ----------------
  function onResize(){
    const w = wrap.clientWidth, h = wrap.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // ---------------- contact copy-to-clipboard ----------------
  document.querySelectorAll('.contact-row[data-copy]').forEach(row=>{
    row.addEventListener('click', ()=>{
      const val = row.getAttribute('data-copy');
      navigator.clipboard?.writeText(val).then(()=>{
        row.classList.add('copied');
        const hint = row.querySelector('.copy-hint');
        const original = hint.textContent;
        hint.textContent = 'copied';
        setTimeout(()=>{ hint.textContent = original; row.classList.remove('copied'); }, 1500);
      });
    });
  });

})();
