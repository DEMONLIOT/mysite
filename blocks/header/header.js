export default async function decorate(block) {
  // On récupère la liste principale du tableau
  const mainUl = block.querySelector('ul');
  if (!mainUl) return;

  mainUl.classList.add('nav-menu');

  // On cherche les titres principaux (Jeux, Interviews...)
  const lis = mainUl.querySelectorAll(':scope > li');
  lis.forEach((li) => {
    const subUl = li.querySelector('ul');
    const link = li.querySelector('a');

    // Si c'est une catégorie avec un sous-menu décalé
    if (subUl || !link) {
      li.classList.add('nav-item', 'dropdown');
      if (subUl) subUl.classList.add('dropdown-menu');

      // On transforme le texte brut en bouton cliquable
      const firstChild = li.firstChild;
      if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.classList.add('dropdown-toggle');
        span.style.cursor = 'pointer';
        span.textContent = firstChild.textContent.trim() + " ▼";
        li.insertBefore(span, firstChild);
        firstChild.remove();
      }

      // Gestion du clic pour ouvrir/fermer
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.toggle('is-open');
      });
    } else {
      li.classList.add('nav-item');
    }
  });

  // Fermer si on clique ailleurs
  document.addEventListener('click', () => {
    block.querySelectorAll('.dropdown.is-open').forEach((d) => d.classList.remove('is-open'));
  });
}
