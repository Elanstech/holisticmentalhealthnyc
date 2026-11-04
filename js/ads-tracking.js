// Google Ads conversion events for holisticmentalhealthny.com
// Needs the Google tag (AW-17896700019) that is already loaded in <head>.
// 1) "Site call click"   - a tap/click on the practice number (631) 265-9850 (never 911 / 988)
// 2) "Website lead form" - the Elfsight contact form shows its "sent" message
// No personal data is sent: only the event name and the Google conversion label.
(function () {
  var CALL_LABEL = 'AW-17896700019/eidHCKT3pLIdEPPw59VC';
  var FORM_LABEL = 'AW-17896700019/slZLCMivpLIdEPPw59VC';

  function report(label) {
    if (typeof window.gtag !== 'function') return;
    try { window.gtag('event', 'conversion', { send_to: label }); } catch (e) {}
  }

  // 1) Phone taps - once per page view (tapping twice is still one call)
  var callSent = false;
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="tel:"]') : null;
    if (!a || callSent || !/6312659850/.test(a.getAttribute('href') || '')) return;
    callSent = true;
    report(CALL_LABEL);
  }, true);

  // 2) Elfsight form - the widget swaps the form for a thank-you message after sending.
  //    Watch the widget box and fire once when that message appears after the form was shown.
  var box = document.querySelector('[class*="elfsight-app-"]');
  if (!box || !window.MutationObserver) return;
  var SUCCESS = /thank you|thanks for|has been sent|successfully|we'll be in touch|we will be in touch|message sent|received your/i;
  var formSent = false, sawForm = false, prevMatch = false;
  var obs = new MutationObserver(function () {
    if (formSent) return;
    if (box.querySelector('input, textarea')) sawForm = true;
    var nowMatch = SUCCESS.test(box.innerText || '');
    if (sawForm && nowMatch && !prevMatch) {
      formSent = true;
      report(FORM_LABEL);
      obs.disconnect();
    }
    prevMatch = nowMatch;
  });
  obs.observe(box, { childList: true, subtree: true, characterData: true });
})();
