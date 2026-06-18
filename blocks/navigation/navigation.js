export default function decorate(block) {
  // On applique la classe globale pour la barre de navigation
  block.classList.add('global-nav-bar');

  const rows = Array.from(block.children);
  
  // Création du conteneur de liens horizontal
  const navLinksContainer = document.createElement('nav');
  navLinksContainer.className = 'nav-links-list';

  rows.forEach((row) => {
    const columns = Array.from(row.children);
    if (columns.length === 0) return;

    // On cherche le lien dans la ligne
    const linkElement = row.querySelector('a');
    if (!linkElement) return;

    // On crée un bouton de navigation épuré
    const navItem = document.createElement('a');
    navItem.className = 'nav-item-link';
    navItem.href = linkElement.href;
    
    // On récupère uniquement le texte du titre (ex: "Accueil" ou "Jeu du Pendu")
    // en enlevant les descriptions superflues pour que ça tienne dans une barre
    const titleElement = columns[0].querySelector('h1, h2, h3, h4, p, strong');
    navItem.textContent = titleElement ? titleElement.textContent.trim() : linkElement.textContent.trim();

    navLinksContainer.appendChild(navItem);
  });

  // On vide le bloc et on injecte la liste de liens
  block.innerHTML = '';
  block.append(navLinksContainer);

  // Sécurité AEM : On déplace physiquement le bloc tout en haut du <body> 
  // pour être sûr qu'il soit au-dessus de tout le reste de la page
  const mainLayout = document.querySelector('body');
  if (mainLayout && !document.querySelector('.global-nav-bar-wrapper')) {
    const wrapper = block.closest('.navigation-wrapper') || block;
    mainLayout.insertBefore(wrapper, mainLayout.firstChild);
  }
}
