# EventFlow - Installation & Deployment

## STEG 1: Sätt in dina Supabase-nycklar

1. Öppna filen `src/supabaseClient.js`
2. Byt ut:
   - `DIN_SUPABASE_URL_HÄR` → din Project URL (typ: https://xxxxx.supabase.co)
   - `DIN_SUPABASE_ANON_KEY_HÄR` → din Publishable API Key

## STEG 2: Testa lokalt (valfritt)

Om du har Node.js installerat:
```bash
npm install
npm run dev
```

Öppna http://localhost:5173 i webbläsaren

## STEG 3: Deploya till Vercel

### A) Skapa GitHub Repository
1. Gå till https://github.com
2. Klicka "New repository"
3. Namn: `eventflow-app`
4. Klicka "Create repository"
5. I terminalen (från projektmappen):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-USERNAME/eventflow-app.git
git push -u origin main
```

### B) Deploya med Vercel
1. Gå till https://vercel.com
2. Klicka "New Project"
3. Importera ditt GitHub-repo "eventflow-app"
4. Klicka "Deploy"
5. Vänta 2-3 minuter
6. KLART! Du får en URL typ: https://eventflow-app.vercel.app

## STEG 4: Använd appen!

- Öppna URL:en på din dator
- Öppna samma URL på din mobil
- Skapa konto / Logga in
- Allt synkas automatiskt! 🎉

## Troubleshooting

**Problem: "Invalid API key"**
- Kolla att du kopierat rätt nycklar till `src/supabaseClient.js`
- Kolla att det inte finns extra mellanslag

**Problem: "Network error"**
- Kolla att Supabase-projektet är aktivt
- Kolla din internetanslutning

**Problem: Kan inte logga in**
- Kolla att du bekräftat email-adressen (kolla skräppost)
- Försök skapa ett nytt konto

## Support

Om något inte fungerar, kontakta mig så hjälper jag dig!
