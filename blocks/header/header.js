export default async function decorate(block) {
  console.log("=== Activation du Header ===");
  
  const mainUl = block.querySelector('ul');
  if (!mainUl) {
    console.warn("Crée une liste à puces dans ton tableau pour activer le menu !");
    return;
  }

  mainUl.classList.add('nav-menu');

  const lis = mainUl.querySelectorAll(':scope > li');
  lis.forEach((li) => {
    const subUl = li.querySelector('ul');
    const link = li.querySelector('a');

    if (subUl || !link) {
      li.classList.add('nav-item', 'dropdown');
      if (subUl) subUl.classList.add('dropdown-menu');

      const firstChild = li.firstChild;
      if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.classList.add('dropdown-toggle');
        span.style.cursor = 'pointer';
        span.textContent = firstChild.textContent.trim() + " ▼";
        li.insertBefore(span, firstChild);
        firstChild.remove();
      }

      // Écouteur de clic pour ouvrir/fermer
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        // Ferme les autres menus ouverts
        block.querySelectorAll('.dropdown.is-open').forEach((d) => {
          if (d !== li) d.classList.remove('is-open');
        });
        li.classList.toggle('is-open');
      });
    } else {
      li.classList.add('nav-item');
    }
  });

  document.addEventListener('click', () => {
    block.querySelectorAll('.dropdown.is-open').forEach((d) => d.classList.remove('is-open'));
  });
}
