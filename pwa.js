(()=>{
  if(!('serviceWorker'in navigator))return;
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/project-phoenix-lab/sw.js',{scope:'/project-phoenix-lab/'}).catch(()=>{});
  });
})();
