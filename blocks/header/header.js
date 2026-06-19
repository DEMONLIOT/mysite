export default async function decorate(block) {
  const mainUl = block.querySelector('ul');
  if (!mainUl) return;

  // 1. Nettoyage et configuration de la barre globale tout en haut
  block.textContent = ''; 
  block.className = 'custom-header-block';

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

  // 2. Création du conteneur horizontal (Barre blanche)
  const navContainer = document.createElement('div');
  navContainer.style.display = 'flex';
  navContainer.style.flexDirection = 'row'; // Force l'alignement horizontal
  navContainer.style.alignItems = 'center';
  navContainer.style.margin = '0';
  navContainer.style.padding = '15px 30px';
  navContainer.style.backgroundColor = '#ffffff';
  navContainer.style.fontFamily = 'sans-serif';
  navContainer.style.width = '100%';
  navContainer.style.boxSizing = 'border-box';

  // 3. Reconstruction des éléments du menu
  const topLevels = mainUl.querySelectorAll(':scope > li');
  topLevels.forEach((li) => {
    const itemLi = document.createElement('div');
    itemLi.style.position = 'relative';
    itemLi.style.padding = '0 20px';
    itemLi.style.display = 'inline-block'; // Aligne les blocs les uns à côté des autres

    const subUl = li.querySelector('ul');
    const mainLink = li.querySelector('a');
    
    // On récupère le texte principal proprement
    let textContent = '';
    if (li.firstChild) {
      textContent = li.firstChild.nodeType === Node.TEXT_NODE ? li.firstChild.textContent.trim() : li.firstChild.textContent.trim();
    }

    // S'IL Y A UN SOUS-MENU (ex: Jeux)
    if (subUl) {
      const trigger = document.createElement('span');
      trigger.style.cursor = 'pointer';
      trigger.style.color = '#222222';
      trigger.style.fontWeight = '600';
      trigger.style.fontSize = '16px';
      trigger.textContent = (textContent || "Menu") + " ▼";
      itemLi.appendChild(trigger);

      // Création du sous-menu déroulant (caché)
      const dropdown = document.createElement('ul');
      dropdown.style.display = 'none';
      dropdown.style.position = 'absolute';
      dropdown.style.top = '100%';
      dropdown.style.left = '0';
      dropdown.style.backgroundColor = '#ffffff';
      dropdown.style.listStyle = 'none';
      dropdown.style.padding = '10px 0';
      dropdown.style.margin = '10px 0 0 0';
      dropdown.style.minWidth = '180px';
      dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      dropdown.style.border = '1px solid #e0e0e0';
      dropdown.style.zIndex = '10001';

      subUl.querySelectorAll('a').forEach((subLink) => {
        const subLi = document.createElement('li');
        subLi.style.padding = '8px 20px';
        const newSubLink = subLink.cloneNode(true);
        newSubLink.style.color = '#444444';
        newSubLink.style.textDecoration = 'none';
        newSubLink.style.fontSize = '14px';
        newSubLink.style.display = 'block';
        subLi.appendChild(newSubLink);
        dropdown.appendChild(subLi);
      });

      itemLi.appendChild(dropdown);

      // Clic pour ouvrir/fermer
      itemLi.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyOpen = dropdown.style.display === 'block';
        navContainer.querySelectorAll('ul').forEach(ul => ul.style.display = 'none'); // Ferme les autres
        dropdown.style.display = isCurrentlyOpen ? 'none' : 'block';
      });

    } else {
      // LIEN SIMPLE (ex: Accueil, Interviews)
      if (mainLink) {
        const newMainLink = mainLink.cloneNode(true);
        newMainLink.style.color = '#222222';
        newMainLink.style.textDecoration = 'none';
        newMainLink.style.fontWeight = '600';
        newMainLink.style.fontSize = '16px';
        itemLi.appendChild(newMainLink);
      } else if (textContent) {
        // Sécurité : si c'est juste du texte sans lien
        const spanText = document.createElement('span');
        spanText.style.color = '#222222';
        spanText.style.fontWeight = '600';
        spanText.style.fontSize = '16px';
        spanText.textContent = textContent;
        itemLi.appendChild(spanText);
      }
    }

    navContainer.appendChild(itemLi);
  });

  // Fermer au clic n'importe où ailleurs
  document.addEventListener('click', () => {
    navContainer.querySelectorAll('ul').forEach(ul => ul.style.display = 'none');
  });

  block.appendChild(navContainer);
}
