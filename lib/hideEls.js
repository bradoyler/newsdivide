
var selector = 'iframe, #BBStoreW, .ad, .advertisement, .ad__wrapper, .flite-mask, .flite-lightbox, .top-ad, .ad_container, .advert--pencil, .ad_wrapper, .kargo-ad-hover, .dfp-ad, ' +
' .trb_masthead_adBanner, #marquee, #bg, #AT_OVERLAY_LAYER, #AT_OVERLAY_BACKGROUND, .Header__MobileAdRow';

document.querySelectorAll(selector).forEach(function (el) {
  el.style = 'display:none';
});
