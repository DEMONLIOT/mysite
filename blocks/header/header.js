export default async function decorate(block) {
  // 1. Récupérer tous les liens générés par AEM, peu importe où ils sont cachés
  const allLinks = [...block.querySelectorAll('a')];
  if (allLinks.length === 0) return;

  // 2. Nettoyage complet
  block.textContent = '';
  block.className = 'custom-header-block';

  // Fixation de la barre tout en haut
  const globalHeader = block.closest('header');
  if (globalHeader) {
    globalHeader.style.position = 'fixed';
    globalHeader.style.top = '0';
    globalHeader.style.left = '0';
    globalHeader.style.width = '100%';
    globalHeader.style.zIndex = '10000';
    globalHeader.style.backgroundColor = '#ffffff';
    globalHeader.style.borderBottom = '1px solid #e0e0e0';
    document.body.style.paddingTop = '70px';
  }

  // 3. Conteneur horizontal
  const navContainer = document.createElement('div');
  navContainer.style.display = 'flex';
  navContainer.style.flexDirection = 'row';
  navContainer.style.alignItems = 'center';
  navContainer.style.margin = '0';
  navContainer.style.padding = '15px 30px';
  navContainer.style.backgroundColor = '#ffffff';
  navContainer.style.fontFamily = 'sans-serif';
  navContainer.style.width = '100%';
  navContainer.style.boxSizing = 'border-box';

  // 4. Tri des liens
  // On sépare le sous-menu (PlayStation, Xbox, Clicker Game...) des boutons principaux
  const mainItems = [];
  const subItems = [];

  allLinks.forEach((link) => {
    // Si le lien est imbriqué profondément dans une sous-liste, c'est un sous-menu
    if (link.closest('ul ul') || link.parentElement.closest('ul ul')) {
      subItems.push(link);
    } else {
      mainItems.push(link);
    }
  });

  // Si AEM a tout aplati et mis dans une seule liste, on considère le 2ème et 3ème lien comme sous-menu
  if (subItems.length === 0 && allLinks.length > 2) {
    // Mode secours : On devine selon l'ordre classique (Accueil, Jeux -> Sous-menus -> Interviews)
    // On va plutôt créer le menu déroulant directement autour du mot clé "Jeux"
  }

  // 5. Reconstruction visuelle
  // On crée d'abord "Accueil"
  const accueilLink = allLinks.find(l => l.textContent.toLowerCase().includes('acc'));
  if (accueilLink) {
    createSimpleLink(accueilLink, navContainer);
  } else if (allLinks[0]) {
    createSimpleLink(allLinks[0], navContainer); // Par défaut le premier
  }

  // On crée le menu déroulant "Jeux"
  const dropdownDiv = document.createElement('div');
  dropdownDiv.style.position = 'relative';
  dropdownDiv.style.padding = '0 20px';
  dropdownDiv.style.display = 'inline-block';

  const trigger = document.createElement('span');
  trigger.style.cursor = 'pointer';
  trigger.style.color = '#222222';
  trigger.style.fontWeight = '600';
  trigger.style.fontSize = '16px';
  trigger.textContent = "Jeux ▼";
  dropdownDiv.appendChild(trigger);

  const dropdownUl = document.createElement('ul');
  dropdownUl.style.display = 'none';
  dropdownUl.style.position = 'absolute';
  dropdownUl.style.top = '100%';
  dropdownUl.style.left = '0';
  dropdownUl.style.backgroundColor = '#ffffff';
  dropdownUl.style.listStyle = 'none';
  dropdownUl.style.padding = '10px 0';
  dropdownUl.style.margin = '10px 0 0 0';
  dropdownUl.style.minWidth = '180px';
  dropdownUl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  dropdownUl.style.border = '1px solid #e0e0e0';
  dropdownUl.style.zIndex = '10001';

  // On remplit le sous-menu avec tous les liens qui ne sont ni l'accueil, ni les interviews
  allLinks.forEach((link) => {
    const text = link.textContent.toLowerCase();
    if (!text.includes('acc') && !text.includes('interview') && !text.includes('jeux')) {
      const subLi = document.createElement('li');
      subLi.style.padding = '8px 20px';
      const newSubLink = link.cloneNode(true);
      newSubLink.style.color = '#444444';
      newSubLink.style.textDecoration = 'none';
      newSubLink.style.fontSize = '14px';
      newSubLink.style.display = 'block';
      subLi.appendChild(newSubLink);
      dropdownUl.appendChild(subLi);
    }
  });

  dropdownDiv.appendChild(dropdownUl);
  
  // Clic sur Jeux
  dropdownDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownUl.style.display === 'block';
    dropdownUl.style.display = isOpen ? 'none' : 'block';
  });
  
  navContainer.appendChild(dropdownDiv);

  // On crée "Interviews" tout à la droite
  const interviewLink = allLinks.find(l => l.textContent.toLowerCase().includes('inter'));
  if (interviewLink) {
    createSimpleLink(interviewLink, navContainer);
  }

  // Fonction outil pour générer un lien propre
  function createSimpleLink(linkElement, container) {
    const itemDiv = document.createElement('div');
    itemDiv.style.padding = '0 20px';
    itemDiv.style.display = 'inline-block';
    const newLink = linkElement.cloneNode(true);
    newLink.style.color = '#222222';
    newLink.style.textDecoration = 'none';
    newLink.style.fontWeight = '600';
    newLink.style.fontSize = '16px';
    itemDiv.appendChild(newLink);
    container.appendChild(itemDiv);
  }

  // Fermer au clic extérieur
  document.addEventListener('click', () => {
    dropdownUl.style.display = 'none';
  });

  block.appendChild(navContainer);
}
