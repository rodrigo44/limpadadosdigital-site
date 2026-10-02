/* LDD — eventos personalizados de clique pro GA4 (G-DQXH9FVPEZ).
   Carregado em todas as paginas. Usa delegacao de evento: pega o clique
   em qualquer link wa.me (WhatsApp) ou mailto: (e-mail), inclusive os
   criados/alterados por JS (ex. botao da tela de sucesso do formulario). */
(function(){
  if(typeof window === 'undefined') return;

  function send(name, params){
    try{ if(typeof gtag === 'function'){ gtag('event', name, params); } }catch(_){}
  }

  function waLocation(a){
    var cls = (a.getAttribute('class') || '');
    if(/\bwfloat\b/.test(cls)) return 'floating';
    if(a.id === 'waGo') return 'form_success';
    return 'inline';
  }

  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if(!a) return;
    var href = a.getAttribute('href') || '';

    if(/(^https?:)?\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)){
      send('whatsapp_click', {
        link_location: waLocation(a),
        page_path: location.pathname,
        transport_type: 'beacon'
      });
      return;
    }

    if(/^mailto:/i.test(href)){
      send('email_click', {
        page_path: location.pathname,
        transport_type: 'beacon'
      });
    }
  }, true);
})();
