export default function decorate(block) {
  block.classList.add('global-nav-bar');

  // Version simplifiée des liens (chemins en minuscules)
  const menuItems = [
    { text: 'Accueil', url: '/' },
    { text: 'Pendu', url: '/pendu' },
    { text: 'Christophe', url: '/edit-christophe-da' },
    { text: 'Duy', url: '/edit-duy-da' },
    { text: 'Martin', url: '/edit-martin-da' },
    { text: 'Quentin', url: '/edit-quentin-da' },
    { text: 'Vincent', url: '/edit-vincent-da' }
  ];

  const navLinksContainer = document.createElement('nav');
  navLinksContainer.className = 'nav-links-list';

  menuItems.forEach((item) => {
    const navItem = document.createElement('a');
    navItem.className = 'nav-item-link';
    
    // Si tu es en local (localhost) ou sur hlx.page, on s'assure que le lien reste sur le même domaine
    navItem.href = `${window.location.origin}${item.url}`;
    navItem.textContent = item.text;

    // Petite sécurité : si on clique et que ça fait une 404, on affiche l'URL exacte demandée dans la console pour déboguer
    navItem.addEventListener('click', (e) => {
      console.log(`Navigation vers : ${navItem.href}`);
    });

    navLinksContainer.appendChild(navItem);
  });

  block.innerHTML = '';
  block.append(navLinksContainer);

  const mainLayout = document.querySelector('body');
  if (mainLayout) {
    const wrapper = block.closest('.navigation-wrapper') || block;
    if (mainLayout.firstChild !== wrapper) {
      mainLayout.insertBefore(wrapper, mainLayout.firstChild);
    }
  }
}
