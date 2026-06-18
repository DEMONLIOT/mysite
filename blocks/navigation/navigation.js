export default function decorate(block) {
  block.classList.add('global-nav-bar');

  const rows = Array.from(block.children);
  const navLinksContainer = document.createElement('nav');
  navLinksContainer.className = 'nav-links-list';

  rows.forEach((row) => {
    const columns = Array.from(row.children);
    if (columns.length === 0) return;

    const linkElement = row.querySelector('a');
    if (!linkElement) return;

    const navItem = document.createElement('a');
    navItem.className = 'nav-item-link';
    navItem.href = linkElement.href;
    
    // On récupère le texte brut du bloc d'origine
    const titleElement = columns[0].querySelector('h1, h2, h3, h4, p, strong, em') || columns[0];
    let rawText = titleElement ? titleElement.textContent.trim() : linkElement.textContent.trim();

    // --- NETTOYAGE DU TEXTE ---
    // Si le texte contient "Edit ... - DA", on extrait uniquement le prénom
    if (rawText.toLowerCase().includes('edit') && rawText.toLowerCase().includes('- da')) {
      // Expression régulière pour capturer le prénom entre "Edit " et " - DA"
      const match = rawText.match(/Edit\s+([A-Za-zÀ-ÿ\-]+)\s*-\s*DA/i);
      if (match && match[1]) {
        rawText = match[1]; // Devient "Christophe", "Duy", "Martin", etc.
      }
    }

    // On passe la première lettre en majuscule par sécurité esthétique
    navItem.textContent = rawText.charAt(0).toUpperCase() + rawText.slice(1);

    navLinksContainer.appendChild(navItem);
  });

  // On vide et on injecte la liste propre
  block.innerHTML = '';
  block.append(navLinksContainer);

  // Injection forcée tout en haut du body pour éviter que les animations la cachent
  const mainLayout = document.querySelector('body');
  if (mainLayout) {
    const wrapper = block.closest('.navigation-wrapper') || block;
    // On vérifie qu'on ne l'a pas déjà déplacée pour éviter les boucles
    if (mainLayout.firstChild !== wrapper) {
      mainLayout.insertBefore(wrapper, mainLayout.firstChild);
    }
  }
}
