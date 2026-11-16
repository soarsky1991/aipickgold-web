import { renderSite } from './site.js';
import { initEcosystem } from './galaxy-controller.js';

const page = renderSite(location.search);
document.title = page.title;
document.querySelector('#app').innerHTML = page.html;
if (page.view === 'home') initEcosystem();
