export default async function decorate(block) {
  // On récupère la liste que tu as décalée dans ton tableau DA
  const mainUl = block.querySelector('ul');
  if (!mainUl) return;

  mainUl.classList.add('nav-menu');

  // On cherche les éléments principaux (Jeux, Interviews...)
  const lis = mainUl.querySelectorAll(':scope > li');
  lis.forEach((li) => {
    const subUl = li.querySelector('ul');
    const link = li.querySelector('a');

    // Si c'est une catégorie avec un sous-menu décalé (comme Jeux)
    if (subUl || !link) {
      li.classList.add('nav-item', 'dropdown');
      if (subUl) subUl.classList.add('dropdown-menu');

      // On isole le texte pour en faire un bouton cliquable
      const firstChild = li.firstChild;
      if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.classList.add('dropdown-toggle');
        span.style.cursor = 'pointer';
        span.textContent = firstChild.textContent.trim() + " ▼";
        li.insertBefore(span, firstChild);
        firstChild.remove();
      }

      // Gestion du clic pour ouvrir/fermer le menu déroulant
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.toggle('is-open');
      });
    } else {
      // Lien direct (comme Accueil)
      li.classList.add('nav-item');
    }
  });

  // Fermer les menus si on clique n'importe où ailleurs sur la page
  document.addEventListener('click', () => {
    block.querySelectorAll('.dropdown.is-open').forEach((d) => d.classList.remove('is-open'));
  });
}
