module.exports = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'personaltenis.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const { modalidade, banner } = req.query || {};

  let pageTitle = '🎾 Preparação Física & Aulas de Tênis | Personal Felipe Martins';
  let pageDesc = 'Evolua seu jogo de Tênis e Beach Tennis: Mais potência no saque e forehand, fôlego para 3 sets e zero dores no cotovelo e ombro.';
  let bannerImg = `${baseUrl}/assets/img/banner-tenis.jpg`;

  if (modalidade === 'beach' || modalidade === 'beachtennis') {
    pageTitle = '🏖️ Beach Tennis: Preparação Física & Aulas | Felipe Martins';
    pageDesc = 'Ganhe agilidade na areia, potência nos smashes e condicionamento para jogos intensos sem lesões.';
    bannerImg = `${baseUrl}/assets/img/banner-beach-tennis.jpg`;
  } else if (banner === 'biomecanica') {
    bannerImg = `${baseUrl}/assets/img/banner-tenis-biomecanica.jpg`;
  }

  const redirectUrl = `/?src=grupo_tenis${modalidade ? '&m=' + encodeURIComponent(modalidade) : ''}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache CDN para resposta instantânea ao scraper do WhatsApp
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>

  <!-- Open Graph / WhatsApp Preview Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${pageDesc}" />
  <meta name="description" content="${pageDesc}" />
  <meta property="og:image" content="${bannerImg}" />
  <meta property="og:image:secure_url" content="${bannerImg}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <meta property="og:image:alt" content="Preparação Física e Aulas de Tênis" />
  <meta property="og:site_name" content="Personal Tênis • Felipe Martins" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${pageDesc}" />
  <meta name="twitter:image" content="${bannerImg}" />

  <!-- Redirecionamento instantâneo para o Funil de Landing Page -->
  <script>
    window.location.replace('${redirectUrl}');
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  </noscript>
</head>
<body style="background:#020617;color:#94a3b8;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;">
  <div>
    <div style="font-size:36px;margin-bottom:12px;">🎾</div>
    <div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:6px;">Personal Tênis & Beach Tennis</div>
    <div style="font-size:14px;color:#34d399;">Carregando seu teste e estratégia de jogo...</div>
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
