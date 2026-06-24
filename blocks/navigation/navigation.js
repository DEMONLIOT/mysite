document.addEventListener("DOMContentLoaded", function() {
  
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

  // Injection forcée au tout début de la page
  document.body.insertAdjacentHTML('afterbegin', htmlNavigation);

  // SÉCURITÉ JAVASCRIPT : Gestion manuelle du menu déroulant si le CSS est bloqué par AEM
  const items = document.querySelectorAll('.nav-item');
  
  items.forEach(function(item) {
    const dropdown = item.querySelector('.dropdown-menu');
    if (dropdown) {
      // Quand la souris entre sur la partie principale
      item.addEventListener('mouseenter', function() {
        dropdown.style.setProperty('display', 'block', 'important');
      });
      // Quand la souris quitte
      item.addEventListener('mouseleave', function() {
        dropdown.style.setProperty('display', 'none', 'important');
      });
    }
  });
});
