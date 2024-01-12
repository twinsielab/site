/* CONFIGURATION STARTS HERE */
const MY_DOMAIN = 'www.tinymod.xyz';

// SEO
const PAGE_TITLE = 'TinyMod';
const PAGE_DESCRIPTION = 'A Tiny, Mostly 3D Printed, Modular, Customizable, Open-source 3D Printer';
const PAGE_AUTHOR = 'TwinsieLab';
const PAGE_COVER = 'https://twinsielab.github.io/site/cover.png';
const PAGE_FAVICON = 'https://twinsielab.github.io/site/icon.png';

/*
 * Enter your URL slug to page ID mapping
 * The key on the left is the slug (without the slash)
 * The value on the right is the Notion page ID
 */
const ALIAS_TO_ID = {
  // never rename these slugs (they are linked externally, qrcode etc...)
  '': '96c2251f9d7449e288f17434e6afbacb',            //home
  'alpha': '7f0e682bede64903bbeef3b328e350a6',       // permalink
  'pro': '707be1b81ad14eb5a144916e7aeeaa68',         // permalink
  'tms': 'e030b06d532c4460a935a7d06911ad74',         // permalink
  'heatbed-mk1': '3252bf9d20d74f399930506c4933bb7a', // permalink

  'sn': 'd0d1308e17624f5f979e4dfd29b0672a',
  'request-sn': '37153907e8b34bf0b8cf84abab6ca5f1',
  'donate': 'e130064ba2de467e8fbb154dd2778143',
  'discord': '53c2dab01d17421593aaad68c01afa0b',
  'about-us': '2a671df9bada4a1ca037a4f6aa7fb290',

  'flow-ratio': '7dd0c36944244133ae463cd6439a793d',

  'printers': '13fca183ef4a40bf9588be8d2aa92232', // private ish
};


// sitemap pages
const SITEMAP = [
  '',
  'alpha',
  'pro',
  'tms',
  'heatbed-mk1',

  'sn',
  'request-sn',
  'discord',
  'donate',
  'about-us',

  'flow-ratio',

  'Building-a-TinyMod-7f0e682bede64903bbeef3b328e350a6',
  'be054ee8a1174af983ac98282af8bd3e?v=9e361da957c2447f98f77abe8597c344', // printed parts
  '3f4a4eb04c95442ba7494b8616690b79?v=d47a4f2d1b3846d6a679e48a8fceb228', // non printed parts
  'E-steps-Calibration-376834d479b646eebb876474721ead61',
  'Quick-Tolerance-test-e5c59bb35bb74bc395dc036e3221f302',
  'Configure-and-install-Octoprint-on-OrangePi-c2df3f6004dc407cb8a15926f590f645',
  'Orca-Slicer-c45ba04fa0494a37ad8937a16e7f6d38',
];


// Replace texts.
const replace_dict = {
  'FOOBAR': 'HELLOWORLD',
}


// Google Font https://fonts.google.com
const GOOGLE_FONT = 'Play';

const CUSTOM_CSS = /*css*/`
  div.notion-topbar > div > div:has(svg path[d^="M2.887"]) { display: none !important; } /* (...) "more" btn */
  div.notion-topbar > div > div:has(.notionLogo) { display: none !important; } /* Built-with Notion btn */
  /*
  div.notion-topbar > div > div:nth-child(3) { display: none !important; } /*comments*/
  div.notion-topbar > div > div:nth-child(5) { display: none !important; } /* more btn */
  div.notion-topbar > div > div:nth-child(6) { display: none !important; } /* divider */
  div.notion-topbar > div > div:nth-child(7) { display: none !important; } /* Try notion button */
  div.notion-topbar > div > div:nth-child(1n).toggle-mode { display: block !important; }
  div.notion-topbar-mobile > div:nth-child(4) { display: none !important; }
  div.notion-topbar-mobile > div:nth-child(1n).toggle-mode { display: block !important; }
  */
  div.notion-topbar-mobile > div:has(svg path[d^="M2.887"]) { display: none !important; }
  div.notion-topbar-mobile > div:has(.notionLogo) { display: block !important; }
  div.notion-topbar-mobile > div:nth-child(4) { display: none !important; }
  div.notion-topbar-mobile > div:nth-child(5) { display: none !important; }
`;

const CUSTOM_HEAD = `
  <link rel="stylesheet" href="https://twinsielab.github.io/site/styles.css">
`;

const CUSTOM_HTML = `
  <script src="https://twinsielab.github.io/site/tweaks.js"></script>
  <script src="https://twinsielab.github.io/site/notes-widget/notes-widget.js"></script>
  
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-RPF4769LHF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-RPF4769LHF');
  </script>

  <!-- Posthog -->
  <script>
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_sm5VYo4NsmzIHsLq3ESA67DWhxXCT97hnobz2d0I95T',{api_host:'https://app.posthog.com'})
  </script>
`;

/********************* CONFIGURATION ENDS HERE *********************/

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
    return new Response(`
      User-agent: *
      Allow: /

      Sitemap: https://${MY_DOMAIN}/sitemap.xml
      `.replace(/^ +/gm, ''));
  }

  if (url.pathname === '/images/favicon.ico' || url.pathname === '/favicon.ico') {
    return Response.redirect(PAGE_FAVICON, 301);
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
    body = body.replace(/www.notion.so/g, MY_DOMAIN).replace(/notion.so/g, MY_DOMAIN);
    // body = await replace_response_text(body, request, response, url);
    response = new Response(body, response);
    response.headers.set('Content-Type', 'application/x-javascript');
    return response;
  }
  // API
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

    let body;
    if (response.headers.get('Content-Type')?.match(/application\/json|text\/html/)) {
      body = await response.text();
      body = await replace_response_text(body, request, response, url);
    }

    response = new Response(body || response.body, response);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
  // Javascript files
  else if (url.pathname.endsWith(".js")) {
    response = await fetch(url.toString());

    let body;
    body = await response.text();
    body = await replace_response_text(body, request, response, url);

    response = new Response(
      body || response.body,
      response
    );
    response.headers.set("Content-Type", "application/x-javascript");
    return response;
  }
  // Redirects
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

    let body;
    if (response.headers.get('Content-Type')?.match(/application\/json|text\/html/)) {
      body = await response.text();
      body = await replace_response_text(body, request, response, url);
    }

    response = new Response(body || response.body, response);
    response.headers.delete('Content-Security-Policy');
    response.headers.delete('X-Content-Security-Policy');
  }

  return appendJavascript(response, ALIAS_TO_ID);
}


async function replace_response_text(body, request, response, url) {
  let text = body;
  for (let [search, replace] of Object.entries(replace_dict)) {
    let re = new RegExp(search, 'g');
    text = text.replace(re, replace);
  }

  text = text.replace(/%CURRENTURL%/g, encodeURIComponent(request.headers.get('Referer')));

  return text;
}


// <meta property="og:site_name" content="Victor's Notion on Notion">
// <meta name="article:author" content="Victor">
// <link rel="shortcut icon" href="https://vitim.notion.site/images/favicon.ico"/>
// <meta name="twitter:image" content="https://vitim.notion.site/images/meta/builtWithNotion.png">
// <meta property="og:image" content="https://www.notion.so/images/meta/default.png"></meta>
class MetaRewriter {
  element(element) {
    // Title
    if (PAGE_TITLE && element.tagName === 'title') element.setInnerContent(PAGE_TITLE);
    if (PAGE_TITLE && element.getAttribute('property') === 'og:title' || element.getAttribute('name') === 'twitter:title' || element.getAttribute('property') === 'og:site_name') element.setAttribute('content', PAGE_TITLE);

    // Description
    if (element.getAttribute('name') === 'description' || element.getAttribute('property') === 'og:description' || element.getAttribute('name') === 'twitter:description') element.setAttribute('content', PAGE_DESCRIPTION);

    if (element.getAttribute('property') === 'og:url' || element.getAttribute('name') === 'twitter:url') element.setAttribute('content', MY_DOMAIN);
    if (PAGE_AUTHOR && element.getAttribute('article:author')) element.setAttribute('content', PAGE_AUTHOR);

    // Notion social
    if (element.getAttribute('name') === 'apple-itunes-app') element.remove();
    if (element.getAttribute('name') === 'twitter:site') element.remove();

    // Cover
    if (element.getAttribute('content')?.endsWith('builtWithNotion.png')) {
      if (PAGE_COVER) element.setAttribute('content', PAGE_COVER);
      else element.remove();
    }
    if (element.getAttribute('content') === 'https://www.notion.so/images/meta/default.png') {
      if (PAGE_COVER) element.setAttribute('content', PAGE_COVER);
      else element.remove();
    }
  }
}

class LinkRewriter {
  element(element) {
    if (element.getAttribute('rel') === 'apple-touch-icon') element.remove();
    if (element.getAttribute('rel') === 'shortcut icon' && element.getAttribute('href')?.endsWith('.notion.site/images/favicon.ico')) {
      if (PAGE_COVER) element.setAttribute('href', PAGE_COVER);
      else element.remove();
    }
  }
}

class HeadRewriter {
  element(element) {
    if (GOOGLE_FONT) {
      element.append(`
        <!-- Font -->
        <link href='https://fonts.googleapis.com/css?family=${GOOGLE_FONT.replace(/ /g, '+')}:Regular,Bold,Italic&display=swap' rel='stylesheet'>
        <style>* { font-family: "${GOOGLE_FONT}" !important; }</style>
      `, { html: true });
    }
    element.append(`<style>${CUSTOM_CSS}</style>\n`, { html: true });
    element.append(CUSTOM_HEAD, { html: true });
  }
}


class BodyRewriter {
  constructor(ALIAS_TO_ID) {
    this.ALIAS_TO_ID = ALIAS_TO_ID;
  }
  element(element) {
    element.append(/*html*/`
<!-- PATCH NOTION -->
<script>
const MY_DOMAIN = '${MY_DOMAIN}';
const ALIAS_TO_ID = ${JSON.stringify(this.ALIAS_TO_ID, null, 2)};
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
  enableConsoleEffectAndSetMode('dark');
}
function onLight() {
  el.innerHTML = '<button id="toggle-dark" title="Change to Dark Mode" style="background:transparent; border: 1px solid rgba(55, 53, 47, 0.16); border-radius: 4px;">🌙</button>';
  document.body.classList.remove('dark');
  enableConsoleEffectAndSetMode('light');
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
  const currentTheme = JSON.parse(localStorage.getItem('newTheme'))?.mode;
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
    `, { html: true });

    element.append(CUSTOM_HTML, { html: true });
  }
}

async function appendJavascript(res, ALIAS_TO_ID) {
  return new HTMLRewriter()
    .on('title', new MetaRewriter())
    .on('meta', new MetaRewriter())
    .on('link', new LinkRewriter())
    .on('head', new HeadRewriter())
    .on('body', new BodyRewriter(ALIAS_TO_ID))
    .transform(res);
}
