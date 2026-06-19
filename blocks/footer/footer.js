export default async function decorate(block) {
  // On essaie de récupérer le footer, mais de manière sécurisée
  const footerMeta = document.querySelector('meta[name="footer"]');
  const footerPath = footerMeta ? footerMeta.content : '/footer';
  
  try {
    const resp = await fetch(`${footerPath}.plain.html`);
    if (resp.ok) {
      const html = await resp.text();
      const footer = document.createElement('div');
      footer.innerHTML = html;
      block.append(footer);
    } else {
      console.warn('Le fichier footer n\'a pas pu être chargé (404), mais on continue !');
      block.remove(); // On enlève le bloc vide pour ne pas faire planter la page
    }
  } catch (e) {
    console.error('Erreur lors du chargement du footer:', e);
    block.remove();
  }
}
