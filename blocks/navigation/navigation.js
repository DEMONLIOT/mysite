document.addEventListener("DOMContentLoaded", function() {
  
  // Structure HTML de la barre de navigation
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

  // Injection automatique au tout début de la page (haut du body)
  document.body.insertAdjacentHTML('afterbegin', htmlNavigation);
});
