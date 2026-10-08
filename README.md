# 🎾 Personal Felipe Martins - Link de Divulgação & Funil de Landing Page (Tênis & Beach Tennis)

Estrutura completa de link de divulgação com **Open Graph para WhatsApp**, simulador de mensagem para grupo e **Funil de Landing Page com Quiz Interativo** focado 100% em praticantes de **Tênis e Beach Tennis**.

---

## 🚀 Como Funciona o Fluxo do Lead

```
[Divulgação no Grupo do WhatsApp]
               ↓
   (Card com foto e headline)
               ↓
   [Link /c] (Open Graph + Redirect)
               ↓
[Funil da Landing Page (Quiz em 30s)]
  1. Modalidade (Tênis / Beach Tennis / Ambos)
  2. Prioridade (Potência / Fôlego / Dores / Técnica)
  3. Nível Atual (Iniciante / Intermediário / Avançado)
               ↓
[Diagnóstico Esportivo Personalizado]
               ↓
[WhatsApp do Personal (Mensagem Pronta com as Respostas)]
```

---

## 📁 Estrutura de Arquivos

- `public/`
  - `index.html`: Landing Page completa com Quiz Interativo, autoridade do personal, metodologia esportiva, FAQ e CTAs.
  - `divulgacao.html`: Painel para copiar o link oficial de divulgação, visualizar o card do WhatsApp em tempo real e copiar a copy pronta do grupo.
  - `whatsapp.html`: Página de transição suave para WhatsApp com contagem e redirecionamento.
  - `assets/img/`: Banners e fotos profissionais (`banner-tenis.jpg`, `banner-tenis-biomecanica.jpg`, `banner-beach-tennis.jpg`, fotos do Felipe Martins).
- `api/`
  - `c.js`: Serverless handler do link de divulgação com meta tags Open Graph dinâmicas/otimizadas para WhatsApp e redirecionamento para o funil.
- `server.js`: Servidor de desenvolvimento local em Node.js (sem dependências externas).
- `config.json`: Configurações centrais (WhatsApp, cidade, copies).
- `vercel.json`: Configuração de rotas limpas e deploy imediato na Vercel.

---

## 💻 Como Rodar Localmente

No terminal da pasta `E:\APLICATIVOS\PERSONALTENIS`:

```bash
node server.js
```

Acesse no navegador:
- **Painel de Divulgação (Pegar Link & Copiar Mensagem):** `http://localhost:3000/divulgacao`
- **Landing Page & Funil:** `http://localhost:3000/`
- **Link do WhatsApp Scraper:** `http://localhost:3000/c`

---

## 📱 Como Divulgar no Grupo de WhatsApp

1. Acesse o painel `/divulgacao` ou copie a mensagem padrão.
2. No seu WhatsApp, cole a mensagem com o link no topo.
3. Aguarde 2 segundos para o WhatsApp carregar a foto quadrada e a headline.
4. Envie!
