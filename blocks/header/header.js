export default async function decorate(block) {
  // 1. Récupération des données brutes avant nettoyage
  const rawLinks = [...block.querySelectorAll('a')];
  const rawLists = [...block.querySelectorAll('ul')];

  // Si AEM n'a rien renvoyé, on s'arrête
  if (rawLinks.length === 0) return;

  // 2. Nettoyage complet du bloc d'origine
  block.textContent = '';
  block.className = 'custom-header-block';

  // 3. Fixation de la barre tout en haut de la page
  const globalHeader = block.closest('header');
  if (globalHeader) {
    globalHeader.style.position = 'fixed';
    globalHeader.style.top = '0';
    globalHeader.style.left = '0';
    globalHeader.style.width = '100%';
    globalHeader.style.zIndex = '10000';
    globalHeader.style.backgroundColor = '#ffffff';
    globalHeader.style.borderBottom = '1px solid #e0e0e0';
    document.body.style.paddingTop = '70px'; // Évite que la barre cache le texte du site
  }

  // 4. Création de la barre blanche horizontale
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

  // 5. Reconstruction intelligente des éléments
  // On cherche d'abord s'il y a un sous-menu (une liste ul)
  let dropdownCreated = false;

  rawLinks.forEach((link) => {
    // Est-ce que ce lien est à l'intérieur d'un sous-menu ?
    const isSubLink = link.closest('ul ul') || (rawLists.length > 0 && rawLists[0].contains(link) && link.closest('li')?.querySelector('ul'));

    if (isSubLink) {
      // On gère les sous-liens via la création du dropdown général ci-dessous, on ignore ici
      return;
    }

    const itemDiv = document.createElement('div');
    itemDiv.style.position = 'relative';
    itemDiv.style.padding = '0 20px';
    itemDiv.style.display = 'inline-block';

    // AJUSTEMENT DE JEUX (Détection s'il a un sous-menu lié)
    const hasDropdown = link.closest('li')?.querySelector('ul');

    if (hasDropdown && !dropdownCreated) {
      dropdownCreated = true;
      
      const trigger = document.createElement('span');
      trigger.style.cursor = 'pointer';
      trigger.style.color = '#222222';
      trigger.style.fontWeight = '600';
      trigger.style.fontSize = '16px';
      trigger.textContent = link.textContent.trim() + " ▼"; // Utilise le vrai texte du lien !
      itemDiv.appendChild(trigger);

      // Création du menu déroulant
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

      // On y injecte ses sous-liens (ex: PlayStation, Xbox)
      hasDropdown.querySelectorAll('a').forEach((subLink) => {
        const subLi = document.createElement('li');
        subLi.style.padding = '8px 20px';
        const newSubLink = subLink.cloneNode(true);
        newSubLink.style.color = '#444444';
        newSubLink.style.textDecoration = 'none';
        newSubLink.style.fontSize = '14px';
        newSubLink.style.display = 'block';
        subLi.appendChild(newSubLink);
        dropdownUl.appendChild(subLi);
      });

      itemDiv.appendChild(dropdownUl);

      // Clic pour ouvrir/fermer
      itemDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownUl.style.display === 'block';
        navContainer.querySelectorAll('ul').forEach(ul => ul.style.display = 'none');
        dropdownUl.style.display = isOpen ? 'none' : 'block';
      });

    } else if (!hasDropdown) {
      // LIENS STANDARDS (Accueil, Interviews, etc.)
      const newMainLink = link.cloneNode(true);
      newMainLink.style.color = '#222222';
      newMainLink.style.textDecoration = 'none';
      newMainLink.style.fontWeight = '600';
      newMainLink.style.fontSize = '16px';
      itemDiv.appendChild(newMainLink);
    }

    navContainer.appendChild(itemDiv);
  });

  // Fermer les menus au clic n'importe où ailleurs sur la page
  document.addEventListener('click', () => {
    navContainer.querySelectorAll('ul').forEach(ul => ul.style.display = 'none');
  });

  block.appendChild(navContainer);
}
