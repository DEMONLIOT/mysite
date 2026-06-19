export default async function decorate(block) {
  // On va chercher le contenu du tableau navigation
  const nav = block.querySelector('.navigation > div > div');
  if (!nav) return;

  const ul = document.createElement('ul');
  ul.classList.add('nav-menu');
  
  let currentDropdown = null;
  let currentDropdownUl = null;

  // On regarde chaque ligne de ton tableau DA
  const items = nav.querySelectorAll('li, p');
  items.forEach((item) => {
    const link = item.querySelector('a');
    
    if (!link) {
      // C'est un texte noir (ex: Jeux, Interviews) -> On crée un menu déroulant
      const li = document.createElement('li');
      li.classList.add('nav-item', 'dropdown');
      li.innerHTML = `<span class="dropdown-toggle">${item.textContent.trim()}</span>`;
      
      currentDropdownUl = document.createElement('ul');
      currentDropdownUl.classList.add('dropdown-menu');
      li.appendChild(currentDropdownUl);
      
      ul.appendChild(li);
      currentDropdown = li;

      // Écouteur de clic pour ouvrir/fermer le menu
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.toggle('is-open');
      });
    } else if (currentDropdownUl) {
      // C'est un lien bleu -> On le met dans le menu déroulant actuel
      const li = document.createElement('li');
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = item.textContent.trim();
      li.appendChild(newLink);
      currentDropdownUl.appendChild(li);
    } else {
      // C'est un lien seul (comme Accueil)
      const li = document.createElement('li');
      li.classList.add('nav-item');
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = item.textContent.trim();
      li.appendChild(newLink);
      ul.appendChild(li);
    }
  });

  // Fermer les menus si on clique ailleurs sur la page
  document.addEventListener('click', () => {
    ul.querySelectorAll('.dropdown.is-open').forEach((openDropdown) => {
      openDropdown.classList.remove('is-open');
    });
  });

  block.textContent = '';
  block.appendChild(ul);
}
