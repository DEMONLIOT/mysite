import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
} from './aem.js';

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const headerElement = doc.querySelector('header');
  if (headerElement) {
    await loadHeader(headerElement);
    
    const headerBlock = headerElement.querySelector('.header');
    if (headerBlock) {
      // Extraction large de tous les liens pour parer à la structure d'AEM
      const allLinks = [...headerBlock.querySelectorAll('a')];
      
      if (allLinks.length > 0) {
        headerBlock.textContent = '';
        
        // Fixer le style de la barre principale en haut
        headerBlock.style.position = 'fixed';
        headerBlock.style.top = '0';
        headerBlock.style.left = '0';
        headerBlock.style.width = '100%';
        headerBlock.style.zIndex = '10000';
        headerBlock.style.backgroundColor = '#ffffff';
        headerBlock.style.borderBottom = '1px solid #e0e0e0';
        document.body.style.paddingTop = '70px';

        const navContainer = document.createElement('div');
        navContainer.style.display = 'flex';
        navContainer.style.flexDirection = 'row';
        navContainer.style.alignItems = 'center';
        navContainer.style.padding = '15px 30px';
        navContainer.style.fontFamily = 'sans-serif';

        // Tableaux de dispatching basés exactement sur TES images
        const menuStructure = {
          accueil: null,
          jeux: [],
          interviews: [],
          adobe: [],
          decouvertes: []
        };

        allLinks.forEach((link) => {
          const text = link.textContent.toLowerCase().trim();
          const href = link.getAttribute('href') || '';

          if (text === 'accueil' || text === 'home') {
            menuStructure.accueil = link;
          } else if (text.includes('clicker') || text.includes('pendu') || text.includes('blague')) {
            menuStructure.jeux.push(link);
          } else if (['alexandre', 'christophe', 'duy', 'martin', 'quentin', 'vincent', 'alvaro'].some(name => text.includes(name))) {
            menuStructure.interviews.push(link);
          } else if (text.includes('basel') || (text === 'adobe' && href.includes('adobe')) || text.includes('manager')) {
            menuStructure.adobe.push(link);
          } else if (/^j[1-5]$/.test(text)) {
            menuStructure.decouvertes.push(link);
          }
        });

        // 1. Injection Accueil
        if (menuStructure.accueil) {
          createMainLink(menuStructure.accueil, navContainer);
        } else {
          // Fallback au cas où Accueil n'a pas de lien dans le doc
          const accBtn = document.createElement('a');
          accBtn.href = '/';
          accBtn.textContent = 'Accueil';
          createMainLink(accBtn, navContainer);
        }

        // 2. Injection des Dropdowns
        createDropdown('Jeux', menuStructure.jeux, navContainer);
        createDropdown('Interviews', menuStructure.interviews, navContainer);
        createDropdown('Adobe', menuStructure.adobe, navContainer);
        createDropdown('Découvertes', menuStructure.decouvertes, navContainer);

        headerBlock.appendChild(navContainer);
      }
    }
  }

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));
  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

// Fonction outil pour créer un bouton principal simple
function createMainLink(el, container) {
  const d = document.createElement('div');
  d.style.padding = '0 20px';
  const n = el.cloneNode(true);
  n.style.color = '#222222';
  n.style.textDecoration = 'none';
  n.style.fontWeight = '600';
  n.style.fontSize = '16px';
  d.appendChild(n);
  container.appendChild(d);
}

// Fonction outil pour générer un menu déroulant complet
function createDropdown(title, linksArray, container) {
  if (linksArray.length === 0) return;

  const dropdownDiv = document.createElement('div');
  dropdownDiv.style.position = 'relative';
  dropdownDiv.style.padding = '0 20px';
  dropdownDiv.style.display = 'inline-block';

  const trigger = document.createElement('span');
  trigger.style.cursor = 'pointer';
  trigger.style.color = '#222222';
  trigger.style.fontWeight = '600';
  trigger.style.fontSize = '16px';
  trigger.textContent = `${title} ▼`;
  dropdownDiv.appendChild(trigger);

  const dropdownUl = document.createElement('ul');
  dropdownUl.style.display = 'none';
  dropdownUl.style.position = 'absolute';
  dropdownUl.style.top = '100%';
  dropdownUl.style.left = '0';
  dropdownUl.style.backgroundColor = '#ffffff';
  dropdownUl.style.listStyle = 'none';
  dropdownUl.style.padding = '10px 0';
  dropdownUl.style.margin = '10px 0 0 0';
  dropdownUl.style.minWidth = '200px';
  dropdownUl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  dropdownUl.style.border = '1px solid #e0e0e0';
  dropdownUl.style.zIndex = '10001';

  linksArray.forEach((link) => {
    const subLi = document.createElement('li');
    subLi.style.padding = '8px 20px';
    const newSubLink = link.cloneNode(true);
    newSubLink.style.color = '#444444';
    newSubLink.style.textDecoration = 'none';
    newSubLink.style.fontSize = '14px';
    newSubLink.style.display = 'block';
    subLi.appendChild(newSubLink);
    dropdownUl.appendChild(subLi);
  });

  dropdownDiv.appendChild(dropdownUl);

  // Événements d'affichage au survol pour plus de fluidité
  dropdownDiv.addEventListener('mouseenter', () => { dropdownUl.style.display = 'block'; });
  dropdownDiv.addEventListener('mouseleave', () => { dropdownUl.style.display = 'none'; });

  container.appendChild(dropdownDiv);
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
