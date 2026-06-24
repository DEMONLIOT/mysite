setTimeout(function() {
  // Sécurité pour ne pas l'injecter deux fois
  if (document.querySelector('.super-nav-barre')) return;

  const htmlNav = `
    <nav class="super-nav-barre">
      <ul class="super-nav-liste">
        <li class="super-nav-item">
          <a class="super-nav-lien" href="#">Accueil</a>
        </li>
        <li class="super-nav-item">
          <a class="super-nav-lien" href="#">Partie 1 ▾</a>
          <ul class="super-nav-deroulant">
            <li><a class="super-nav-souslien" href="#">Sous-partie 1.1</a></li>
            <li><a class="super-nav-souslien" href="#">Sous-partie 1.2</a></li>
            <li><a class="super-nav-souslien" href="#">Sous-partie 1.3</a></li>
          </ul>
        </li>
        <li class="super-nav-item">
          <a class="super-nav-lien" href="#">Partie 2 ▾</a>
          <ul class="super-nav-deroulant">
            <li><a class="super-nav-souslien" href="#">Sous-partie 2.1</a></li>
            <li><a class="super-nav-souslien" href="#">Sous-partie 2.2</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="super-nav-lien" href="#">Contact</a>
        </li>
      </ul>
    </nav>
  `;

  // Injection impérative tout en haut du site
  document.body.insertAdjacentHTML('afterbegin', htmlNav);
}, 0);
