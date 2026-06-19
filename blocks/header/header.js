export default async function decorate(block) {
  console.log("=== Lancement du Header Décalé ===");

  // On va chercher toutes les lignes à l'intérieur du tableau de navigation
  const rows = block.querySelectorAll('.navigation > div > div, [data-block-name="header"] > div > div, .header > div > div');
  
  // Si on ne trouve pas avec les classes, on prend le premier conteneur venu du bloc
  const container = rows.length ? rows[0] : block.querySelector('div > div');
  
  if (!container) {
    console.error("Impossible de trouver le conteneur du tableau !");
    return;
  }

  const ul = document.createElement('ul');
  ul.classList.add('nav-menu');

  // On extrait absolument tous les éléments textuels ou listes du conteneur
  const children = container.children;
  let currentDropdownUl = null;

  Array.from(children).forEach((child) => {
    // Si c'est une liste à puces (UL) générée par tes retraits
    if (child.tagName === 'UL' || child.tagName === 'OL') {
      const lis = child.querySelectorAll('li');
      lis.forEach((li) => {
        const link = li.querySelector('a');
        const text = li.textContent.trim();
        
        if (link && currentDropdownUl) {
          // C'est une sous-page avec un lien -> on l'ajoute au menu déroulant en cours
          const subLi = document.createElement('li');
          subLi.innerHTML = `<a href="${link.href}">${text}</a>`;
          currentDropdownUl.appendChild(subLi);
        } else if (link) {
          // C'est un lien principal direct (ex: Accueil)
          const mainLi = document.createElement('li');
          mainLi.classList.add('nav-item');
          mainLi.innerHTML = `<a href="${link.href}">${text}</a>`;
          ul.appendChild(mainLi);
        }
      });
    } else {
      // C'est un texte brut (ex: Jeux, Interviews...) qui sert de titre
      const text = child.textContent.trim();
      const link = child.querySelector('a');
      
      if (!text) return;

      if (!link) {
        // Pas de lien -> C'est un déclencheur de menu déroulant
        const li = document.createElement('li');
        li.classList.add('nav-item', 'dropdown');
        li.innerHTML = `<span class="dropdown-toggle" style="cursor:pointer; font-weight:bold;">${text} ▼</span>`;
        
        currentDropdownUl = document.createElement('ul');
        currentDropdownUl.classList.add('dropdown-menu');
        li.appendChild(currentDropdownUl);
        ul.appendChild(li);

        li.addEventListener('click', (e) => {
          e.stopPropagation();
          li.classList.toggle('is-open');
        });
      } else {
        // Lien direct sous forme de paragraphe
        const li = document.createElement('li');
        li.classList.add('nav-item');
        li.innerHTML = `<a href="${link.href}">${text}</a>`;
        ul.appendChild(li);
        currentDropdownUl = null;
      }
    }
  });

  // Fermer au clic à l'extérieur
  document.addEventListener('click', () => {
    ul.querySelectorAll('.dropdown.is-open').forEach((d) => d.classList.remove('is-open'));
  });

  block.textContent = '';
  block.appendChild(ul);
  console.log("=== Menu reconstruit avec succès ===");
}
