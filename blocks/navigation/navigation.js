export default function decorate(block) {
  block.classList.add('navigation-container');

  // On récupère toutes les lignes du tableau du document
  const rows = Array.from(block.children);
  
  // On crée un conteneur de grille pour les cartes
  const gridContainer = document.createElement('div');
  gridContainer.className = 'navigation-grid';

  rows.forEach((row) => {
    // Dans AEM, chaque ligne a généralement deux colonnes (Texte/Image et le Lien)
    const columns = Array.from(row.children);
    if (columns.length === 0) return;

    // Extraction du contenu
    const contentArea = columns[0];
    const linkElement = row.querySelector('a');

    // On crée la carte de navigation
    const card = document.createElement('div');
    card.className = 'navigation-card';

    // S'il y a un lien, on rend toute la carte cliquable
    if (linkElement) {
      const targetUrl = linkElement.href;
      card.addEventListener('click', () => {
        window.location.href = targetUrl;
      });
      card.style.cursor = 'pointer';
    }

    // On déplace le texte et les images à l'intérieur de la carte
    // (en enlevant le lien brut pour éviter les doublons de clics)
    if (linkElement) linkElement.remove();
    card.innerHTML = contentArea.innerHTML;

    // Si la carte contient une image, on lui ajoute une classe pour le style
    if (card.querySelector('img')) {
      card.classList.add('has-image');
    }

    gridContainer.appendChild(card);
  });

  // On vide le bloc initial et on y injecte notre belle grille
  block.innerHTML = '';
  block.append(gridContainer);
}
