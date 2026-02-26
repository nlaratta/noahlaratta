/**
 * Lab navigation — drop-in back button for standalone pages.
 *
 * Usage:  <script src="/lab-nav.js"></script>
 * Options (via data attributes on the script tag):
 *   data-label="Custom Text"   — override button text  (default: "← Lab")
 *   data-href="/some/path"     — override link target   (default: "/lab")
 */
;(function () {
  var script =
    document.currentScript ||
    document.querySelector('script[src*="lab-nav"]')
  var label = (script && script.getAttribute('data-label')) || '\u2190 Lab'
  var href = (script && script.getAttribute('data-href')) || '/lab'

  var style = document.createElement('style')
  style.textContent =
    '.lab-nav-back{' +
    'position:fixed;top:16px;left:16px;z-index:9999;' +
    'display:inline-flex;align-items:center;gap:4px;' +
    'padding:8px 14px;border-radius:99px;' +
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
    'font-size:13px;font-weight:600;line-height:1;' +
    'color:#52B788;' +
    'background:rgba(255,255,255,.08);' +
    'border:1px solid rgba(255,255,255,.1);' +
    'backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);' +
    'text-decoration:none;cursor:pointer;' +
    'transition:all .2s ease;' +
    'opacity:0;transform:translateY(-8px);' +
    'animation:lab-nav-in .4s ease forwards .3s' +
    '}' +
    '.lab-nav-back:hover{' +
    'background:rgba(255,255,255,.14);' +
    'color:#74d4a0;' +
    'border-color:rgba(255,255,255,.18)' +
    '}' +
    '@media(prefers-color-scheme:light){' +
    '.lab-nav-back{' +
    'color:#2D6A4F;' +
    'background:rgba(0,0,0,.04);' +
    'border-color:rgba(0,0,0,.08)' +
    '}' +
    '.lab-nav-back:hover{' +
    'background:rgba(0,0,0,.07);' +
    'color:#1B4332;' +
    'border-color:rgba(0,0,0,.12)' +
    '}' +
    '}' +
    '@keyframes lab-nav-in{' +
    'to{opacity:1;transform:translateY(0)}' +
    '}'

  var link = document.createElement('a')
  link.className = 'lab-nav-back'
  link.href = href
  link.textContent = label

  document.head.appendChild(style)
  document.body.appendChild(link)
})()
