# DanceArena

## Opis projekta

**DanceArena** je web platforma za organizaciju i upravljanje plesnim natjecanjima.  
Cilj sustava je digitalizirati proces organizacije natjecanja i omogućiti jednostavnu suradnju svih sudionika:

- **Organizatori** kreiraju natjecanja, definiraju kategorije i upravljaju prijavama.  
- **Voditelji klubova** prijavljuju grupe i uplaćuju kotizacije.  
- **Suci** ocjenjuju nastupe i generiraju rezultate.  
- **Gledatelji** pregledavaju javne rang-liste.  
- **Administratori** održavaju sustav i upravljaju korisnicima.

Prijava korisnika vrši se putem **Google OAuth 2.0** servisa, a kartična plaćanja članarina i kotizacija obavljaju se preko **PayPal** sustava.

---

## Funkcijski zahtjevi (sažetak)

- Prijava korisnika putem **Google OAuth 2.0**  
- Upravljanje korisnicima i postavljanje cijene članstva  
- Kreiranje i uređivanje natjecanja, odabir sudaca i zaključavanje prijava  
- Prijava nastupa i učitavanje glazbenih datoteka  
- Ocjenjivanje nastupa i generiranje PDF startne liste  
- Automatski izračun bodova i prikaz rang-liste  
- Promjena vizualne teme korisničkog sučelja  

---

## Nefunkcijski zahtjevi

- Responzivan dizajn za desktop, tablet i mobilne uređaje  
- Obrada zahtjeva unutar 1 sekunde  
- Baza podataka normalizirana do 3NF  
- Podrška za minimalno 100 istovremenih korisnika  

---

## Tehnologije

**Backend:** Python (Django)  
**Frontend:** React, Vite  
**Dizajn:** Figma  
**Autentifikacija:** OAuth 2.0 (Google)  
**Plaćanja:** PayPal API  
**Baza podataka:** PostgreSQL  

---

## Arhitektura sustava

DanceArena koristi **klijent–poslužitelj** arhitekturu.  
Frontend (React) i backend (Django) razvijaju se neovisno, što omogućuje jednostavno testiranje, skaliranje i nadogradnju sustava.  
Sustav se oslanja na REST API za komunikaciju između klijenta i poslužitelja.

---

## Dionici

| Uloga | Opis |
|-------|------|
| Organizatori | Upravljaju natjecanjima i prijavama |
| Voditelji klubova | Prijavljuju nastupe i uplaćuju kotizacije |
| Suci | Ocjenjuju nastupe i unose rezultate |
| Gledatelji | Pregledavaju rezultate i poretke |
| Administratori | Upravljaju korisnicima i postavljaju članarine |

---

**Projekt:** *DanceArena – Sustav za upravljanje plesnim natjecanjima*  
**Kolegij:** Programsko inženjerstvo – FER  
**Zavod:** Elektronika, mikroelektronika, računalni i inteligentni sustavi
