# Construction Serras — Site test v3 (design plus clair) (FR/EN)

## Lancer en local (Windows)
1) Ouvrez PowerShell dans le dossier `serras_ideal_site_v2`
2) Lancez:
   python -m http.server 8080
3) Ouvrez:
   http://localhost:8080/

## FR/EN
- FR par défaut
- Toggle FR/EN en haut
- Le choix est mémorisé (localStorage)
- Param URL: ?lang=fr ou ?lang=en

## Chatbot IA local
- Placeholder en bas à droite
- Remplacer le contenu par votre widget (iframe/script)
- Ou brancher une API /chat (selon votre app)

## Formulaire
- Page: /pages/soumission.html
- Le submit est un mock (console.log)
- À remplacer par un POST vers votre endpoint (API) pour BATISCOPE/Soumission

## Images
- Images démo via Unsplash
- Remplacez par vos images réelles (avant/pdt/après) dès que prêt
