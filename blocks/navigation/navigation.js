document.addEventListener("DOMContentLoaded", function() {
    
    // On ajoute l'ID unique "eva-projet-nav" pour isoler notre menu
    const menuHTML = `
        <nav id="eva-projet-nav" class="nav-container">
            <ul class="nav-menu">
                <li class="nav-item">
                    <a class="nav-link" href="#">Accueil</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Partie 1 ▾</a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Sous-partie 1.1</a></li>
                        <li><a href="#">Sous-partie 1.2</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Partie 2 ▾</a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Sous-partie 2.1</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contact</a>
                </li>
            </ul>
        </nav>
    `;

    // Injection au tout début du site
    document.body.insertAdjacentHTML('afterbegin', menuHTML);
});
