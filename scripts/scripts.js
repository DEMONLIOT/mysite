/* ==========================================================================
   INJECTION ABSOLUE : HTML + CSS EMBARQUÉ (BARRE HORIZONTALE UNIVERSELLE)
   ========================================================================== */
(async function forcePerfectHeader() {
  try {
    // 1. URL absolue de ta navigation brute
    const projectUrl = 'https://main--mysite--demonliot.hlx.page/nav.plain.html';
    
    const response = await fetch(projectUrl);
    if (!response.ok) return;
    const html = await response.text();

    const inject = () => {
      // 2. Injection des styles CSS directement dans la page pour éviter les 404 d'AEM
      if (!document.getElementById('forced-header-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'forced-header-styles';
        styleTag.textContent = `
          .header-wrapper {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background-color: #ffffff !important;
            z-index: 10000 !important;
            border-bottom: 1px solid #e0e0e0 !important;
            box-sizing: border-box !important;
          }
          body { padding-top: 80px !important; }
          .header-wrapper .header.block,
          .header-wrapper .header.block > div,
          .header-wrapper .header.block > div > div {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            align-items: center !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          .header-wrapper .header.block > div > div { padding: 0 30px !important; }
          .header-wrapper .header.block > div > div > ul {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            margin: 0 !important;
            padding: 0 !important;
            list-style: none !important;
          }
          .header-wrapper .header.block > div > div > ul > li {
            position: relative !important;
            display: inline-block !important;
            padding: 20px 25px !important;
            margin: 0 !important;
            font-family: sans-serif !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            color: #222222 !important;
            cursor: pointer !important;
            white-space: nowrap !important;
          }
          .header-wrapper .header.block > div > div > ul > li a {
            color: #222222 !important;
            text-decoration: none !important;
          }
          .header-wrapper .header.block > div > div > ul > li:has(ul)::after {
            content: " ▼" !important;
            font-size: 10px !important;
            color: #888888 !important;
          }
          .header-wrapper .header.block > div > div > ul > li ul {
            display: none !important;
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            flex-direction: column !important;
            background-color: #ffffff !important;
            border: 1px solid #e0e0e0 !important;
            box-shadow: 0 6px 15px rgba(0,0,0,0.15) !important;
            padding: 10px 0 !important;
            margin: 0 !important;
            min-width: 220px !important;
            border-radius: 4px !important;
            z-index: 10005 !important;
            list-style: none !important;
          }
          .header-wrapper .header.block > div > div > ul > li ul li {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            font-weight: normal !important;
          }
          .header-wrapper .header.block > div > div > ul > li ul li::after { content: "" !important; }
          .header-wrapper .header.block > div > div > ul > li ul li a {
            display: block !important;
            padding: 8px 20px !important;
            color: #444444 !important;
            text-decoration: none !important;
            font-size: 14px !important;
            text-align: left !important;
          }
          .header-wrapper .header.block > div > div > ul > li:hover ul { display: flex !important; }
          .header-wrapper .header.block > div > div > ul > li ul li:hover { background-color: #f5f5f5 !important; }
        `;
        document.head.appendChild(styleTag);
      }

      // 3. Injection du HTML
      let header = document.querySelector('header');
      if (!header) {
        header = document.createElement('header');
        document.body.insertBefore(header, document.body.firstChild);
      }
      
      header.innerHTML = `
        <div class="header-wrapper">
          <div class="header block">
            <div>
              <div>${html}</div>
            </div>
          </div>
        </div>
      `;
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      inject();
    }
  } catch (e) {
    console.error('Erreur script injection header global:', e);
  }
})();

/* ==========================================================================
   RESTE DE TON FICHIER SCRIPTS.JS INTEGRAL (LAISSE LA SUITE DU CODE INTACTE)
   ========================================================================== */
import {
  loadHeader,
...
import {
  loadHeader,
  loadFooter,
...
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

    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) {
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

export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

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
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * INJECTION AUTONOME DU HEADER SUR TOUTES LES PAGES
 */
async function loadLazy(doc) {
  const headerElement = doc.querySelector('header');
  if (headerElement) {
    try {
      // 1. Charger de force le CSS
      await loadCSS(`${window.hlx.codeBasePath}/blocks/header/header.css`);

      // 2. Fetch direct de la navigation absolue sans passer par AEM
      const projectUrl = 'https://main--mysite--demonliot.hlx.page/nav.plain.html';
      const response = await fetch(projectUrl);
      
      if (response.ok) {
        const html = await response.text();
        
        // 3. On injecte la structure brute attendue par le CSS
        headerElement.innerHTML = `
          <div class="header-wrapper">
            <div class="header block">
              <div>
                <div>${html}</div>
              </div>
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error('Échec de l injection autonome du menu :', error);
    }
  }

  // Charger le contenu de la page
  const main = doc.querySelector('main');
  if (main) {
    await loadSections(main);
  }

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  // Charger le Footer
  const footerElement = doc.querySelector('footer');
  if (footerElement) {
    await loadFooter(footerElement);
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
