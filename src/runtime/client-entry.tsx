import { createRoot } from 'react-dom/client';
import siteData from 'kang:site-data';
import { App } from './app';

function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(<App />);
}

console.log(siteData);
renderInBrowser();
