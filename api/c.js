module.exports = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'personaltenis.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  let query = req.query || {};
  if (!query || Object.keys(query).length === 0) {
    try {
      const parsedUrl = new URL(req.url, baseUrl);
      query = Object.fromEntries(parsedUrl.searchParams);
      const parts = parsedUrl.pathname.split('/').filter(Boolean);
      if ((parts[0] === 'c' || parts[0] === 'link') && parts[1]) {
        query.banner = parts[1];
      }
    } catch (e) {
      query = {};
    }
  }

  if (!query.banner) {
    const cleanPath = (req.url || '').split('?')[0];
    const parts = cleanPath.split('/').filter(Boolean);
    if ((parts[0] === 'c' || parts[0] === 'link') && parts[1]) {
      query.banner = parts[1];
    }
  }

  const modalidade = query.modalidade;
  const banner = query.banner || 'tenistas';

  let pageTitle = '🎾 Personal para Tenistas | Felipe Martins';
  let pageDesc = 'Preparação física específica na academia: mais potência no saque, agilidade na quadra e zero lesões. Acompanhamento presencial em Jundiaí e região.';
  let bannerImg = `${baseUrl}/assets/img/og-personal-tenistas.jpg`;

  if (modalidade === 'beach' || modalidade === 'beachtennis' || banner === 'beach') {
    pageTitle = '🏖️ Beach Tennis: Preparação Física & Aulas | Felipe Martins';
    pageDesc = 'Ganhe agilidade na areia, potência nos smashes e fôlego para jogos longos sem lesões.';
    bannerImg = `${baseUrl}/assets/img/og-beach.jpg`;
  } else if (banner === 'saibro') {
    pageTitle = '🎾 Tênis: Preparação Física & Aulas no Saibro | Felipe Martins';
    pageDesc = 'Footwork, precisão e potência nos golpes com acompanhamento presencial em Jundiaí e região.';
    bannerImg = `${baseUrl}/assets/img/og-saibro.jpg`;
  } else if (banner === 'saque') {
    pageTitle = '⚡ Potência no Saque e Forehand | Personal Felipe Martins';
    pageDesc = 'Mais velocidade de bola através da biomecânica correta e zero dores no cotovelo e ombro.';
    bannerImg = `${baseUrl}/assets/img/og-saque.jpg`;
  } else if (banner === 'personal') {
    pageTitle = '💪 Personal Trainer Felipe Martins | Preparador Físico';
    pageDesc = 'Acompanhamento presencial exclusivo com CREF ativo em Jundiaí e região. Agende sua aula experimental.';
    bannerImg = `${baseUrl}/assets/img/og-personal.jpg`;
  } else if (banner === 'remada') {
    pageTitle = '🛡️ Prevenção de Tennis Elbow & Força | Felipe Martins';
    pageDesc = 'Blindagem articular do cotovelo e manguito com preparação física personalizada.';
    bannerImg = `${baseUrl}/assets/img/og-remada.jpg`;
  }

  const redirectUrl = `/?src=grupo_tenis${modalidade ? '&m=' + encodeURIComponent(modalidade) : ''}${banner && banner !== 'tenistas' ? '&b=' + encodeURIComponent(banner) : ''}`;
  const canonicalUrl = banner && banner !== 'tenistas' ? `${baseUrl}/c/${banner}` : `${baseUrl}/c`;

  // Detecção de Scraper/Robô (WhatsApp, Facebook, Twitter, Telegram, etc.)
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|applebot|googlebot|bingbot|yandex|pinterest/i.test(ua);

  // Se for usuário real (não robô), vai DIRETO para a página de destino (Zero telas intermediárias)
  if (!isBot) {
    if (typeof res.redirect === 'function') {
      return res.redirect(302, redirectUrl);
    }
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  // Se for bot/crawler do WhatsApp/redes sociais, entrega apenas as metatags Open Graph para gerar o card
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>

  <!-- Open Graph Obrigatório para WhatsApp / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Personal Tênis • Felipe Martins" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${pageDesc}" />
  <meta name="description" content="${pageDesc}" />
  <meta property="og:image" content="${bannerImg}" />
  <meta property="og:image:secure_url" content="${bannerImg}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1024" />
  <meta property="og:image:height" content="1024" />
  <meta property="og:image:alt" content="Personal para Tenistas" />
  <link rel="image_src" href="${bannerImg}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${pageDesc}" />
  <meta name="twitter:image" content="${bannerImg}" />

  <meta http-equiv="refresh" content="0;url=${redirectUrl}" />
  <script>
    window.location.replace('${redirectUrl}');
  </script>
</head>
<body style="background:#020617;margin:0;"></body>
</html>`;

  if (typeof res.status === 'function' && typeof res.send === 'function') {
    res.status(200).send(html);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  }
};
