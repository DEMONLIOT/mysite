export default async function decorate(block) {
  // On récupère le premier élément de liste (ul) dans le bloc navigation
  const mainUl = block.querySelector('.navigation > div > div > ul');
  if (!mainUl) return;

  mainUl.classList.add('nav-menu');

  // On cherche toutes les puces de premier niveau (Jeux, Interviews, etc.)
  const menuItems = mainUl.querySelectorAll(':scope > li');

  menuItems.forEach((li) => {
    // Si cette puce contient une sous-liste (un <ul> imbriqué grâce à ton décalage)
    const subList = li.querySelector('ul');
    
    if (subList) {
      li.classList.add('nav-item', 'dropdown');
      subList.classList.add('dropdown-menu');

      // On récupère le texte du titre (ex: "Jeux") et on l'entoure d'un span cliquable
      const textNode = li.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.classList.add('dropdown-toggle');
        span.textContent = textNode.textContent.trim();
        li.insertBefore(span, textNode);
        textNode.remove();
      }

      // Au clic sur le titre, on ouvre ou ferme le menu déroulant
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Ferme les autres menus ouverts
        mainUl.querySelectorAll('.dropdown.is-open').forEach((openDropdown) => {
          if (openDropdown !== li) openDropdown.classList.remove('is-open');
        });

        li.classList.toggle('is-open');
      });
    } else {
      // C'est un lien direct sans sous-menu (comme Accueil)
      li.classList.add('nav-item');
    }
  });

  // Fermer les menus si on clique n'importe où ailleurs sur la page
  document.addEventListener('click', () => {
    mainUl.querySelectorAll('.dropdown.is-open').forEach((openDropdown) => {
      openDropdown.classList.remove('is-open');
    });
  });

  // On nettoie le bloc et on y met notre liste toute propre
  block.textContent = '';
  block.appendChild(mainUl);
}
