/**
 * Router
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import Scrolling from './_scrolling.js';

export default class Router {
  
  constructor() {
    this._url = location.pathname; // 前ページの履歴として保持
    this._handleEvents();

  }


  _handleEvents() {
    const myTouch = 'ontouchend' in document && window.innerWidth < 1024 ? 'touchend' : 'click';
    document.addEventListener(myTouch, (event) => {
      if (!event.target.getAttribute('target')) {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        history.pushState(null, null, href);
        this._urlChangeHandler();
      }
    });
    window.addEventListener('popstate', () => this._urlChangeHandler());

  }


  async _urlChangeHandler() {
    const url = location.pathname;
    if (this._url !== url) { // ハッシュだけの変更は無視する
      const html = await this._fetchHTML(url);
      const promise = this._flip(html);
      promise.then(() => {
        window.dispatchEvent(new Event('scroll')); // スクロール不要の場合もドロワーメニューを閉じる
        const scrolling = new Scrolling();
        scrolling.scroll('page');
        this._url = url;
      });
    }

  }


  async _fetchHTML(url) {
    try {
      const parser = new DOMParser();
      const resp = await fetch(url, {
        method: 'GET',
        mode: 'same-origin',
        headers: {
          'Content-Type': 'text/html',
        }
      });
      return parser.parseFromString(await resp.text(), 'text/html').body;
    } catch (error) {
      return null;
    }

  }


  _flip(html) {
    const elem = document.querySelector('.page');
    return this._hide(elem).then(() => {
      elem.innerHTML = html.querySelector('.page').innerHTML;
      return this._show(elem);
    });

  }


  _show(elem) {
    elem.style.visibility = '';
    return this._animationEnd(elem, () => {
      elem.classList.add('--animationShow');
    }).then(() => {
      elem.classList.remove('--animationShow');
    });

  }


  _hide(elem) {
    return this._animationEnd(elem, () => {
      elem.classList.add('--animationHide');
    }).then(() => {
      elem.style.visibility = 'hidden';
      elem.classList.remove('--animationHide');
    });

  }


  _animationEnd(elem, func) {
    let callback;
    const promise = new Promise((resolve, reject) => {
      callback = () => resolve(elem);
      elem.addEventListener('animationend', callback);
    });
    func();
    promise.then((elem) => {
      elem.removeEventListener('animationend', callback);
    });
    return promise;

  }
  
}
