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
    // 1. On charge d'abord le bloc via AEM natif pour récupérer le contenu HTML du Drive
    await loadHeader(headerElement);
    
    // 2. On intercepte TOUT de suite pour appliquer notre tri sans attendre le cache de header.js
    const headerBlock = headerElement.querySelector('.header');
    if (headerBlock) {
      const allLinks = [...headerBlock.querySelectorAll('a')];
      if (allLinks.length > 0) {
        // Nettoyage visuel de la boîte
        headerBlock.textContent = '';
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

        const accueilLinks = [];
        const jeuxDropdownLinks = [];
        const otherMainLinks = [];

        allLinks.forEach((link) => {
          const text = link.textContent.toLowerCase().trim();
          if (text.includes('acc') || text === 'home') {
            accueilLinks.push(link);
          } else if (
            text.includes('playstation') || text.includes('xbox') || 
            text.includes('nintendo') || text.includes('switch') || 
            text.includes('clicker') || text.includes('game') || 
            link.closest('ul ul')
          ) {
            jeuxDropdownLinks.push(link);
          } else if (!text.includes('jeux')) {
            otherMainLinks.push(link);
          }
        });

        // A. Injecter Accueil
        if (accueilLinks.length > 0) {
          createLink(accueilLinks[0], navContainer);
        } else if (allLinks[0] && !allLinks[0].textContent.toLowerCase().includes('jeux')) {
          createLink(allLinks[0], navContainer);
        }

        // B. Injecter le Dropdown Jeux
        const dropdownDiv = document.createElement('div');
        dropdownDiv.style.position = 'relative';
        dropdownDiv.style.padding = '0 20px';
        dropdownDiv.style.display = 'inline-block';

        const trigger = document.createElement('span');
        trigger.style.cursor = 'pointer';
        trigger.style.color = '#222222';
        trigger.style.fontWeight = '600';
        trigger.style.fontSize = '16px';
        trigger.textContent = "Jeux ▼";
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
        dropdownUl.style.minWidth = '180px';
        dropdownUl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        dropdownUl.style.border = '1px solid #e0e0e0';
        dropdownUl.style.zIndex = '10001';

        jeuxDropdownLinks.forEach((link) => {
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
        dropdownDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = dropdownUl.style.display === 'block';
          dropdownUl.style.display = isOpen ? 'none' : 'block';
        });
        navContainer.appendChild(dropdownDiv);

        // C. Injecter Interviews et le reste
        otherMainLinks.forEach((link) => {
          createLink(link, navContainer);
        });

        document.addEventListener('click', () => { dropdownUl.style.display = 'none'; });
        headerBlock.appendChild(navContainer);

        function createLink(el, container) {
          const d = document.createElement('div');
          d.style.padding = '0 20px';
          d.style.display = 'inline-block';
          const n = el.cloneNode(true);
          n.style.color = '#222222';
          n.style.textDecoration = 'none';
          n.style.fontWeight = '600';
          n.style.fontSize = '16px';
          d.appendChild(n);
          container.appendChild(d);
        }
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
