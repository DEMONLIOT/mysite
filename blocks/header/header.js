export default async function decorate(block) {
  // 1. On force TOUT le bloc du header à se mettre tout en haut en horizontal et blanc
  block.style.position = 'fixed';
  block.style.top = '0';
  block.style.left = '0';
  block.style.width = '100%';
  block.style.backgroundColor = '#ffffff';
  block.style.borderBottom = '1px solid #e0e0e0';
  block.style.zIndex = '10000';
  block.style.boxSizing = 'border-box';
  block.style.fontFamily = 'sans-serif';

  // On décale le contenu du site pour ne pas qu'il soit caché sous la barre
  document.body.style.paddingTop = '60px';

  const mainUl = block.querySelector('ul');
  if (!mainUl) return;

  // 2. Style de la liste principale (Horizontale)
  mainUl.style.display = 'flex';
  mainUl.style.flexDirection = 'row';
  mainUl.style.listStyle = 'none';
  mainUl.style.margin = '0';
  mainUl.style.padding = '15px 30px';
  mainUl.style.alignItems = 'center';

  const lis = mainUl.querySelectorAll(':scope > li');
  lis.forEach((li) => {
    li.style.position = 'relative';
    li.style.padding = '0 20px';

    const subUl = li.querySelector('ul');
    const link = li.querySelector('a');

    // Style des liens principaux
    if (link) {
      link.style.color = '#222222';
      link.style.textDecoration = 'none';
      link.style.fontWeight = '600';
    }

    // Si on a un sous-menu
    if (subUl) {
      // 3. ON CACHE LE SOUS-MENU PAR DÉFAUT
      subUl.style.display = 'none'; 
      subUl.style.position = 'absolute';
      subUl.style.top = '100%';
      subUl.style.left = '0';
      subUl.style.backgroundColor = '#ffffff';
      subUl.style.listStyle = 'none';
      subUl.style.padding = '10px 0';
      subUl.style.margin = '10px 0 0 0';
      subUl.style.minWidth = '180px';
      subUl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      subUl.style.border = '1px solid #e0e0e0';
      subUl.style.zIndex = '10001';

      // Style des liens dans le sous-menu
      subUl.querySelectorAll('a').forEach(subLink => {
        subLink.style.color = '#444444';
        subLink.style.textDecoration = 'none';
        subLink.style.fontSize = '14px';
        subLink.style.display = 'block';
        subLink.parentElement.style.padding = '8px 20px';
      });

      // Transformation du texte principal en bouton cliquable
      const firstChild = li.firstChild;
      if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.style.cursor = 'pointer';
        span.style.color = '#222222';
        span.style.fontWeight = '600';
        span.textContent = firstChild.textContent.trim() + " ▼";
        li.insertBefore(span, firstChild);
        firstChild.remove();
      }

      // 4. GESTION DU CLIC POUR AFFICHER / CACHER
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Est-ce qu'il est déjà ouvert ?
        const isOpen = subUl.style.display === 'block';
        
        // On ferme tous les sous-menus ouverts sur la page
        block.querySelectorAll('ul ul').forEach(ul => ul.style.display = 'none');
        
        // On bascule l'état de celui-ci
        subUl.style.display = isOpen ? 'none' : 'block';
      });
    }
  });

  // Si on clique n'importe où ailleurs, on ferme les sous-menus
  document.addEventListener('click', () => {
    block.querySelectorAll('ul ul').forEach(ul => ul.style.display = 'none');
  });
}
