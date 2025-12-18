# Contributing Guidelines – DanceArena

Zahvaljujemo na interesu za doprinos projektu **DanceArena**.  
Ovaj dokument definira osnovna pravila i smjernice za suradnju, doprinos i održavanje kvalitete koda i dokumentacije.

---

## Opći principi

Cilj projekta **DanceArena** je razvoj web platforme za upravljanje plesnim natjecanjima.  
Dosljednost u načinu rada, komunikaciji i strukturi koda ključni su za održivost i kvalitetu projekta.  
Svi doprinosi moraju biti **jasno dokumentirani**, **testirani** i **odobreni** prije spajanja u glavnu granu (`main`).

---

## Uloge i odgovornosti

| Član tima | Uloga / Glavne odgovornosti |
|------------|-----------------------------|
| **Kristijan Karanušić** | Dokumentacija (Wiki, dijagrami, baze podataka) |
| **Roko Čačija** | Backend razvoj (Django, PayPal integracija) |
| **Luka Golub** | Backend razvoj (Django, OAuth integracija) |
| **Šimun Vrsalović** | Frontend razvoj (React, Vite) |
| **Luka Rako** | Frontend razvoj (React, Figma), Dokumentacija |
| **Karlo Višnjovski** | Frontend razvoj (React), testiranje i održavanje repozitorija |

---

## Pravila za doprinos kodu

1. **Rad u vlastitim granama**  
   - Koristiti konvenciju imenovanja:  
     `feature/naziv-funkcionalnosti`, `fix/kratak-opis`, `docs/naziv-dokumenta`

2. **Commit poruke**  
   - Formatirati kratko i jasno:  
     ```
     [KATEGORIJA] Kratak opis promjene
     ```
     Primjeri:  
     `[FEATURE] Dodana funkcionalnost prijave putem OAuth`  
     `[FIX] Ispravljena validacija ocjene prilikom unosa`

3. **Pull Request (PR)**  
   - Svaki PR mora sadržavati opis i povezan Issue (ako postoji).  
   - Najmanje **jedan član tima** mora odobriti PR prije spajanja.  
   - Direktno spajanje u `main` nije dopušteno.

4. **Kvaliteta koda i testiranje**  
   - Kod mora prolaziti sve testove prije spajanja.  
   - Nove funkcionalnosti trebaju imati odgovarajuće testove i dokumentaciju.

---

## Dokumentacija

- Svaka nova funkcionalnost mora biti opisana u **Wiki** dokumentaciji.  
- Dijagrami (UML, ERD, sekvencijski) ažuriraju se nakon promjena u modelima.  
- `README.md`, `CONTRIBUTING.md` i baze podataka održavaju se konzistentnima s trenutnim stanjem aplikacije.  
- Kristijan Karanušić i Luka Rako odgovorni su za finalnu provjeru i ažuriranje dokumentacije.

---

## Komunikacija

- Službeni kanali: **GitHub Issues** i **Discord grupa tima**  
- Za svaki bug, zadatak ili prijedlog otvara se **Issue** s kratkim i jasnim opisom.  
- Prije otvaranja novog Issue-a provjeriti postoji li već isti ili sličan.

---

## Proces odobravanja doprinosa

1. Otvoriti **Issue** ili **Pull Request**.  
2. Zatražiti **code review** od člana tima koji nije autor promjene.  
3. Nakon testiranja i odobrenja, PR se može spojiti u `main`.  

---

## Verzije i revizije

Projekt se razvija u iteracijama prema revizijama.  
Svaka revizija mora sadržavati:
- ažuriran changelog,  
- revidirane dijagrame i dokumentaciju,  
- verzijski tag u repozitoriju (npr. `v1.0`, `rev1.1`).

---

**DanceArena Team – FER 2025**  
Kristijan Karanušić • Roko Čačija • Luka Golub • Šimun Vrsalović • Luka Rako • Karlo Višnjovski
