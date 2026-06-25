import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './aem.js';

const LCP_BLOCKS = [];

function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function decoratePageVolume(main) {
  const headings = main.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const paragraphCount = main.querySelectorAll('p').length;
  if (headings.length > 5 || paragraphCount > 20) {
    document.body.classList.add('long-form');
  }
}

function decorateParagraphs(main) {
  main.querySelectorAll('p').forEach((p) => {
    if (p.textContent.trim() === '' && !p.children.length) {
      p.remove();
    }
  });
}

function buildHeroBlock(main) {
  const firstSection = main.querySelector('div');
  if (!firstSection) return;
  const firstElement = firstSection.firstElementChild;
  if (firstElement && firstElement.tagName === 'PICTURE') {
    const h1 = firstSection.querySelector('h1');
    if (h1 && firstElement.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING) {
      const section = document.createElement('div');
      section.append(buildBlock('hero', { elems: [firstElement, h1] }));
      main.prepend(section);
    }
  }
}

export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decoratePageVolume(main);
  decorateParagraphs(main);
}

async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* query string performance testing */
    if (window.location.search.includes('martech=off')) return;
    loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('eager load failed', e);
  }
}

async function loadLazy(doc) {
  const main = doc.querySelector('main');
  if (main) {
    await loadBlocks(main);
  }

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : null;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture img'));
}

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
