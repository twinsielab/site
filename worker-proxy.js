/* CONFIGURATION STARTS HERE */

const MY_DOMAIN = 'www.tinymod.xyz';

// SEO
const PAGE_TITLE = 'TinyMod';
const PAGE_DESCRIPTION = 'A Tiny, Mostly 3D Printed, Modular, Customizable, Open-source 3D Printer';

// Google Font https://fonts.google.com
const GOOGLE_FONT = 'Play';

const CUSTOM_HEAD = `
    <link rel="stylesheet" href="https://twinsielab.github.io/site/styles.css">
  `;

const CUSTOM_HTML = `
    <script src="https://twinsielab.github.io/site/notes-widget.js"></script>
  `;

/*
 * Step 2: enter your URL slug to page ID mapping
 * The key on the left is the slug (without the slash)
 * The value on the right is the Notion page ID
 */
const ALIAS_TO_ID = {
  '': '96c2251f9d7449e288f17434e6afbacb',
  'support': 'e130064ba2de467e8fbb154dd2778143',
  'gallery': 'd0d1308e17624f5f979e4dfd29b0672a',
  'about-us': '2a671df9bada4a1ca037a4f6aa7fb290',

  'printers': '13fca183ef4a40bf9588be8d2aa92232',
  'flow-ratio': '7dd0c36944244133ae463cd6439a793d',
};


// sitemap pages
const SITEMAP = [
  '',
  'Building-a-TinyMod-7f0e682bede64903bbeef3b328e350a6',
  'be054ee8a1174af983ac98282af8bd3e?v=9e361da957c2447f98f77abe8597c344', // printed parts
  '3f4a4eb04c95442ba7494b8616690b79?v=d47a4f2d1b3846d6a679e48a8fceb228', // non printed parts
  'E-steps-Calibration-376834d479b646eebb876474721ead61',
  'Quick-Tolerance-test-e5c59bb35bb74bc395dc036e3221f302',
  'Configure-and-install-Octoprint-on-OrangePi-c2df3f6004dc407cb8a15926f590f645',
  'Orca-Slicer-c45ba04fa0494a37ad8937a16e7f6d38',
  'support',
  //'gallery',
  'about-us',
  'flow-ratio',
];



/* CONFIGURATION ENDS HERE */

const ID_TO_ALIAS = Object.fromEntries(Object.entries(ALIAS_TO_ID).map(([key, val]) => ([val, key])));

addEventListener('fetch', event => {
  event.respondWith(fetchAndApply(event.request));
});


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function handleOptions(request) {
  if (request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        'Allow': 'GET, HEAD, POST, PUT, OPTIONS',
      }
    });
  }
}

async function fetchAndApply(request) {
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  let url = new URL(request.url);
  url.hostname = 'www.notion.so';

  if (url.pathname === '/robots.txt') {
    return new Response(`Sitemap: https://${MY_DOMAIN}/sitemap.xml`);
  }

  if (url.pathname === '/sitemap.xml') {
    const sitemapEntries = SITEMAP.map(slug => `  <url><loc>https://${MY_DOMAIN}/${slug}</loc></url>`).join('\n');
    const siteMap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}</urlset>`;
    let response = new Response(siteMap);
    response.headers.set('content-type', 'application/xml');
    return response;
  }

  let response;
  if (url.pathname.startsWith('/app') && url.pathname.endsWith('js')) {
    response = await fetch(url.toString());
    let body = await response.text();
    response = new Response(body.replace(/www.notion.so/g, MY_DOMAIN).replace(/notion.so/g, MY_DOMAIN), response);
    response.headers.set('Content-Type', 'application/x-javascript');
    return response;
  }
  else if ((url.pathname.startsWith('/api'))) {
    // Forward API
    response = await fetch(url.toString(), {
      body: url.pathname.startsWith('/api/v3/getPublicPageData') ? null : request.body,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
      },
      method: 'POST',
    });
    response = new Response(response.body, response);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } 
  else if (url.pathname.endsWith(".js")) {
    response = await fetch(url.toString());
    let body = await response.text();
    response = new Response(
      body,
      response
    );
    response.headers.set("Content-Type", "application/x-javascript");
    return response;
  }
  else if (ALIAS_TO_ID[url.pathname.slice(1)] !== undefined) {
    const pageId = ALIAS_TO_ID[url.pathname.slice(1)];
    return Response.redirect('https://' + MY_DOMAIN + '/' + pageId, 301);
  }
  else {
    response = await fetch(url.toString(), {
      body: request.body,
      headers: request.headers,
      method: request.method,
    });
    response = new Response(response.body, response);
    response.headers.delete('Content-Security-Policy');
    response.headers.delete('X-Content-Security-Policy');
  }

  return appendJavascript(response, ALIAS_TO_ID);
}

class MetaRewriter {
  element(element) {
    if (PAGE_TITLE !== '') {
      if (element.getAttribute('property') === 'og:title'
        || element.getAttribute('name') === 'twitter:title') {
        element.setAttribute('content', PAGE_TITLE);
      }
      if (element.tagName === 'title') {
        element.setInnerContent(PAGE_TITLE);
      }
    }
    if (PAGE_DESCRIPTION !== '') {
      if (element.getAttribute('name') === 'description'
        || element.getAttribute('property') === 'og:description'
        || element.getAttribute('name') === 'twitter:description') {
        element.setAttribute('content', PAGE_DESCRIPTION);
      }
    }
    if (element.getAttribute('property') === 'og:url'
      || element.getAttribute('name') === 'twitter:url') {
      element.setAttribute('content', MY_DOMAIN);
    }
    if (element.getAttribute('name') === 'apple-itunes-app') {
      element.remove();
    }
  }
}

class HeadRewriter {
  element(element) {
    if (GOOGLE_FONT !== '') {
      element.append(`
      <!-- Font -->
      <link href='https://fonts.googleapis.com/css?family=${GOOGLE_FONT.replace(/ /g, '+')}:Regular,Bold,Italic&display=swap' rel='stylesheet'>
      <style>* { font-family: "${GOOGLE_FONT}" !important; }</style>
      `,
        { html: true }
      )
    }
    // hide "Try Notion" buttons
    element.append(
      `
      <!-- Clean page -->
      <style>
        div.notion-topbar > div > div:nth-child(3) { display: none !important; } /*comments*/
        div.notion-topbar > div > div:nth-child(5) { display: none !important; } /* more btn */
        div.notion-topbar > div > div:nth-child(6) { display: none !important; } /* divider */
        div.notion-topbar > div > div:nth-child(7) { display: none !important; } /* Try notion button */
        div.notion-topbar > div > div:nth-child(1n).toggle-mode { display: block !important; }

        div.notion-topbar-mobile > div:nth-child(4) { display: none !important; }
        div.notion-topbar-mobile > div:nth-child(1n).toggle-mode { display: block !important; }
      </style>
      `,
      {
        html: true,
      }
    )
    element.append(CUSTOM_HEAD, { html: true })
  }
}


class BodyRewriter {
  constructor(ALIAS_TO_ID) {
    this.ALIAS_TO_ID = ALIAS_TO_ID;
  }
  element(element) {
    element.append(`
<!-- INJECTED -->
<script>
const MY_DOMAIN = '${MY_DOMAIN}';
const ALIAS_TO_ID = ${ JSON.stringify(this.ALIAS_TO_ID, null, 2) };
</script>

<script>
window.CONFIG.domainBaseUrl = 'https://' + MY_DOMAIN;
localStorage.__console = true;

const ID_TO_ALIAS = Object.fromEntries(Object.entries(ALIAS_TO_ID).map(([key, val]) => ([val, key])));

function getPage() {
  return location.pathname.slice(-32);
}
function getSlug() {
  return location.pathname.slice(1);
}
function updateSlug() {
  const slug = ID_TO_ALIAS[getPage()];
  if (slug != null) {
    history.replaceState(history.state, '', '/' + slug);
  }
}
function enableConsoleEffectAndSetMode(mode) {
  if (__console && !__console.isEnabled) {
    __console.enable();
    window.location.reload();
  } else {
    __console.environment.ThemeStore.setState({ mode: mode });
    localStorage.setItem('newTheme', JSON.stringify({ mode: mode }));
  }
}

const el = document.createElement('div');
function onDark() {
  el.innerHTML = '<button id="toggle-light" title="Change to Light Mode" style="background:transparent; border: 1px solid rgba(255, 255, 255, 0.13); border-radius: 4px;">🔆</button>';
  document.body.classList.add('dark');
  enableConsoleEffectAndSetMode('dark')
}
function onLight() {
  el.innerHTML = '<button id="toggle-dark" title="Change to Dark Mode" style="background:transparent; border: 1px solid rgba(55, 53, 47, 0.16); border-radius: 4px;">🌙</button>';
  document.body.classList.remove('dark');
  enableConsoleEffectAndSetMode('light')
}
function toggle() {
  if (document.body.classList.contains('dark')) {
    onLight();
  } else {
    onDark();
  }
}

function addDarkModeButton(device) {
  const nav = device === 'web' ? document.querySelector('.notion-topbar').firstChild : document.querySelector('.notion-topbar-mobile');
  el.className = 'toggle-mode';
  el.addEventListener('click', toggle);
  const timeout = device === 'web' ? 0 : 500;
  setTimeout(() => {
    nav.appendChild(el);
  }, timeout);
  // get the current theme and add the toggle to represent that theme
  const currentTheme = JSON.parse(localStorage.getItem('newTheme'))?.mode
  if (currentTheme) {
    if (currentTheme === 'dark') {
      onDark();
    } else {
      onLight();
    }
  } else {
    // enable smart dark mode based on user-preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      onDark();
    } else {
      onLight();
    }
  }
  // try to detect if user-preference change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    toggle();
  });
}

let redirected = false;
const observer = new MutationObserver(function () {
  if (redirected) return;
  const nav = document.querySelector('.notion-topbar');
  const mobileNav = document.querySelector('.notion-topbar-mobile');
  if (nav && nav.firstChild && nav.firstChild.firstChild || mobileNav && mobileNav.firstChild) {
    redirected = true;
    updateSlug();
    addDarkModeButton(nav ? 'web' : 'mobile');
    const onpopstate = window.onpopstate;
    window.onpopstate = function () {
      const page = ALIAS_TO_ID[getSlug()];
      if (page !== undefined) {
        history.replaceState(history.state, 'bypass', '/' + page);
      }
      onpopstate.apply(this, [].slice.call(arguments));
      updateSlug();
    };
  }
});
observer.observe(document.querySelector('#notion-app'), {
  childList: true,
  subtree: true,
});

const replaceState = window.history.replaceState;
window.history.replaceState = function (state) {
  if (arguments[1] !== 'bypass' && ALIAS_TO_ID[getSlug()] !== undefined) return;
  return replaceState.apply(window.history, arguments);
};

const pushState = window.history.pushState;
window.history.pushState = function (state) {
  const dest = new URL(location.protocol + location.host + arguments[2]);
  const id = dest.pathname.slice(-32);
  if (ID_TO_ALIAS[id]) {
    arguments[2] = '/' + ID_TO_ALIAS[id];
  }
  return pushState.apply(window.history, arguments);
};

const open = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
  arguments[1] = arguments[1].replace(MY_DOMAIN, 'www.notion.so');
  return open.apply(this, [].slice.call(arguments));
};    
</script>

<!-- CUSTOM HTML -->
${CUSTOM_HTML}
    `, {
      html: true
    });
  }
}

async function appendJavascript(res, ALIAS_TO_ID) {
  return new HTMLRewriter()
    .on('title', new MetaRewriter())
    .on('meta', new MetaRewriter())
    .on('head', new HeadRewriter())
    .on('body', new BodyRewriter(ALIAS_TO_ID))
    .transform(res);
}
