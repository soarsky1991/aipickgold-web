import { createGalaxy } from './galaxy-scene.js';

export function initEcosystem() {
  const stage = document.querySelector('#ecosystem-stage');
  const canvas = document.querySelector('#ecosystem-canvas');
  const motionButton = document.querySelector('#ecosystem-motion');
  const title = document.querySelector('#ecosystem-title');
  const description = document.querySelector('#ecosystem-description');
  const link = document.querySelector('#ecosystem-link');
  const nodeButtons = [...document.querySelectorAll('.ecosystem-node')];
  const paths = {
    codex: ['Codex 学习', '从第一课开始，查看 60 篇教程与 12 个学习部分。', '?view=learn', '进入学习地图 ↗'],
    workflow: ['AI 内容工作流', '目前从 Codex 学习站中的任务方法开始，独立的内容工作流专题尚未上线。', 'https://aipickgold.com/aipickgold-studio/', '浏览 Codex 学习站 ↗'],
    reuse: ['跨平台复用', '一次研究，多平台复用。独立专题尚未上线，可先了解主理人的公开方法。', '?view=about', '查看主理人实践 ↗'],
    research: ['机会研究', '查看研究方法、证据、反例与风险条件；不荐股、不承诺收益。', '?view=about', '了解内容边界 ↗'],
    founder: ['主理人实践', '了解智辰公开的工作方法、教程与可核验成果。', '?view=about', '了解智辰 ↗'],
  };
  const closeButton = document.querySelector('#ecosystem-close');
  const markerLayer = document.querySelector('.galaxy-landmarks');
  const connections = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  connections.classList.add('galaxy-lines');
  markerLayer.append(connections);
  const lines = [];
  const markers = nodeButtons.map(button => {
    const marker = document.createElement('button');
    marker.className = 'galaxy-marker';
    marker.type = 'button';
    marker.tabIndex = -1;
    marker.textContent = button.textContent;
    marker.dataset.node = button.dataset.node;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    connections.append(line); lines.push(line);
    markerLayer.append(marker);
    return marker;
  });
  let selected = null;
  const select = id => {
    selected = id;
    const entry = paths[id];
    title.textContent = entry ? entry[0] : '探索内容星系';
    description.textContent = entry ? entry[1] : '拖动星系改变视角，点击地标或下方入口查看内容。触屏可横向拖动，上下滑动浏览页面。';
    link.hidden = closeButton.hidden = !entry;
    if (entry) { link.href = entry[2]; link.textContent = entry[3]; }
    [...nodeButtons, ...markers].forEach(button => button.setAttribute('aria-pressed', String(button.dataset.node === id)));
    if (cosmos) cosmos.highlight(nodeButtons.findIndex(button => button.dataset.node === id));
    requestRender();
  };
  [...nodeButtons, ...markers].forEach(button => button.addEventListener('click', () => select(button.dataset.node)));
  closeButton.addEventListener('click', () => { const index = nodeButtons.findIndex(button => button.dataset.node === selected); select(null); nodeButtons[Math.max(0, index)].focus(); });
  document.querySelector('.ecosystem').addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeButton.click(); event.preventDefault(); }
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false, userEnabled = false, hoveringCanvas = false, hoveringNode = false, focusedNode = false;
  let activePointer = null, touchStartX = 0, touchStartY = 0;
  let dragging = false, visible = true, frame = 0, previousTime = 0;
  let renderer, scene, camera, galaxy, cosmos, landmarks = [];
  let nearView = false, cameraTargetZ = 6.2;
  const zoomButton = document.querySelector('#ecosystem-zoom');
  const status = document.querySelector('#galaxy-status');
  const shouldRotate = () => (!reducedMotion.matches || userEnabled) && !userPaused && !hoveringCanvas && !hoveringNode && !focusedNode && !selected;
  const updateMotionLabel = () => {
    motionButton.textContent = reducedMotion.matches && !userEnabled ? '开启缓慢旋转' : userPaused ? '继续旋转' : '暂停旋转';
  };
  const render = time => {
    frame = 0;
    if (!renderer || !visible || document.hidden) return;
    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
    previousTime = time;
    if (shouldRotate()) galaxy.rotation.z += delta * 0.035;
    status.textContent = dragging ? '拖动探索中' : selected ? '正在查看内容 · 旋转已暂停' : userPaused || (reducedMotion.matches && !userEnabled) ? '已暂停 · 可拖动探索' : !shouldRotate() ? '操作时暂停' : '缓慢旋转中';
    const cameraMoving = Math.abs(camera.position.z - cameraTargetZ) > .002;
    if (cameraMoving) camera.position.z = reducedMotion.matches ? cameraTargetZ : camera.position.z + (cameraTargetZ - camera.position.z) * (1 - Math.exp(-delta * 5));
    else camera.position.z = cameraTargetZ;
    cosmos?.update(shouldRotate() ? delta : 0, (6.2 - camera.position.z) / 1.55);
    camera.updateMatrixWorld(true);
    galaxy.updateMatrixWorld(true);
    const width = stage.clientWidth, height = stage.clientHeight;
    const placed = [];
    landmarks.forEach((point, index) => {
      const world = galaxy.localToWorld(point.clone());
      const projected = world.clone().project(camera);
      const marker = markers[index];
      const mobile = width < 460;
      const right = index % 2 === 0;
      const x = mobile ? (right ? width - 65 : 65) : (right ? width - 76 : 76);
      const sideIndex = mobile ? Math.floor(index / 2) : placed.filter(p => p.right === right).length;
      const sideCount = mobile ? (right ? 3 : 2) : 3;
      const y = 80 + sideIndex * Math.min(82, (height - 180) / Math.max(1, sideCount - 1));
      placed.push({x,y,right});
      marker.style.left = '0'; marker.style.top = '0';
      marker.style.transform = `translate(${x}px, ${y}px)`;
      marker.style.zIndex = String(10 + Math.round(world.z * 5));
      marker.style.setProperty('--depth', world.z < -0.2 ? '.72' : '1');
      const line = lines[index];
      line.setAttribute('x1', String((projected.x + 1) * width / 2));
      line.setAttribute('y1', String((1 - projected.y) * height / 2));
      line.setAttribute('x2', String(x));
      line.setAttribute('y2', String(y));
    });
    renderer.render(scene, camera);
    if (shouldRotate() || dragging || cameraMoving) frame = requestAnimationFrame(render);
  };
  const requestRender = () => {
    if (!frame && renderer && visible && !document.hidden) frame = requestAnimationFrame(render);
  };
  const resize = () => {
    if (!renderer) return;
    const { width, height } = stage.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestRender();
  };
  const fallback = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; visible = false;
    stage.classList.add('is-fallback');
    canvas.hidden = true;
    markerLayer.hidden = true;
    document.querySelector('#ecosystem-reset').hidden = true;
    motionButton.hidden = zoomButton.hidden = status.hidden = true;
  };
  motionButton.addEventListener('click', () => {
    if (reducedMotion.matches && !userEnabled) userEnabled = true;
    else userPaused = !userPaused;
    updateMotionLabel();
    requestRender();
  });
  stage.addEventListener('pointerenter', () => { hoveringCanvas = true; requestRender(); });
  stage.addEventListener('pointerleave', () => { hoveringCanvas = false; requestRender(); });
  [...nodeButtons, ...markers, motionButton, document.querySelector('#ecosystem-reset'), zoomButton, closeButton, link].forEach(button => {
    button.addEventListener('pointerenter', () => { hoveringNode = true; requestRender(); });
    button.addEventListener('pointerleave', () => { hoveringNode = false; requestRender(); });
    button.addEventListener('focus', () => { focusedNode = true; requestRender(); });
    button.addEventListener('blur', () => { focusedNode = false; requestRender(); });
  });
  canvas.addEventListener('pointerdown', event => {
    if (!galaxy || event.button !== 0 || activePointer !== null) return;
    activePointer = event.pointerId;
    dragging = event.pointerType !== 'touch';
    touchStartX = event.clientX; touchStartY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    canvas.dataset.x = String(event.clientX);
    canvas.dataset.y = String(event.clientY);
    requestRender();
  });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerId !== activePointer) return;
    if (!dragging) {
      const x = Math.abs(event.clientX - touchStartX), y = Math.abs(event.clientY - touchStartY);
      if (Math.max(x, y) < 10) return;
      if (y >= x) { activePointer = null; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); return; }
      dragging = true;
      canvas.dataset.x = String(event.clientX); canvas.dataset.y = String(event.clientY);
    }
    const dx = event.clientX - Number(canvas.dataset.x);
    const dy = event.clientY - Number(canvas.dataset.y);
    canvas.dataset.x = String(event.clientX);
    canvas.dataset.y = String(event.clientY);
    galaxy.rotation.z += dx * 0.006;
    if (event.pointerType !== 'touch') galaxy.rotation.x = Math.max(-1.05, Math.min(-0.12, galaxy.rotation.x + dy * 0.004));
    requestRender();
  });
  const endDrag = event => {
    if (event.pointerId !== activePointer) return;
    activePointer = null; dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    requestRender();
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('lostpointercapture', endDrag);
  document.addEventListener('visibilitychange', requestRender);
  reducedMotion.addEventListener('change', () => { userEnabled = false; userPaused = false; updateMotionLabel(); requestRender(); });
  const pauseOffscreen = skipped => {
    visible = !skipped && !stage.classList.contains('is-fallback');
    if (visible) requestRender();
    else if (frame) cancelAnimationFrame(frame), frame = 0;
  };
  if ('oncontentvisibilityautostatechange' in stage) {
    stage.addEventListener('contentvisibilityautostatechange', event => pauseOffscreen(event.skipped));
  } else if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => pauseOffscreen(!entry.isIntersecting)).observe(stage);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  else addEventListener('resize', resize);

  document.querySelector('#ecosystem-reset').addEventListener('click', () => { if (galaxy) galaxy.rotation.set(-0.95, 0.18, 0.12); cameraTargetZ=6.2; nearView=false; zoomButton.textContent='靠近观察'; select(null); requestRender(); });
  zoomButton.addEventListener('click', () => { if (!camera) return; nearView=!nearView; cameraTargetZ=nearView?4.65:6.2; zoomButton.textContent=nearView?'返回全景':'靠近观察'; requestRender(); });
  updateMotionLabel();
  import('three').then(THREE => {
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
      camera.position.z = 6.2;
      cosmos = createGalaxy(THREE, scene, renderer.getPixelRatio());
      galaxy = cosmos.galaxy; landmarks = cosmos.landmarks;
      galaxy.rotation.set(-0.95, 0.18, 0.12);
      resize();
      canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); if (frame) cancelAnimationFrame(frame); fallback(); }, { once: true });
    } catch { fallback(); }
  }).catch(fallback);
}
