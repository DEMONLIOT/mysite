export default async function decorate(block) {
  // 1. On cherche la liste de tes puces décalées
  let mainUl = block.querySelector('ul');

  // 2. Si AEM n'a pas créé de liste, on force la création d'un menu simple
  if (!mainUl) {
    mainUl = document.createElement('ul');
    const links = block.querySelectorAll('a');
    links.forEach((link) => {
      const li = document.createElement('li');
      li.appendChild(link.cloneNode(true));
      mainUl.appendChild(li);
    });
  }

  // 3. On applique notre style de base directement en restant simple
  mainUl.style.display = 'flex';
  mainUl.style.gap = '20px';
  mainUl.style.listStyle = 'none';
  mainUl.style.background = '#000';
  mainUl.style.padding = '15px';

  mainUl.querySelectorAll('a').forEach(a => a.style.color = '#fff');

  // 4. On affiche le résultat à l'écran
  block.textContent = '';
  block.appendChild(mainUl);
}
