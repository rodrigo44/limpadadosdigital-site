const nodemailer = require('nodemailer');

function esc(s) {
  return String(s || '').replace(/[<>&"]/g, function (c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const nome = String(body.nome || '').trim().slice(0, 120);
  const tel = String(body.tel || '').trim().slice(0, 40);
  const problema = String(body.problema || '').trim().slice(0, 200);
  const pagina = String(body.pagina || '').trim().slice(0, 200);

  if (nome.length < 2 || tel.replace(/\D/g, '').length < 10) {
    res.status(400).json({ ok: false, error: 'dados_incompletos' });
    return;
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.LEAD_TO || user;

  if (!user || !pass) {
    console.error('lead: credenciais ausentes');
    res.status(500).json({ ok: false, error: 'config' });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: user, pass: pass }
    });

    await transporter.sendMail({
      from: '"Site LDD" <' + user + '>',
      to: to,
      replyTo: user,
      subject: 'Novo lead do site: ' + nome + (problema ? ' - ' + problema : ''),
      text:
        'Novo lead pelo formulario do site.\n\n' +
        'Nome: ' + nome + '\n' +
        'WhatsApp: ' + tel + '\n' +
        'Quer remover: ' + problema + '\n' +
        'Pagina: ' + pagina + '\n',
      html:
        '<h2>Novo lead do site</h2>' +
        '<p><strong>Nome:</strong> ' + esc(nome) + '</p>' +
        '<p><strong>WhatsApp:</strong> ' + esc(tel) + '</p>' +
        '<p><strong>Quer remover:</strong> ' + esc(problema) + '</p>' +
        '<p><strong>Pagina:</strong> ' + esc(pagina) + '</p>'
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('lead: falha ao enviar', e && e.message);
    res.status(500).json({ ok: false, error: 'send_failed' });
  }
};
