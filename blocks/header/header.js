export default async function decorate(block) {
  console.log("=== Lancement du Header Sécurisé ===");

  // On essaie de récupérer la liste générée par AEM
  const mainUl = block.querySelector('ul');
  
  if (!mainUl) {
    console.warn("Pas de liste <ul> standard trouvée, bascule sur la méthode alternative...");
    // Méthode de secours si AEM utilise des paragraphes ou des divs
    const rows = block.querySelectorAll('div > div > *');
    if (!rows.length) return;
    
    const backupUl = document.createElement('ul');
    backupUl.classList.add('nav-menu');
    let currentUl = null;

    rows.forEach((el) => {
      const text = el.textContent.trim();
      if (!text) return;
      const link = el.querySelector('a');

      if (!link) {
        const li = document.createElement('li');
        li.classList.add('nav-item', 'dropdown');
        li.innerHTML = `<span class="dropdown-toggle" style="cursor:pointer; font-weight:bold;">${text} ▼</span>`;
        currentUl = document.createElement('ul');
        currentUl.classList.add('dropdown-menu');
        li.appendChild(currentUl);
        backupUl.appendChild(li);

        li.addEventListener('click', (e) => {
          e.stopPropagation();
          li.classList.toggle('is-open');
        });
      } else if (currentUl && !text.toLowerCase().includes('accueil')) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${link.href}">${text}</a>`;
        currentUl.appendChild(li);
      } else {
        const li = document.createElement('li');
        li.classList.add('nav-item');
        li.innerHTML = `<a href="${link.href}">${text}</a>`;
        backupUl.appendChild(li);
      }
    });

    block.textContent = '';
    block.appendChild(backupUl);
    return;
  }

  // SI LA LISTE UL EXISTE (Grâce à tes puces décalées)
  mainUl.classList.add('nav-menu');

  // On regarde tous les <li> du tableau
  const lis = mainUl.querySelectorAll('li');
  lis.forEach((li) => {
    const subUl = li.querySelector('ul');
    const link = li.querySelector('a');

    // Si le li contient une sous-liste (grâce à ton décalage) ou s'il n'a pas de lien direct
    if (subUl || !link) {
      li.classList.add('nav-item', 'dropdown');
      if (subUl) subUl.classList.add('dropdown-menu');

      // On isole le texte du titre (ex: Jeux) pour le rendre cliquable
      const firstChild = li.firstChild;
      if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.classList.add('dropdown-toggle');
        span.style.cursor = 'pointer';
        span.textContent = firstChild.textContent.trim() + " ▼";
        li.insertBefore(span, firstChild);
        firstChild.remove();
      }

      li.addEventListener('click', (e) => {
        e.stopPropagation();
        // Ferme les autres menus
        block.querySelectorAll('.dropdown.is-open').forEach((d) => {
          if (d !== li) d.classList.remove('is-open');
        });
        li.classList.toggle('is-open');
      });
    } else {
      li.classList.add('nav-item');
    }
  });

  // Fermer au clic n'importe où ailleurs
  document.addEventListener('click', () => {
    block.querySelectorAll('.dropdown.is-open').forEach((d) => d.classList.remove('is-open'));
  });

  console.log("=== Header configuré avec succès ===");
}
