'use strict';
document.querySelectorAll('.filter-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const f=b.dataset.filter;
    document.querySelectorAll('.role-item').forEach(c=>c.classList.toggle('hidden',f!=='all'&&c.dataset.category!==f));
  });
});
