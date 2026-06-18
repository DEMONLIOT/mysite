export default function decorate(block) {
  block.classList.add('global-nav-bar');

  // On récupère TOUS les liens du bloc d'origine (ceux de ton tableau Word/Google Doc)
  const allLinks = Array.from(block.querySelectorAll('a'));
  
  // Si AEM n'a pas encore chargé le contenu, on s'arrête pour éviter de vider la barre
  if (allLinks.length === 0) return;

  const navLinksContainer = document.createElement('nav');
  navLinksContainer.className = 'nav-links-list';

  allLinks.forEach((linkElement) => {
    // On crée notre bouton de navigation
    const navItem = document.createElement('a');
    navItem.className = 'nav-item-link';
    
    // TRÈS IMPORTANT : On copie l'URL EXACTE générée par AEM (Adieu la 404 !)
    navItem.href = linkElement.href;
    
    // On cherche le texte explicatif dans la cellule (ex: "Edit Christophe - DA")
    let parentCell = linkElement.closest('div');
    let cleanText = parentCell ? parentCell.textContent.trim() : linkElement.textContent.trim();

    // Si le texte est une URL brute, on prend le texte du lien
    if (cleanText.includes('http') || cleanText.length > 60) {
      cleanText = linkElement.textContent.trim();
    }

    // --- NETTOYAGE CHIRURGICAL DU TEXTE ---
    if (cleanText.toLowerCase().includes('edit') || cleanText.toLowerCase().includes('- da')) {
      cleanText = cleanText
        .replace(/edit/gi, '')
        .replace(/-\s*da/gi, '')
        .trim();
    }

    // Si c'est l'accueil ou le pendu, on garde son nom propre
    if (!cleanText) {
      cleanText = linkElement.textContent.trim();
    }

    // Première lettre en majuscule
    navItem.textContent = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
    navLinksContainer.appendChild(navItem);
  });

  // On remplace le tableau moche par notre barre blanche
  block.innerHTML = '';
  block.append(navLinksContainer);

  // On pousse la barre au sommet de la page
  const mainLayout = document.querySelector('body');
  if (mainLayout) {
    const wrapper = block.closest('.navigation-wrapper') || block;
    if (mainLayout.firstChild !== wrapper) {
      mainLayout.insertBefore(wrapper, mainLayout.firstChild);
    }
  }
}
