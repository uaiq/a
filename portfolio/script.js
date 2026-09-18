const username = 'uaiq';
const list = document.getElementById('repo-list');

async function loadRepos(){
  try{
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
    if(!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    if(!repos || repos.length===0){
      list.innerHTML = '<li>No public repositories found.</li>';
      return;
    }
    list.innerHTML = '';
    repos.forEach(r=>{
      const li = document.createElement('li');
      li.className = 'repo';
      li.innerHTML = `
        <h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
        <p>${r.description ? escapeHtml(r.description) : ''}</p>
        <div class="meta">⭐ ${r.stargazers_count} · Updated ${new Date(r.updated_at).toLocaleDateString()}</div>
      `;
      list.appendChild(li);
    });
  }catch(err){
    list.innerHTML = '<li>Could not load repositories.</li>';
    console.error(err);
  }
}

function escapeHtml(s){
  return s.replace(/[&<>\"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
}

loadRepos();

// Custom dot cursor: create a dot that follows the pointer
;(function(){
  if(typeof window === 'undefined') return;
  if(window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return; // skip touch

  const dot = document.createElement('div');
  dot.className = 'cursor-dot hidden';
  document.body.appendChild(dot);

  let mouseX = -100, mouseY = -100, dotX = -100, dotY = -100;
  let shown = false;

  function onMove(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(!shown){
      dot.classList.remove('hidden');
      shown = true;
    }
  }

  function onLeave(){
    dot.classList.add('hidden');
    shown = false;
  }

  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('mouseenter', onMove, {passive:true});
  window.addEventListener('mouseleave', onLeave, {passive:true});

  // follow with slight smoothing
  function animate(){
    dotX += (mouseX - dotX) * 0.18;
    dotY += (mouseY - dotY) * 0.18;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // enlarge dot on pointerdown for feedback
  window.addEventListener('pointerdown', ()=>{ dot.style.transform = 'translate(-50%,-50%) scale(0.85)'; }, {passive:true});
  window.addEventListener('pointerup', ()=>{ dot.style.transform = 'translate(-50%,-50%) scale(1)'; }, {passive:true});
})();