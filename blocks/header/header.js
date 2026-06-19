export default async function decorate(block) {
  // On récupère toutes les lignes de texte du bloc navigation
  const rows = block.querySelectorAll('div > div > *');
  if (!rows.length) return;

  const ul = document.createElement('ul');
  ul.classList.add('nav-menu');
  
  let currentDropdown = null;
  let currentDropdownUl = null;

  rows.forEach((element) => {
    // Si l'élément contient d'autres sous-éléments (comme des <li>), on extrait le texte/lien interne
    const items = element.tagName === 'UL' || element.tagName === 'OL' 
      ? element.querySelectorAll('li') 
      : [element];

    items.forEach((item) => {
      const link = item.querySelector('a');
      const text = item.textContent.trim();
      
      if (!text) return; // On ignore les lignes vides

      // CAS 1 : C'est l'Accueil (un lien tout seul au début, sans menu déroulant)
      if (text.toLowerCase().includes('accueil') && link) {
        const li = document.createElement('li');
        li.classList.add('nav-item');
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = text;
        li.appendChild(newLink);
        ul.appendChild(li);
      } 
      // CAS 2 : C'est un titre de catégorie (Texte noir, pas de lien) -> ex: Jeux, Interviews...
      else if (!link) {
        const li = document.createElement('li');
        li.classList.add('nav-item', 'dropdown');
        li.innerHTML = `<span class="dropdown-toggle">${text}</span>`;
        
        currentDropdownUl = document.createElement('ul');
        currentDropdownUl.classList.add('dropdown-menu');
        li.appendChild(currentDropdownUl);
        
        ul.appendChild(li);
        currentDropdown = li;

        // Gestion du clic pour ouvrir le menu déroulant
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          // Ferme les autres menus ouverts avant d'ouvrir celui-ci
          ul.querySelectorAll('.dropdown.is-open').forEach((d) => {
            if (d !== li) d.classList.remove('is-open');
          });
          li.classList.toggle('is-open');
        });
      } 
      // CAS 3 : C'est une sous-page (Un lien bleu) -> On l'ajoute au menu déroulant en cours
      else if (currentDropdownUl) {
        const li = document.createElement('li');
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = text;
        li.appendChild(newLink);
        currentDropdownUl.appendChild(li);
      }
    });
  });

  // Fermer les menus si on clique n'importe où ailleurs sur l'écran
  document.addEventListener('click', () => {
    ul.querySelectorAll('.dropdown.is-open').forEach((d) => d.classList.remove('is-open'));
  });

  // On vide le bloc et on y injecte notre nouvelle structure propre
  block.textContent = '';
  block.appendChild(ul);
}
