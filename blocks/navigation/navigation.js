export default function decorate(block) {
  block.classList.add('global-nav-bar');

  // Fonction principale qui extrait les liens et construit la barre
  function buildNav() {
    // Évite de dupliquer si la barre est déjà construite
    if (block.querySelector('.nav-links-list')) return;

    // On attrape ABSOLUMENT tous les liens <a> présents dans le bloc, peu importe leur niveau d'imbrication
    const allLinks = Array.from(block.querySelectorAll('a'));
    
    // Si AEM n'a pas encore injecté les liens, on ne fait rien et on attend
    if (allLinks.length === 0) return;

    const navLinksContainer = document.createElement('nav');
    navLinksContainer.className = 'nav-links-list';

    allLinks.forEach((linkElement) => {
      // On crée notre bouton de navigation propre
      const navItem = document.createElement('a');
      navItem.className = 'nav-item-link';
      navItem.href = linkElement.href;
      
      // On récupère le texte du lien ou de la cellule parente
      let parentCell = linkElement.closest('div');
      let cleanText = parentCell ? parentCell.textContent.trim() : linkElement.textContent.trim();

      // Si le texte est trop long (car il contient l'URL), on se rabat uniquement sur le texte du lien d'origine
      if (cleanText.includes('http') || cleanText.length > 50) {
        cleanText = linkElement.textContent.trim();
      }

      // --- NETTOYAGE AGRESSIF DU TEXTE ---
      // Supprime "Edit", "- DA" et nettoie les résidus
      if (cleanText.toLowerCase().includes('edit') || cleanText.toLowerCase().includes('- da')) {
        cleanText = cleanText
          .replace(/edit/gi, '')
          .replace(/-\s*da/gi, '')
          .trim();
      }

      // Sécurité si le nettoyage a tout vidé
      if (!cleanText) {
        cleanText = linkElement.textContent.trim();
      }

      // Première lettre en majuscule
      navItem.textContent = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
      navLinksContainer.appendChild(navItem);
    });

    // On vide le bloc d'origine d'AEM et on y met notre barre de liens toute propre
    block.innerHTML = '';
    block.append(navLinksContainer);

    // Déplacement forcé au tout début du <body> pour l'affichage en haut de page
    const mainLayout = document.querySelector('body');
    if (mainLayout) {
      const wrapper = block.closest('.navigation-wrapper') || block;
      if (mainLayout.firstChild !== wrapper) {
        mainLayout.insertBefore(wrapper, mainLayout.firstChild);
      }
    }
  }

  // --- SÉCURITÉ CONTRE LE TIMING D'AEM ---
  // 1. On tente de construire le menu immédiatement
  buildNav();

  // 2. Si AEM met du temps à charger le HTML, on surveille l'arrivée des éléments pour exécuter le code dès qu'ils apparaissent
  const observer = new MutationObserver(() => {
    if (block.querySelectorAll('a').length > 0) {
      buildNav();
      observer.disconnect(); // On arrête de surveiller une fois que c'est fait
    }
  });

  observer.observe(block, { childList: true, subtree: true });
}
