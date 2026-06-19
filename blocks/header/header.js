export default async function decorate(block) {
  // 1. Récupérer tous les liens du document nav
  const allLinks = [...block.querySelectorAll('a')];
  if (allLinks.length === 0) return;

  // 2. Nettoyage complet du bloc d'origine
  block.textContent = '';
  block.className = 'custom-header-block';

  // Fixation de la barre tout en haut de la page
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

  // 3. Création du conteneur de la barre horizontale
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

  // 4. Tri ultra-précis des liens par mots-clés pour éviter le mélange
  const accueilLinks = [];
  const jeuxDropdownLinks = [];
  const otherMainLinks = [];

  allLinks.forEach((link) => {
    const text = link.textContent.toLowerCase().trim();

    if (text.includes('acc') || text === 'home') {
      accueilLinks.push(link);
    } else if (
      text.includes('playstation') || 
      text.includes('xbox') || 
      text.includes('nintendo') || 
      text.includes('switch') || 
      text.includes('clicker') || 
      text.includes('game') ||
      link.closest('ul ul') // Sécurité si AEM a gardé une vraie sous-liste
    ) {
      jeuxDropdownLinks.push(link);
    } else if (!text.includes('jeux')) {
      // Tout le reste (Interviews, Actualités, Contact...) va sur la barre principale
      otherMainLinks.push(link);
    }
  });

  // 5. Reconstruction visuelle de la barre

  // Étape A : Afficher l'Accueil si trouvé (ou par défaut le tout premier lien)
  if (accueilLinks.length > 0) {
    createSimpleLink(accueilLinks[0], navContainer);
  } else if (allLinks[0] && !allLinks[0].textContent.toLowerCase().includes('jeux')) {
    createSimpleLink(allLinks[0], navContainer);
  }

  // Étape B : Créer le menu déroulant JEUX au milieu
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

  // On injecte uniquement les vrais sous-jeux ciblés dans le menu déroulant
  jeuxDropdownLinks.forEach((link) => {
    const subLi = document.createElement('li');
    subLi.style.padding = '8px 20px';
    const newSubLink = link.cloneNode(true);
    newSubLink.style.color = '#444444';
    newSubLink.style.textDecoration = 'none';
    newSubLink.style.fontSize = '14px';
    newSubLink.style.display = 'block';
    subLi.appendChild(newSubLink);
    dropdownUl.appendChild(subLi);
  });

  dropdownDiv.appendChild(dropdownUl);
  
  // Clic pour ouvrir/fermer le menu Jeux
  dropdownDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownUl.style.display === 'block';
    dropdownUl.style.display = isOpen ? 'none' : 'block';
  });
  
  navContainer.appendChild(dropdownDiv);

  // Étape C : Afficher les autres catégories (Interviews, etc.) à droite de Jeux
  otherMainLinks.forEach((link) => {
    createSimpleLink(link, navContainer);
  });

  // Fonction outil pour générer un lien horizontal propre
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

  // Fermer le sous-menu si on clique n'importe où ailleurs
  document.addEventListener('click', () => {
    dropdownUl.style.display = 'none';
  });

  block.appendChild(navContainer);
}
