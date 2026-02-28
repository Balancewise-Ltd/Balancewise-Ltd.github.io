'use strict';
(function(){
  const c=document.getElementById('heroCanvas');
  if(!c||typeof THREE==='undefined')return;
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(75,c.offsetWidth/c.offsetHeight,.1,1000);
  cam.position.z=30;
  const r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});
  r.setSize(c.offsetWidth,c.offsetHeight);r.setPixelRatio(Math.min(devicePixelRatio,2));
  const n=900,g=new THREE.BufferGeometry(),p=new Float32Array(n*3),cl=new Float32Array(n*3);
  for(let i=0;i<n*3;i++)p[i]=(Math.random()-.5)*110;
  for(let i=0;i<n;i++){const b=Math.random()>.3;cl[i*3]=b?.2+Math.random()*.3:.9;cl[i*3+1]=b?.45+Math.random()*.3:.65;cl[i*3+2]=b?.9:.1;}
  g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(cl,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({size:.18,vertexColors:true,transparent:true,opacity:.7}));
  scene.add(pts);
  let t=0,mx=0,my=0;
  document.addEventListener('mousemove',e=>{mx=(e.clientX/innerWidth-.5)*.25;my=(e.clientY/innerHeight-.5)*.18;});
  (function a(){requestAnimationFrame(a);t+=.004;pts.rotation.y=t*.1+mx;pts.rotation.x=t*.04+my;r.render(scene,cam);})();
  window.addEventListener('resize',()=>{cam.aspect=c.offsetWidth/c.offsetHeight;cam.updateProjectionMatrix();r.setSize(c.offsetWidth,c.offsetHeight);});
})();
