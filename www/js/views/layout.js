'use strict';
var m = require('mithril');

module.exports = {
  view: function(vnode) {
    return m('main', [
      m('header', [
        m('a.logo', { href: '/', oncreate: m.route.link }, [
          m('img.logo', { src: './img/small_logo.png' }),
        ]),
        m('navbar', [
          m('nav', [
            m('a', { href: '/old', oncreate: m.route.link }, 'Archive'),
            m('a', { href: '/about', oncreate: m.route.link }, 'About'),
          ]),
        ]),
      ]),
      m('section.container', vnode.children),
    ]);
  },
};
