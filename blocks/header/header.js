import { loadCSS } from '../../scripts/aem.js';

/**
 * Charge le menu global à partir du fichier HTML brut de ton projet
 * @param {Element} block Le conteneur du bloc header
 */
export default async function decorate(block) {
  // 1. On force le chargement du fichier CSS du header
  await loadCSS(`${window.hlx.codeBasePath}/blocks/header/header.css`);

  // 2. On va chercher le fichier de navigation généré par AEM
  try {
    // RECOPIE BIEN TON URL DE SIDEKICK ICI (ex: main--mon-site--mon-orga.hlx.page)
    const projectUrl = 'https://main--mysite--demonliot.hlx.page/nav.plain.html';
    
    const response = await fetch(projectUrl);
    if (response.ok) {
      const html = await response.text();
      
      // On crée la structure de conteneurs nécessaire
      const navContainer = document.createElement('div');
      navContainer.className = 'header block';
      navContainer.innerHTML = `<div><div>${html}</div></div>`;
      
      // On vide l'ancien contenu et on injecte le nouveau HTML propre
      block.textContent = '';
      block.appendChild(navContainer);
    } else {
      console.error('Erreur de chargement du fichier nav.plain.html');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la récupération de la navigation :', error);
  }
}
