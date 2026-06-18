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
    
    // Nettoyage ultra-sécurisé du texte visible
    let cleanText = columns[0].textContent.trim();

    // Si le texte brut contient les mots clés d'AEM, on isole le prénom proprement
    if (cleanText.toLowerCase().includes('edit') || cleanText.toLowerCase().includes('- da')) {
      // Supprime "Edit", "edit", "- DA", "- da" et les espaces superflus
      cleanText = cleanText
        .replace(/edit/gi, '')
        .replace(/-\s*da/gi, '')
        .trim();
    }

    // Si après nettoyage c'est vide, on prend le texte du lien par défaut
    if (!cleanText) {
      cleanText = linkElement.textContent.trim();
    }

    // Première lettre en majuscule
    navItem.textContent = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
    navLinksContainer.appendChild(navItem);
  });

  block.innerHTML = '';
  block.append(navLinksContainer);

  // Replacement tout en haut du body
  const mainLayout = document.querySelector('body');
  if (mainLayout) {
    const wrapper = block.closest('.navigation-wrapper') || block;
    if (mainLayout.firstChild !== wrapper) {
      mainLayout.insertBefore(wrapper, mainLayout.firstChild);
    }
  }
}
