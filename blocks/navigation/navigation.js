(function() {
  function initNavigation() {
    // Éviter les doublons si le script se charge deux fois dans AEM
    if (document.querySelector('.nav-container')) return;

    const htmlNavigation = `
      <nav class="nav-container">
        <ul class="nav-menu">
          <li class="nav-item">
            <a class="nav-link" href="#">Accueil</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Partie 1 ▾</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-link" href="#">Sous-partie 1.1</a></li>
              <li><a class="dropdown-link" href="#">Sous-partie 1.2</a></li>
              <li><a class="dropdown-link" href="#">Sous-partie 1.3</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Partie 2 ▾</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-link" href="#">Sous-partie 2.1</a></li>
              <li><a class="dropdown-link" href="#">Sous-partie 2.2</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact</a>
          </li>
        </ul>
      </nav>
    `;

    // Injection directe au tout début du body de manière impérative
    document.body.insertAdjacentHTML('afterbegin', htmlNavigation);

    // Béquille JS ultra-forcée pour le menu déroulant
    const items = document.querySelectorAll('.nav-item');
    items.forEach(function(item) {
      const dropdown = item.querySelector('.dropdown-menu');
      if (dropdown) {
        item.addEventListener('mouseenter', function() {
          dropdown.style.setProperty('display', 'block', 'important');
        });
        item.addEventListener('mouseleave', function() {
          dropdown.style.setProperty('display', 'none', 'important');
        });
      }
    });
  }

  // Sécurité pour s'assurer que le DOM est prêt dans AEM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }
})();
