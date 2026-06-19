export default async function decorate(block) {
  // 1. Trouver la liste principale générée par AEM
  const mainUl = block.querySelector('ul');
  if (!mainUl) return;

  // 2. Nettoyage du bloc
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
    document.body.style.paddingTop = '70px'; // Évite que la barre cache le texte
  }

  // 3. Création de la barre blanche horizontale
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

  // 4. Parcourir uniquement les éléments de premier niveau (Accueil, Jeux, Interviews)
  const topLevels = mainUl.querySelectorAll(':scope > li');
  
  topLevels.forEach((li) => {
    const itemDiv = document.createElement('div');
    itemDiv.style.position = 'relative';
    itemDiv.style.padding = '0 20px';
    itemDiv.style.display = 'inline-block';

    // Trouver le lien principal de cette puce (ex: le lien Accueil, ou le lien Jeux)
    const mainLink = li.querySelector(':scope > a') || li.querySelector('a');
    const subUl = li.querySelector('ul');

    if (!mainLink && !subUl) return; // Sécurité si puce vide

    // Si cette puce contient un sous-menu (ex: Jeux)
    if (subUl) {
      const trigger = document.createElement('span');
      trigger.style.cursor = 'pointer';
      trigger.style.color = '#222222';
      trigger.style.fontWeight = '600';
      trigger.style.fontSize = '16px';
      // On prend le texte du lien principal s'il existe, sinon le texte brut de la puce
      trigger.textContent = (mainLink ? mainLink.textContent.trim() : li.firstChild.textContent.trim()) + " ▼";
      itemDiv.appendChild(trigger);

      // Création du sous-menu déroulant (caché au départ)
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

      // Injecter les sous-liens (PlayStation, Xbox)
      subUl.querySelectorAll('a').forEach((subLink) => {
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

      // Clic pour ouvrir/fermer le menu
      itemDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownUl.style.display === 'block';
        navContainer.querySelectorAll('ul').forEach(ul => ul.style.display = 'none'); // Ferme les autres
        dropdownUl.style.display = isOpen ? 'none' : 'block';
      });

    } else if (mainLink) {
      // Si c'est un lien simple sans sous-menu (ex: Accueil, Interviews)
      const newMainLink = mainLink.cloneNode(true);
      newMainLink.style.color = '#222222';
      newMainLink.style.textDecoration = 'none';
      newMainLink.style.fontWeight = '600';
      newMainLink.style.fontSize = '16px';
      itemDiv.appendChild(newMainLink);
    }

    navContainer.appendChild(itemDiv);
  });

  // Fermer les sous-menus si on clique ailleurs sur la page
  document.addEventListener('click', () => {
    navContainer.querySelectorAll('ul').forEach(ul => ul.style.display = 'none');
  });

  block.appendChild(navContainer);
}
