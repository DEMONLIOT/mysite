export default function decorate(block) {
  block.classList.add('global-nav-bar');

  // AJUSTE LES CHEMINS CI-DESSOUS AVEC LES VRAIES ADRESSES DE TON SITE AEM
  const menuItems = [
    { text: 'Accueil', url: '/' }, 
    { text: 'Pendu', url: '/pendu' }, // Remplace par le vrai chemin vers ta page pendu
    { text: 'Christophe', url: '/edit-christophe-da' }, // Exemple : si ta page est dans un sous-dossier, mets '/dossier/edit-christophe-da'
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
    navItem.href = item.url;
    navItem.textContent = item.text;
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
