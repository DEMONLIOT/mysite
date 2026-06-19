export default async function decorate(block) {
  console.log("=== Lancement du Header Nettoyeur ===");

  // 1. On cherche la liste de tes liens dans le bloc
  const links = block.querySelectorAll('a');
  const mainUl = block.querySelector('ul');
  
  // Si AEM n'a rien chargé du tout, on s'arrête
  if (!mainUl && links.length === 0) return;

  // 2. ON NETTOIE TOUT : On efface les styles bizarres d'AEM
  block.textContent = ''; 
  block.className = 'custom-header-block';

  // 3. On force le bloc parent à se mettre tout en haut horizontalement
  const navContainer = document.createElement('nav');
  navContainer.style.display = 'flex';
  navContainer.style.flexDirection = 'row';
  navContainer.style.alignItems = 'center';
  navContainer.style.justifyContent = 'flex-start';
  navContainer.style.listStyle = 'none';
  navContainer.style.margin = '0';
  navContainer.style.padding = '15px 30px';
  navContainer.style.backgroundColor = '#ffffff';
  navContainer.style.fontFamily = 'sans-serif';
  navContainer.style.width = '100%';
  navContainer.style.boxSizing = 'border-box';

  // On force l'enveloppe HTML d'AEM globale à se fixer tout en haut
  const globalHeader = block.closest('header');
  if (globalHeader) {
    globalHeader.style.position = 'fixed';
    globalHeader.style.top = '0';
    globalHeader.style.left = '0';
    globalHeader.style.width = '100%';
    globalHeader.style.zIndex = '10000';
    globalHeader.style.backgroundColor = '#ffffff';
    globalHeader.style.borderBottom = '1px solid #e0e0e0';
    document.body.style.paddingTop = '70px'; // Évite de cacher le texte du site
  }

  // 4. Reconstruction propre à partir de la liste d'origine
  if (mainUl) {
    const topLevels = mainUl.querySelectorAll(':scope > li');
    topLevels.forEach((li) => {
      const itemLi = document.createElement('div');
      itemLi.style.position = 'relative';
      itemLi.style.padding = '0 20px';

      const subUl = li.querySelector('ul');
      const mainLink = li.querySelector('a');
      const textNode = li.firstChild;

      // S'il y a un sous-menu (ex: Jeux)
      if (subUl) {
        const trigger = document.createElement('span');
        trigger.style.cursor = 'pointer';
        trigger.style.color = '#222222';
        trigger.style.fontWeight = '600';
        trigger.style.fontSize = '16px';
        trigger.textContent = textNode ? textNode.textContent.trim() + " ▼" : "Menu ▼";
        itemLi.appendChild(trigger);

        // Création du sous-menu caché
        const dropdown = document.createElement('ul');
        dropdown.style.display = 'none'; // CACHÉ PAR DÉFAUT
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
          navContainer.querySelectorAll('ul').forEach(ul => ul.style.display = 'none'); // Ferme tout
          dropdown.style.display = isCurrentlyOpen ? 'none' : 'block';
        });

      } else if (mainLink) {
        // Lien direct simple (ex: Accueil)
        const newMainLink = mainLink.cloneNode(true);
        newMainLink.style.color = '#222222';
        newMainLink.style.textDecoration = 'none';
        newMainLink.style.fontWeight = '600';
        newMainLink.style.fontSize = '16px';
        itemLi.appendChild(newMainLink);
      }

      navContainer.appendChild(itemLi);
    });
  }

  // On ferme les menus au clic extérieur
  document.addEventListener('click', () => {
    navContainer.querySelectorAll('ul').forEach(ul => ul.style.display = 'none');
  });

  block.appendChild(navContainer);
}
