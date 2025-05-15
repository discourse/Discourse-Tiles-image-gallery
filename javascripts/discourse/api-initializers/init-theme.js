import $ from "jquery";
import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";

// Colcade.js
// Author: David DeSandro
// Github: https://github.com/desandro/colcade
// license: MIT - https://desandro.mit-license.org/
// prettier-ignore
// eslint-disable-next-line
!(function(t,e){"function"===typeof define&&define.amd?define(e):"object"===typeof module&&module.exports?module.exports=e():t.Colcade=e();})(window,function(){function t(t,e){if((t=s(t))&&t.colcadeGUID){let i=a[t.colcadeGUID];return i.option(e),i;}this.element=t,this.options={},this.option(e),this.create();}function e(e){let i={};e.getAttribute("data-colcade").split(",").forEach(function(t){let e=t.split(":"),n=e[0].trim(),o=e[1].trim();i[n]=o;}),new t(e,i);}function i(t,e){for(let i in e){t[i]=e[i];}return t;}function n(t){let e=[];if(Array.isArray(t)){e=t;}else if(t&&"number"===typeof t.length){for(let i=0;i<t.length;i++){e.push(t[i]);}}else {e.push(t);}return e;}function o(t,e){return n((e=e||document).querySelectorAll(t));}function s(t){return"string"===typeof t&&(t=document.querySelector(t)),t;}let u=t.prototype;u.option=function(t){this.options=i(this.options,t);};var r=0,a={};return u.create=function(){this.errorCheck();let t=this.guid=++r;this.element.colcadeGUID=t,a[t]=this,this.reload(),this._windowResizeHandler=this.onWindowResize.bind(this),this._loadHandler=this.onLoad.bind(this),window.addEventListener("resize",this._windowResizeHandler),this.element.addEventListener("load",this._loadHandler,!0);},u.errorCheck=function(){let t=[];if(this.element||t.push("Bad element: "+this.element),this.options.columns||t.push("columns option required: "+this.options.columns),this.options.items||t.push("items option required: "+this.options.items),t.length){throw new Error("[Colcade error] "+t.join(". "));}},u.reload=function(){this.updateColumns(),this.updateItems(),this.layout();},u.updateColumns=function(){this.columns=o(this.options.columns,this.element);},u.updateItems=function(){this.items=o(this.options.items,this.element);},u.getActiveColumns=function(){return this.columns.filter(function(t){return"none"!=getComputedStyle(t).display;});},u.layout=function(){this.activeColumns=this.getActiveColumns(),this._layout();},u._layout=function(){this.columnHeights=this.activeColumns.map(function(){return 0;}),this.layoutItems(this.items);},u.layoutItems=function(t){t.forEach(this.layoutItem,this);},u.layoutItem=function(t){let e=Math.min.apply(Math,this.columnHeights),i=this.columnHeights.indexOf(e);this.activeColumns[i].appendChild(t),this.columnHeights[i]+=t.offsetHeight||1;},u.append=function(t){let e=this.getQueryItems(t);this.items=this.items.concat(e),this.layoutItems(e);},u.prepend=function(t){let e=this.getQueryItems(t);this.items=e.concat(this.items),this._layout();},u.getQueryItems=function(t){t=n(t);let e=document.createDocumentFragment();return t.forEach(function(t){e.appendChild(t);}),o(this.options.items,e);},u.measureColumnHeight=function(t){let e=this.element.getBoundingClientRect();this.activeColumns.forEach(function(i,n){if(!t||i.contains(t)){let o=i.lastElementChild.getBoundingClientRect();this.columnHeights[n]=o.bottom-e.top;}},this);},u.onWindowResize=function(){clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){this.onDebouncedResize();}.bind(this),100);},u.onDebouncedResize=function(){let t=this.getActiveColumns(),e=t.length==this.activeColumns.length,i=!0;this.activeColumns.forEach(function(e,n){i=i&&e==t[n];}),e&&i||(this.activeColumns=t,this._layout());},u.onLoad=function(t){this.measureColumnHeight(t.target);},u.destroy=function(){this.items.forEach(function(t){this.element.appendChild(t);},this),window.removeEventListener("resize",this._windowResizeHandler),this.element.removeEventListener("load",this._loadHandler,!0),delete this.element.colcadeGUID,delete a[this.guid];},(function(t){"complete"!=document.readyState?document.addEventListener("DOMContentLoaded",t):t();})(function(){o("[data-colcade]").forEach(e);}),t.data=function(t){let e=(t=s(t))&&t.colcadeGUID;return e&&a[e];},t.makeJQueryPlugin=function(e){function i(t,i,n){let o;return t.each(function(t,s){let u=e.data(s,"colcade");if(u){let r=u[i].apply(u,n);o=void 0===o?r:o;}}),void 0!==o?o:t;}function n(i,n){i.each(function(i,o){let s=e.data(o,"colcade");s?(s.option(n),s.layout()):(s=new t(o,n),e.data(o,"colcade",s));});}(e=e||window.jQuery)&&(e.fn.colcade=function(t){return"string"===typeof t?i(this,t,Array.prototype.slice.call(arguments,1)):(n(this,t),this);});},t.makeJQueryPlugin(),t;});

export default apiInitializer((api) => {
  const iconHTML = require("discourse-common/lib/icon-library").iconHTML,
    tiles_selector = '.cooked div[data-theme-tiles="1"]',
    mobileView = $("html.mobile-view").length,
    padding = 6; // padding between tiles

  let numberOfTiles = 3, // show three columns on desktop
    cookedWidth = 690; // desktop post width

  if (mobileView) {
    numberOfTiles = 2; // show two columns on mobile
    cookedWidth = $(window).width() - 20; // mobile post width (device width - #main-outlet padding)
  }

  const extraSpace = padding * numberOfTiles,
    cleanWidth = cookedWidth - extraSpace,
    tileWidth = cleanWidth / numberOfTiles;

  // Handles translations for composer
  let translations = I18n.translations[I18n.currentLocale()].js;

  if (!translations) {
    translations = {};
  }
  if (!translations.composer) {
    translations.composer = {};
  }
  translations.tiles_gallery_button = settings.Tiles_button_text;
  translations.composer.tiles_add_images_prompt =
    settings.Tiles_add_images_prompt;

  $.fn.dtilesprep = function () {
    if (this.length === 0) {
      return this;
    }

    this.each(function () {
      const lightbox = $(this).find("a.lightbox");

      if (lightbox.length === 0) {
        return this;
      }

      $.each(lightbox, function () {
        const img = $(this).children("img");
        const height = img.attr("height");
        const width = img.attr("width");
        const adjustBy = width / tileWidth;
        const newHeight = height / adjustBy;

        $(this)
          .css("height", newHeight)
          .prepend(`<div class="tiles-zoom">${iconHTML("search")}</div>`);
      });
    });

    return this;
  };

  $.fn.dtiles = function () {
    if (!this.length) {
      return this;
    }

    this.each(function () {
      $(this)
        .prepend(
          `<div class="tiles-col tiles-col--1"></div>
             <div class="tiles-col tiles-col--2"></div>
             <div class="tiles-col tiles-col--3"></div>`
        )
        .colcade({
          columns: ".tiles-col",
          items: ".lightbox-wrapper",
        })
        .addClass("tiles-initialized");
    });

    return this;
  };

  api.decorateCooked(
    ($elem) => {
      return $elem
        .children(tiles_selector)
        .not(".tiles-initialized")
        .dtilesprep()
        .dtiles();
    },
    { id: "discourse-tiles-image-gallery" }
  );

  api.onToolbarCreate(function (toolbar) {
    toolbar.addButton({
      trimLeading: true,
      id: "TilesGallery",
      group: "insertions",
      icon: settings.Tiles_button_icon,
      title: "tiles_gallery_button",
      perform: function (e) {
        return e.applySurround(
          '<div data-theme-tiles="1">\n\n',
          "\n\n</div>",
          "tiles_add_images_prompt",
          { multiline: false }
        );
      },
    });
  });
});
