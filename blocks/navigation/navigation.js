export default function decorate(block) {
  block.classList.add('global-nav-bar');

  // Configuration manuelle et sécurisée de tes liens (Zéro dépendance au chargement d'AEM)
  const menuItems = [
    { text: 'Accueil', url: '/' }, // Remplace par ton URL d'accueil si besoin
    { text: 'Pendu', url: '/pendu' }, // Remplace par l'URL de ton jeu du pendu
    { text: 'Christophe', url: '/edit-christophe-da' },
    { text: 'Duy', url: '/edit-duy-da' },
    { text: 'Martin', url: '/edit-martin-da' },
    { text: 'Quentin', url: '/edit-quentin-da' },
    { text: 'Vincent', url: '/edit-vincent-da' }
  ];

  const navLinksContainer = document.createElement('nav');
  navLinksContainer.className = 'nav-links-list';

  // Génération immédiate des boutons de navigation
  menuItems.forEach((item) => {
    const navItem = document.createElement('a');
    navItem.className = 'nav-item-link';
    navItem.href = item.url;
    navItem.textContent = item.text;
    navLinksContainer.appendChild(navItem);
  });

  // Nettoyage et injection forcée
  block.innerHTML = '';
  block.append(navLinksContainer);

  // Déplacement tout en haut du body pour éviter les conflits de blocs
  const mainLayout = document.querySelector('body');
  if (mainLayout) {
    const wrapper = block.closest('.navigation-wrapper') || block;
    if (mainLayout.firstChild !== wrapper) {
      mainLayout.insertBefore(wrapper, mainLayout.firstChild);
    }
  }
}
