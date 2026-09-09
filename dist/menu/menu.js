const links=[...document.querySelectorAll('.categories a')];
const sections=links.map(link=>document.querySelector(link.hash)).filter(Boolean);
function activate(id){links.forEach(link=>{const selected=link.hash===`#${id}`;link.classList.toggle('active',selected);selected?link.setAttribute('aria-current','true'):link.removeAttribute('aria-current')})}
function followScroll(){const atBottom=innerHeight+scrollY>=document.documentElement.scrollHeight-2;if(atBottom){activate(sections.at(-1).id);return}const marker=scrollY+document.querySelector('.categories').offsetHeight+24;let current=sections[0];sections.forEach(section=>{if(section.offsetTop<=marker)current=section});activate(current.id)}
links.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();history.replaceState(null,'',link.hash);document.querySelector(link.hash).scrollIntoView({behavior:'smooth',block:'start'});activate(link.hash.slice(1))}));
addEventListener('scroll',followScroll,{passive:true});
followScroll();
