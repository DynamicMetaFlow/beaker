import * as yo from 'yo-yo'
import co from 'co'

// globals
// =

var navItems = [
  { href: 'beaker:start', label: 'Favorites', icon: 'star' },
  { href: 'beaker:library', label: 'Library', icon: 'book' },
  // { href: 'beaker:services', label: 'Cloud', icon: 'cloud' },
  { href: 'beaker:history', label: 'History', icon: 'back-in-time' },
  { href: 'beaker:downloads', label: 'Downloads', icon: 'down-circled' },
  { href: 'beaker:settings', label: 'Settings', icon: 'list' }
]

// re-render when the URL changes
window.addEventListener('pushstate', update)
window.addEventListener('popstate', update)

// exported API
// =

export function setup () {
  document.getElementById('el-sidenav').appendChild(render())
}

export function update () {
  yo.update(document.querySelector('#el-sidenav nav'), render())
}

// rendering
// =

function render () {
  return yo`<nav class="nav-group">
    ${navItems.map(renderNavItem)}
  </nav>`
}

function renderNavItem (item) {
  // render headers (represented by just a string)
  if (typeof item == 'string' || item.innerHTML)
    return yo`<h5 class="nav-group-title">${item}</h5>`

  // render items
  var { href, label, icon } = item
  var isActiveTest = item.isActive || defaultIsActiveTest
  var isActive = isActiveTest(''+window.location, item)
  return yo`<a class=${'nav-group-item' + (isActive?' active':'')} href=${href} title=${label} onclick=${onClickNavItem(item)}>
    <span class="icon icon-${icon}"></span>
  </a>`
}

// event handlers
// =

function onClickNavItem (item) {
  return e => {
    // ignore ctrl/cmd+click
    if (e.metaKey) return
    e.preventDefault()

    if (window.location.protocol == 'beaker:' && item.href.startsWith('beaker:')) {
      // just navigate virtually, if we're on and going to a beaker: page
      window.history.pushState(null, '', item.href)
    } else {
      // actually go to the page
      window.location = item.href
    }
  }
}

// helpers
// =

function defaultIsActiveTest (location, item) {
  return location.startsWith(item.href)
}

