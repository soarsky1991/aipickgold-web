// Art-directed content galaxy; scale and jets are illustrative, not astronomical data.
export function createGalaxy(THREE, scene, pixelRatio) {
  let seed = 74129;
  const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
  const galaxy = new THREE.Group();
  scene.add(galaxy);
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = textureCanvas.height = 128;
  const ctx = textureCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64,64,0,64,64,64);
  gradient.addColorStop(0,'white'); gradient.addColorStop(.08,'rgba(255,255,255,.95)');
  gradient.addColorStop(.25,'rgba(255,255,255,.3)'); gradient.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gradient; ctx.fillRect(0,0,128,128);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const positions=[], colors=[], sizes=[];
  for(let i=0;i<14000;i++) {
    const r=Math.pow(random(),.72)*2.22;
    const arm=i%3;
    const scatter=(random()-.5)*(.3+r*.65);
    const angle=[0,2.05,4.5][arm]+r*(2.1+arm*.15)+Math.sin(r*3.1+arm)*.25+scatter;
    // Uneven arm edges leave dark dust lanes between the denser star streams.
    const clump=.65+.35*Math.sin(r*21+arm*4);
    const spread=(random()-.5)*(.08+r*.22)*clump;
    positions.push(Math.cos(angle)*r+spread,Math.sin(angle)*r+spread,(random()-.5)*(.22+Math.exp(-r*3)*.48));
    const t=r/2.22, brightness=.25+random()*.75;
    colors.push((.72-t*.4)*brightness,(.7+t*.1)*brightness,(.8+t*.2)*brightness);
    sizes.push(random()>.985? 4+random()*3 : .8+random()*1.6);
  }
  const stars=new THREE.BufferGeometry();
  stars.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  stars.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  stars.setAttribute('aSize',new THREE.Float32BufferAttribute(sizes,1));
  const starMaterial=new THREE.ShaderMaterial({
    uniforms:{uRatio:{value:pixelRatio}}, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:`attribute float aSize; attribute vec3 color; varying vec3 vColor; uniform float uRatio;
      void main(){ vColor=color; vec4 p=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*p; gl_PointSize=clamp(aSize*uRatio*5./max(1.,-p.z),1.,12.); }`,
    fragmentShader:`varying vec3 vColor; void main(){float d=length(gl_PointCoord-.5)*2.; float a=exp(-d*d*6.)*(1.-smoothstep(.65,1.,d)); gl_FragColor=vec4(vColor,a*.85);}`
  });
  galaxy.add(new THREE.Points(stars,starMaterial));
  const vertex=`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const noise=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){return noise(p)*.5+noise(p*2.03)*.25+noise(p*4.01)*.125;}`;
  const dustMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,
    vertexShader:vertex, fragmentShader:`varying vec2 vUv; ${noise}
    void main(){vec2 p=(vUv-.5)*4.8;float r=length(p),a=atan(p.y,p.x);float n=fbm(p*8.);
      vec2 warp=vec2(fbm(p*1.8),fbm(p*1.8+7.))-.42;
      vec2 q=p+warp*.65;float qr=length(q),qa=atan(q.y,q.x);
      float wave=.5+.5*cos(qa*3.-qr*6.6+fbm(q*3.)*3.);
      float clouds=smoothstep(.2,.67,fbm(q*5.+warp*4.));
      float arms=pow(wave,4.)*clouds;float dust=clouds*.16;
      float fade=(1.-smoothstep(1.4,2.35,r))*smoothstep(.08,.55,r);
      vec3 c=mix(vec3(.43,.23,.72),vec3(.08,.5,.85),smoothstep(.3,1.9,r));
      gl_FragColor=vec4(c,fade*(arms*.58+dust)*(.3+n));}`});
  const dust=new THREE.Mesh(new THREE.PlaneGeometry(4.8,4.8),dustMaterial); dust.position.z=-.12; galaxy.add(dust);
  const upperDust=new THREE.Mesh(dust.geometry,dustMaterial.clone());
  upperDust.material.fragmentShader=upperDust.material.fragmentShader.replace("arms*.58+dust", "arms*.18+dust*.3");
  upperDust.scale.set(1.08,.87,1); upperDust.position.set(.13,-.08,.48); upperDust.rotation.z=.24; galaxy.add(upperDust);
  // An absorbing foreground lane separates the hot nucleus from the near arm.
  const lane=new THREE.Mesh(new THREE.PlaneGeometry(4.8,4.8),new THREE.ShaderMaterial({
    vertexShader:vertex,transparent:true,depthWrite:false,side:THREE.DoubleSide,
    fragmentShader:`varying vec2 vUv; ${noise}
      void main(){vec2 p=(vUv-.5)*4.8;float r=length(p),a=atan(p.y,p.x);float n=fbm(p*13.);
      float lane=smoothstep(.38,.65,fbm(p*4.+vec2(n*3.)))*pow(.5+.5*cos(a*3.-r*6.6+n*5.),3.);
      float fade=smoothstep(.35,.8,r)*(1.-smoothstep(1.7,2.3,r));
      gl_FragColor=vec4(.008,.014,.035,lane*fade*.64);}` }));
  lane.position.z=.21; galaxy.add(lane);
  const coreMaterial=new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:vertex, fragmentShader:`varying vec2 vUv; uniform float uTime; ${noise}
    void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float a=atan(p.y,p.x);
      float turbulence=fbm(p*14.+vec2(uTime*.025,-uTime*.018));
      float whiteHeat=exp(-r*r*105.);float gold=exp(-r*r*19.);float ember=exp(-r*4.8)*(.4+turbulence);
      float corona=exp(-abs(r-(.26+turbulence*.065))*22.)*(.3+.7*pow(.5+.5*sin(a*19.+turbulence*10.),3.));
      vec3 color=vec3(1.,.98,.9)*whiteHeat*2.8+vec3(1.,.42,.07)*gold*1.3+vec3(.8,.12,.015)*ember*.8+vec3(1.,.4,.06)*corona*.5;
      gl_FragColor=vec4(color,(1.-smoothstep(.55,1.,r)));}`});
  const core=new THREE.Mesh(new THREE.PlaneGeometry(1.95,1.95),coreMaterial); scene.add(core);
  // Thin near-core flare, rather than a full-screen bloom wash.
  const flare=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:0xffc98a,transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false}));
  flare.scale.set(2.2,.1,1); scene.add(flare);
  const jetMaterial=new THREE.ShaderMaterial({uniforms:{uTime:coreMaterial.uniforms.uTime},vertexShader:vertex,transparent:true,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending,
    fragmentShader:`varying vec2 vUv;uniform float uTime; ${noise} void main(){
      float y=vUv.y;
      float bend=sin(y*7.-uTime*.025)*y*.09;
      float turbulence=fbm(vec2(vUv.x*15.,y*22.-uTime*.07));
      float x=abs(vUv.x-.5-bend-(turbulence-.4)*y*.09);
      float width=.025+y*.23;
      float spine=exp(-pow(x/(.014+y*.045),2.));
      float sheath=exp(-pow(x/width,2.)*3.);
      float knots=.25+turbulence;
      float fade=pow(1.-y,1.15)*smoothstep(0.,.025,y);
      vec3 c=mix(vec3(1.,.74,.42),vec3(.18,.65,1.),smoothstep(.05,.65,y));
      gl_FragColor=vec4(c,(spine*.32+sheath*.75)*knots*fade);}`});
  for(const sign of [-1,1]){
    // Crossed sheets retain the beam when the galaxy is viewed edge-on.
    for(const angle of [0,Math.PI/2]){
      const jet=new THREE.Mesh(new THREE.PlaneGeometry(.8,2.8),jetMaterial);
      jet.geometry.translate(0,1.4,0);jet.rotation.x=sign*Math.PI/2;
      const axis=new THREE.Group();axis.rotation.z=angle;axis.add(jet);galaxy.add(axis);
    }
  }
  const background=new THREE.Group(); scene.add(background);
  for(const [count,depth,size,opacity] of [[950,-7,.023,.55],[200,-2.5,.035,.65],[45,1.6,.07,.7]]){
    const points=[];
    for(let i=0;i<count;i++) points.push((random()-.5)*12,(random()-.5)*8,depth+(random()-.5)*2);
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
    background.add(new THREE.Points(geometry,new THREE.PointsMaterial({map:texture,size,color:0x9dbbd9,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending})));
  }
  // Separate world-space veils give zoom a foreground/background reference.
  const veils=new THREE.Group();scene.add(veils);
  const travelUniform={value:0};
  const cloudMaterial=new THREE.ShaderMaterial({uniforms:{uTravel:travelUniform,uForeground:{value:0}},vertexShader:vertex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    fragmentShader:`varying vec2 vUv; uniform float uTravel;uniform float uForeground; ${noise}
      void main(){vec2 p=vUv-.5;float edge=1.-smoothstep(.15,.52,length(p));
      vec2 warp=vec2(fbm(p*5.),fbm(p*5.+11.));
      float n=fbm(p*9.+warp*3.);float filament=pow(smoothstep(.24,.7,n),2.);
      vec3 c=mix(vec3(.12,.22,.52),vec3(.38,.18,.48),warp.x);
      gl_FragColor=vec4(c,edge*filament*.85*(1.-uForeground*uTravel*.7));}`});
  for(const [x,y,z,size,angle] of [[-3.2,1.8,-3.5,6.5,.4],[3.3,-1.4,-4.5,7.,-.5],[-1.7,-1.1,1.6,2.7,.8],[1.8,.9,1.2,2.3,-.4]]){
    const material=z>0?cloudMaterial.clone():cloudMaterial;
    if(z>0){material.uniforms.uTravel=travelUniform;material.uniforms.uForeground.value=1;}
    const cloud=new THREE.Mesh(new THREE.PlaneGeometry(size,size),material);
    cloud.position.set(x,y,z);cloud.rotation.z=angle;cloud.userData.originX=x;cloud.userData.originY=y;cloud.userData.originZ=z;
    veils.add(cloud);
  }
  const distantCluster=[];
  for(let i=0;i<180;i++){
    const a=random()*Math.PI*2,r=Math.pow(random(),2)*.8;
    distantCluster.push(-3.1+Math.cos(a)*r,1.65+Math.sin(a)*r*.45,-3.3+random()*.3);
  }
  const clusterGeometry=new THREE.BufferGeometry();clusterGeometry.setAttribute('position',new THREE.Float32BufferAttribute(distantCluster,3));
  scene.add(new THREE.Points(clusterGeometry,new THREE.PointsMaterial({map:texture,color:0xa9bfff,size:.045,transparent:true,opacity:.65,depthWrite:false,blending:THREE.AdditiveBlending})));
  const depthObjects=new THREE.Group();scene.add(depthObjects);
  const satelliteMaterial=new THREE.ShaderMaterial({vertexShader:vertex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    fragmentShader:`varying vec2 vUv; ${noise}
      void main(){vec2 p=(vUv-.5)*2.;p.y*=2.8;float r=length(p),a=atan(p.y,p.x);
      float arms=pow(.5+.5*cos(a*2.-r*8.+fbm(p*6.)*2.),3.);
      float haze=exp(-r*r*3.);float core=exp(-r*r*100.);
      gl_FragColor=vec4(vec3(.3,.46,.72)*haze*(.35+arms*.8)+vec3(.95,.8,.64)*core*.85,(haze*.55+core*.65)*(1.-smoothstep(.65,1.,r)));}`});
  for(const [x,y,z,size,angle] of [[-2.25,2.15,-2.8,1.8,-.32],[3.,-.65,-4.,1.35,.55]]){
    const island=new THREE.Mesh(new THREE.PlaneGeometry(size,size),satelliteMaterial);
    island.position.set(x,y,z);island.rotation.z=angle;depthObjects.add(island);
  }
  const shadowMaterial=new THREE.ShaderMaterial({uniforms:{uTravel:travelUniform},vertexShader:vertex,transparent:true,depthWrite:false,
    fragmentShader:`varying vec2 vUv;uniform float uTravel; ${noise}
      void main(){vec2 p=vUv-.5;float n=fbm(p*8.+vec2(fbm(p*3.)*4.));
      float edge=1.-smoothstep(.2,.55,length(p));
      gl_FragColor=vec4(.008,.015,.03,edge*smoothstep(.18,.55,n)*.82*(1.-uTravel*.75));}`});
  for(const [x,y,size,angle] of [[-1.55,-.95,2.4,.3],[1.65,.5,2.,-.5]]){
    const shadow=new THREE.Mesh(new THREE.PlaneGeometry(size,size),shadowMaterial);
    shadow.position.set(x,y,1.85);shadow.rotation.z=angle;depthObjects.add(shadow);
  }
  for(const [x,y,z,size] of [[-1.4,.65,2.,.18],[1.45,-.6,1.7,.24],[-.85,-1.25,1.9,.12]]){
    const mote=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:0xb8d8ff,transparent:true,opacity:.32,depthWrite:false,blending:THREE.AdditiveBlending}));
    mote.position.set(x,y,z);mote.scale.setScalar(size);depthObjects.add(mote);
  }
  depthObjects.children.forEach(object=>{object.userData.originX=object.position.x;object.userData.originY=object.position.y;object.userData.originZ=object.position.z;});
  const beacons=[],rings=[];
  const landmarks=[.4,1.65,2.9,4.2,5.45].map((angle,index)=>{
    const r=index%2?1.45:1.85;
    const point=new THREE.Vector3(Math.cos(angle)*r,Math.sin(angle)*r,.12);
    const beacon=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:0x69e5ff,blending:THREE.AdditiveBlending,depthWrite:false}));
    beacon.scale.setScalar(.2);beacon.position.copy(point);galaxy.add(beacon);beacons.push(beacon);
    const ring=new THREE.Mesh(new THREE.RingGeometry(.09,.1,40),new THREE.MeshBasicMaterial({color:0xb8f5ff,side:THREE.DoubleSide,transparent:true,opacity:.9,depthWrite:false}));
    ring.position.copy(point);ring.visible=false;galaxy.add(ring);rings.push(ring);
    return point;
  });
  let elapsed=0;
  return {galaxy,landmarks,
    update(delta,travel=0){travelUniform.value=travel;elapsed+=delta;coreMaterial.uniforms.uTime.value=elapsed;background.rotation.y=galaxy.rotation.z*.1;background.rotation.x=galaxy.rotation.x*.12;
      depthObjects.children.forEach(object=>{
        const front=object.userData.originZ>0;
        const shift=front?.95:.025;
        object.position.z=object.userData.originZ+(front?travel*.6:0);
        if(object.isSprite) object.material.opacity=.32*(1.-travel*.7);
        object.position.x=object.userData.originX*(1+(front?travel*.22:0))+Math.sin(galaxy.rotation.z-.12)*shift;
        object.position.y=object.userData.originY*(1+(front?travel*.12:0))+Math.sin(galaxy.rotation.x+.95)*shift;
      });
      veils.children.forEach(cloud=>{
        const front=cloud.userData.originZ>0;
        const parallax=front?.72:.035;
        cloud.position.z=cloud.userData.originZ+(front?travel*.5:0);
        cloud.position.x=cloud.userData.originX*(1+(front?travel*.2:0))+Math.sin(galaxy.rotation.z-.12)*parallax;
        cloud.position.y=cloud.userData.originY*(1+(front?travel*.1:0))+Math.sin(galaxy.rotation.x+.95)*parallax;
      });
      background.children.forEach((layer,index)=>{
        const depth=[.04,.16,.42][index];
        layer.position.x=Math.sin(galaxy.rotation.z-.12)*depth;
        layer.position.y=Math.sin(galaxy.rotation.x+.95)*depth;
      });},
    highlight(index){beacons.forEach((beacon,i)=>{beacon.scale.setScalar(i===index?.36:.2);beacon.material.opacity=index<0||i===index?1:.45;rings[i].visible=i===index;});}
  };
}
