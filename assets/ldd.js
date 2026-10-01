/* LDD — handler do formulário de lead. Valida, monta a mensagem e faz o handoff pro WhatsApp.
   Quando /api/lead estiver ativo (GMAIL_APP_PASSWORD na Vercel), descomentar o bloco fetch abaixo
   para também notificar limpadadosdigital.01@gmail.com antes do redirect. */
(function(){
  var WA = "https://wa.me/5548991058748?text=";
  var form = document.getElementById('leadForm');
  if(!form) return;
  var err = document.getElementById('err');
  var formView = document.getElementById('formView');
  var successView = document.getElementById('successView');
  var waGo = document.getElementById('waGo');
  function clean(t){ return (t||'').replace(/\s+/g,' ').trim(); }

  function finish(nome, tel, prob){
    var ctx = form.getAttribute('data-context') || 'Site';
    var msg = 'Olá, sou ' + nome + '. Quero remover ' + prob + '. Meu WhatsApp: ' + tel + '. (' + ctx + ')';
    waGo.setAttribute('href', WA + encodeURIComponent(msg));
    formView.hidden = true;
    successView.classList.add('on');
    successView.scrollIntoView({behavior:'smooth', block:'center'});
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    err.textContent = '';
    var nome = clean(document.getElementById('nome').value);
    var tel  = clean(document.getElementById('tel').value);
    var prob = document.getElementById('problema').value;
    if(nome.length < 2){ err.textContent = 'Escreva seu nome, por favor.'; return; }
    if(tel.replace(/\D/g,'').length < 10){ err.textContent = 'Informe um WhatsApp válido com DDD.'; return; }

    try{
      fetch('/api/lead', {method:'POST', headers:{'Content-Type':'application/json'}, keepalive:true,
        body: JSON.stringify({nome:nome, tel:tel, problema:prob, pagina: location.pathname})});
    }catch(_){}
    finish(nome, tel, prob);
  });
})();
