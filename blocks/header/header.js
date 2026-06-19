export default async function decorate(block) {
  // On laisse le HTML brut du Drive intact pour que le CSS s'en occupe
}
  // Fix pour éviter que le contenu du site passe sous la barre fixe
  document.body.style.paddingTop = '70px';

  // 3. On traite chaque premier niveau (Accueil, Jeux, Interviews...)
  const mainItems = languagesList.querySelectorAll(':scope > li');
  
  mainItems.forEach((li) => {
    const itemContainer = document.createElement('div');
    itemContainer.style.position = 'relative';
    itemContainer.style.padding = '0 20px';
    
    // On cherche s'il y a un lien direct (comme Accueil) ou juste du texte (comme Jeux)
    const link = li.querySelector(':scope > a');
    const subList = li.querySelector('ul');

    if (subList) {
      // C'est un menu déroulant (ex: Jeux ou Interviews)
      const trigger = document.createElement('span');
      trigger.style.cursor = 'pointer';
      trigger.style.fontWeight = '600';
      trigger.style.color = '#222222';
      trigger.style.fontSize = '16px';
      trigger.textContent = (link ? link.textContent : li.firstChild.textContent.trim()) + ' ▼';
      itemContainer.appendChild(trigger);

      // On design le sous-menu caché
      subList.style.display = 'none';
      subList.style.position = 'absolute';
      subList.style.top = '100%';
      subList.style.left = '0';
      subList.style.backgroundColor = '#ffffff';
      subList.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      subList.style.border = '1px solid #e0e0e0';
      subList.style.listStyle = 'none';
      subList.style.padding = '10px 0';
      subList.style.margin = '10px 0 0 0';
      subList.style.minWidth = '200px';
      subList.style.borderRadius = '4px';

      // On applique des styles aux liens du sous-menu
      subList.querySelectorAll('a').forEach((subLink) => {
        subLink.style.color = '#444444';
        subLink.style.textDecoration = 'none';
        subLink.style.display = 'block';
        subLink.style.padding = '8px 20px';
        subLink.style.fontSize = '14px';
        
        // Effet de survol sur les sous-liens
        subLink.addEventListener('mouseenter', () => subLink.style.backgroundColor = '#f5f5f5');
        subLink.addEventListener('mouseleave', () => subLink.style.backgroundColor = 'transparent');
      });

      itemContainer.appendChild(subList);

      // Effet d'ouverture/fermeture au survol du bloc
      itemContainer.addEventListener('mouseenter', () => subList.style.display = 'block');
      itemContainer.addEventListener('mouseleave', () => subList.style.display = 'none');

    } else if (link) {
      // C'est un lien simple sans sous-menu (ex: Accueil)
      link.style.color = '#222222';
      link.style.textDecoration = 'none';
      link.style.fontWeight = '600';
      link.style.fontSize = '16px';
      itemContainer.appendChild(link.cloneNode(true));
    }

    nav.appendChild(itemContainer);
  });

  block.appendChild(nav);
}
