# Brøytelogg

Enkel logg-app for brøyteentreprenører. MVP for kundesamtaler.

**Funksjoner**
- Ett-trykks logging av brøyting og strøing per kunde
- Turmodus med GPS: tid, kjørt distanse og spor på kart
- Kunder sortert etter avstand når GPS er aktiv, ellers gruppert per rode
- Hindringsmerknader per kunde (kumlokk, hull)
- Fakturagrunnlag per kunde og periode, CSV-nedlasting
- Offline-støtte (service worker) og «Legg til på hjemskjerm» (PWA)

**Data** lagres i nettleserens localStorage på enheten. Backup/import som JSON under «Kunder».

**Drift**: statisk side, hostes på GitHub Pages. Ingen backend.
