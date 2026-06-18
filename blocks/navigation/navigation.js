export default function decorate(block) {
  block.classList.add('global-nav-bar');

  // Fonction magique qui construit la barre dès que les liens sont prêts
  function generateMenu() {
    // Si la barre a déjà été générée, on ne fait rien pour éviter les doublons
    if (block.querySelector('.nav-links-list')) return;

    const allLinks = Array.from(block.querySelectorAll('a'));
    if (allLinks.length === 0) return; // Si toujours aucun lien, on attend encore

    const navLinksContainer = document.createElement('nav');
    navLinksContainer.className = 'nav-links-list';

    allLinks.forEach((linkElement) => {
      const navItem = document.createElement('a');
      navItem.className = 'nav-item-link';
      navItem.href = linkElement.href; // Copie l'URL exacte du document
      
      // Récupération et nettoyage du texte (Prénom seul)
      let parentCell = linkElement.closest('div');
      let cleanText = parentCell ? parentCell.textContent.trim() : linkElement.textContent.trim();

      if (cleanText.includes('http') || cleanText.length > 60) {
        cleanText = linkElement.textContent.trim();
      }

      if (cleanText.toLowerCase().includes('edit') || cleanText.toLowerCase().includes('- da')) {
        cleanText = cleanText
          .replace(/edit/gi, '')
          .replace(/-\s*da/gi, '')
          .trim();
      }

      if (!cleanText) {
        cleanText = linkElement.textContent.trim();
      }

      navItem.textContent = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
      navLinksContainer.appendChild(navItem);
    });

    // On efface le tableau brut d'AEM et on injecte notre barre propre
    block.innerHTML = '';
    block.append(navLinksContainer);

    // On pousse la barre tout en haut du body
    const mainLayout = document.querySelector('body');
    if (mainLayout) {
      const wrapper = block.closest('.navigation-wrapper') || block;
      if (mainLayout.firstChild !== wrapper) {
        mainLayout.insertBefore(wrapper, mainLayout.firstChild);
      }
    }
  }

  // SÉCURITÉ TIMING : 
  // 1. On essaie de l'exécuter tout de suite au cas où
  generateMenu();

  // 2. On surveille le bloc pour l'exécuter dès que le tableau Word/Google Doc se charge dans la page
  const observer = new MutationObserver(() => {
    if (block.querySelectorAll('a').length > 0) {
      generateMenu();
      observer.disconnect(); // On arrête de surveiller une fois que c'est bon
    }
  });

  observer.observe(block, { childList: true, subtree: true });
}
