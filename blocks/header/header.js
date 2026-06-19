export default async function decorate(block) {
  // 1. On récupère tous les liens du tableau
  const allLinks = [...block.querySelectorAll('a')];
  if (allLinks.length === 0) return;

  // 2. Nettoyage complet du bloc
  block.textContent = '';
  block.className = 'custom-header-block';

  // Fixation de la barre blanche tout en haut
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

  // 4. Identification des liens du sous-menu de Jeux
  // Tes sous-liens (PlayStation, Xbox, Clicker...) sont les seuls qui sont VRAIMENT dans une sous-liste HTML <ul>
  const subLinks = [];
  const mainLinks = [];

  allLinks.forEach((link) => {
    // Si le lien est dans une liste imbriquée, c'est un enfant de Jeux
    if (link.closest('ul ul') || link.parentElement.closest('ul ul')) {
      subLinks.push(link);
    } else {
      mainLinks.push(link);
    }
  });

  // Sécurité : Si AEM a aplati la structure et n'a pas créé de sous-liste <ul>,
  // on sait que l'Accueil est le 1er (index 0), les sous-jeux sont au milieu, et Interviews/le reste sont à la fin.
  const hasRealTree = subLinks.length > 0;

  // 5. Reconstruction de la barre d'onglets
  
  // Onglet 1 : L'Accueil (et tout ce qui est avant Jeux)
  mainLinks.forEach((link) => {
    const text = link.textContent.toLowerCase();
    
    // Si on rencontre un lien qui s'appelle "jeux", on s'arrête pour insérer le vrai menu déroulant
    if (text.includes('jeux')) return;
    
    // Si la structure était aplatie, on ne garde ici que ce qui est avant le bloc Jeux (généralement juste Accueil)
    if (!hasRealTree && mainLinks.indexOf(link) > 0 && mainLinks.indexOf(link) < mainLinks.length - 1) {
      return; // On saute les sous-parties pour l'instant
    }

    // On crée l'onglet normal
    if (text.includes('acc') || mainLinks.indexOf(link) === 0 || (!hasRealTree && mainLinks.indexOf(link) === mainLinks.length - 1 && text.includes('inter'))) {
      if (!text.includes('inter')) {
        createSimpleLink(link, navContainer);
      }
    }
  });

  // Onglet 2 : Le bouton déroulant JEUX
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

  // Remplissage du sous-menu de Jeux uniquement
  if (hasRealTree) {
    subLinks.forEach((link) => {
      addLinkToDropdown(link, dropdownUl);
    });
  } else {
    // Si structure plate, les enfants sont tout ce qui est entre le 1er (Accueil) et le dernier (Interviews)
    for (let i = 1; i < allLinks.length - 1; i++) {
      addLinkToDropdown(allLinks[i], dropdownUl);
    }
  }

  dropdownDiv.appendChild(dropdownUl);
  
  // Gestion du Clic sur Jeux
  dropdownDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownUl.style.display === 'block';
    dropdownUl.style.display = isOpen ? 'none' : 'block';
  });
  
  navContainer.appendChild(dropdownDiv);

  // Onglet 3 : Les autres catégories (Interviews, etc. qui sont placés après Jeux)
  mainLinks.forEach((link) => {
    const text = link.textContent.toLowerCase();
    if (text.includes('inter') || (!text.includes('acc') && !text.includes('jeux') && mainLinks.indexOf(link) > 0)) {
      createSimpleLink(link, navContainer);
    }
  });

  // Fonctions outils de création d'éléments HTML
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

  function addLinkToDropdown(linkElement, dropdown) {
    const subLi = document.createElement('li');
    subLi.style.padding = '8px 20px';
    const newSubLink = linkElement.cloneNode(true);
    newSubLink.style.color = '#444444';
    newSubLink.style.textDecoration = 'none';
    newSubLink.style.fontSize = '14px';
    newSubLink.style.display = 'block';
    subLi.appendChild(newSubLink);
    dropdown.appendChild(subLi);
  }

  // Fermer le menu si on clique à côté
  document.addEventListener('click', () => {
    dropdownUl.style.display = 'none';
  });

  block.appendChild(navContainer);
}
