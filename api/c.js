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
  const banner = query.banner || 'saibro';

  let pageTitle = '🎾 Preparação Física & Aulas de Tênis | Personal Felipe Martins';
  let pageDesc = 'Fique mais rápido, ágil, resistente e previna lesões com preparação física específica. Vagas presenciais em Jundiaí e região.';
  let bannerImg = `${baseUrl}/assets/img/og-default.jpg`;

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
  } else if (banner === 'biomecanica') {
    bannerImg = `${baseUrl}/assets/img/og-default.jpg`;
  }

  const redirectUrl = `/?src=grupo_tenis${modalidade ? '&m=' + encodeURIComponent(modalidade) : ''}${banner ? '&b=' + encodeURIComponent(banner) : ''}`;
  const canonicalUrl = `${baseUrl}/c/${banner}`;

  // Detecção de Scraper/Robô (WhatsApp, Facebook, Twitter, Telegram, etc.)
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|discordbot/i.test(ua);

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
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <meta property="og:image:alt" content="Preparação Física e Aulas de Tênis" />
  <link rel="image_src" href="${bannerImg}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${pageDesc}" />
  <meta name="twitter:image" content="${bannerImg}" />

  ${!isBot ? `
  <!-- Redirecionamento instantâneo exclusivo para usuários reais -->
  <script>
    window.location.replace('${redirectUrl}');
  </script>
  ` : ''}
</head>
<body style="background:#020617;color:#94a3b8;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;">
  <div>
    <div style="font-size:36px;margin-bottom:12px;">🎾</div>
    <div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:6px;">Personal Tênis & Beach Tennis</div>
    <div style="font-size:14px;color:#34d399;margin-bottom:14px;">Carregando seu plano de jogo...</div>
    <a href="${redirectUrl}" style="color:#10b981;font-size:13px;text-decoration:underline;">Clique aqui para continuar</a>
  </div>
</body>
</html>`;

  if (typeof res.status === 'function' && typeof res.send === 'function') {
    res.status(200).send(html);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  }
};
