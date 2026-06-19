export default async function decorate(block) {
  // On attend une fraction de seconde pour être sûr que le HTML d'AEM est prêt
  setTimeout(() => {
    const rows = block.querySelectorAll('div > div');
    if (!rows.length) return;

    const ul = document.createElement('ul');
    ul.classList.add('nav-menu');
    ul.style.display = 'flex';
    ul.style.listStyle = 'none';
    ul.style.background = '#222';
    ul.style.padding = '10px';

    rows.forEach((row) => {
      const text = row.textContent.trim();
      if (!text) return;

      const li = document.createElement('li');
      li.style.padding = '0 15px';
      li.style.color = '#fff';
      
      const link = row.querySelector('a');
      if (link) {
        li.innerHTML = `<a href="${link.href}" style="color:#fff; text-decoration:none;">${text}</a>`;
      } else {
        li.innerHTML = `<span style="cursor:pointer; font-weight:bold;">${text} ▼</span>`;
      }
      ul.appendChild(li);
    });

    block.textContent = '';
    block.appendChild(ul);
  }, 100);
}
