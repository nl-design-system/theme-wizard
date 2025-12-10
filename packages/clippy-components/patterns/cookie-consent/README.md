# Cookie Consent Pattern

Dit pattern biedt een toegankelijke en gebruiksvriendelijke implementatie van een cookiebanner en cookie-instellingen pagina, conform de richtlijnen van de [Autoriteit Persoonsgegevens](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners).
Er is onderzoek gedaan naar de best practices omtrent een cookie banner en dit patroon haalt inspiratie uit de volgende cookie consent dialogen:

1. [GOV UK](https://www.gov.uk/)
2. ...
3. ...

<br>
## Overzicht

Cookie consent kan op verschillende manieren geimplementeerd worden, maar wij raden de volgende patterns aan indien er gebruik gemaakt moet worden van een cookie consent dialoog.

### Banner componenten

1. **Drawer** (`cookie-drawer.html`) - Non-modal banner bovenaan de pagina
2. **Modal** (`cookie-modal.html`) - Modal banner met focus trap

### Formulieren en/of pagina's

1. **Cookie Form** (`cookie-form.html`) - Herbruikbaar formulier voor cookie-instellingen
2. **Cookies Page** (`cookies-page.html`) - Volledige pagina die het formulier bevat

## Drawer

Een niet-blokkerende banner bovenaan de pagina met twee knoppen:

- **Aanvullende cookies accepteren** - Accepteert alle optionele cookies
- **Aanvullende cookies weigeren** - Weigert alle optionele cookies
- Link naar cookie-instellingen pagina voor gedetailleerde keuzes

Deze variant is geïmplementeerd in `cookie-drawer.html` en is **non-modal** (gebruikers kunnen de pagina nog steeds gebruiken).

**Features:**

- Gebruikt het HTML `<dialog>` element met `utrecht-drawer` class
- Gebruikt `utrecht-button` componenten voor de actieknoppen
- Slaat gebruikersvoorkeuren op in `localStorage`
- Toont de drawer alleen wanneer er nog geen voorkeur is opgeslagen
- Altijd bovenaan de pagina gepositioneerd
- Kan scrollen wanneer er veel content is (automatisch via CSS)
- **Non-modal** - gebruikers kunnen de pagina nog steeds gebruiken
- Identificeert de afzender van de website (via `organization` attribuut)

**Attributen:**

- `organization="[Naam]"` - Identificeert de organisatie in de banner tekst

## Modal

Een blokkerend modal dialog in het midden van de pagina met twee knoppen:

- **Aanvullende cookies accepteren** - Accepteert alle optionele cookies
- **Aanvullende cookies weigeren** - Weigert alle optionele cookies
- Link naar cookie-instellingen pagina voor gedetailleerde keuzes

- Gebruikt het HTML `<dialog>` element met `showModal()` voor native modal gedrag
- Gebruikt `utrecht-button` componenten voor de actieknoppen
- Slaat gebruikersvoorkeuren op in `localStorage`
- Toont de modal alleen wanneer er nog geen voorkeur is opgeslagen
- Kan scrollen wanneer er veel content is (automatisch via CSS)
- **Modal** - blokkeert interactie met de achtergrond tot een keuze is gemaakt
- **Focus trap** - focus kan de modal niet verlaten, Tab op laatste element springt terug naar eerste element
- **ESC key** - sluit de modal (zonder voorkeur op te slaan)
- Identificeert de afzender van de website (via `organization` attribuut)

Deze variant is geïmplementeerd in `cookie-modal.html` en is **modal** (blokkeert interactie met de achtergrond).

**Attributen:**

- `organization="[Naam]"` - Identificeert de organisatie in de banner tekst

## Cookie Form (`cookie-form.html`)

Het `cookie-form.html` component is het hart van het cookie consent pattern. Het is een herbruikbaar formulier dat in elke context kan worden gebruikt:

- Als onderdeel van een cookie-instellingen pagina
- Binnen een drawer voor uitgebreide instellingen
- Binnen een modal voor gedetailleerde keuzes

**Attributen:**

- `input-type="radio"` (standaard) - Gebruikt radio buttons voor aan/uit keuzes
- `input-type="checkbox"` - Gebruikt checkboxes voor individuele keuzes

**Features:**

- Toegankelijk formulier met radio buttons
- Gebruikt `utrecht-form-fieldset`, `utrecht-form-field`, en `utrecht-radio-button` componenten
- Slaat voorkeuren op in `localStorage` (dezelfde key als de banner)
- Toont een waarschuwing wanneer JavaScript is uitgeschakeld
- Toont success message na opslaan (blijft zichtbaar tot pagina vernieuwd wordt)
- Gebruikt Utrecht Design System componenten voor consistente styling

**Voorbeeld gebruik:**

```html
<!-- Met radio buttons (standaard) -->
<clippy-cookie-form></clippy-cookie-form>

<!-- Met checkboxes -->
<clippy-cookie-form input-type="checkbox"></clippy-cookie-form>
```

**Event handling:**

```javascript
document.addEventListener('cookie-preferences-saved', (event) => {
  console.log('Voorkeuren opgeslagen:', event.detail.preferences);
  // Bijvoorbeeld: sluit de dialog
  dialog.close();
});
```

## Cookies Page (`cookies-page.html`)

De `cookies-page.html` component is een **volledige pagina** voor cookie-instellingen. Het gebruikt intern het `cookie-form.html` component.

**Attributen:**

- `input-type="radio"` (standaard) - Gebruikt radio buttons
- `input-type="checkbox"` - Gebruikt checkboxes
- `organization="[Naam]"` - Past de paginatitel aan

**Features:**

- Volledige pagina met intro tekst
- "Meer over cookies" sectie met link naar Autoriteit Persoonsgegevens
- Noscript waarschuwing

**Voorbeeld gebruik:**

```html
<clippy-cookies-page></clippy-cookies-page>

<clippy-cookies-page input-type="checkbox" organization="Gemeente Utrecht"></clippy-cookies-page>
```

## Hergebruik van Utrecht Design System componenten

De cookie banner maakt gebruik van bestaande componenten uit de Utrecht Design System community:

- **`utrecht-drawer`** - Voor de banner container (drawer component)
- **`utrecht-button`** - Voor alle knoppen (primary en secondary action)
- **`utrecht-link`** - Voor links naar cookie-instellingen en externe informatie
- **`utrecht-heading-*`** - Voor alle koppen (h1, h2, h3)
- **`utrecht-paragraph`** - Voor alle paragrafen
- **`utrecht-form-fieldset`** - Voor formulier groepen
- **`utrecht-form-field`** - Voor formulier velden
- **`utrecht-radio-button`** - Voor radio button inputs
- **`utrecht-alert`** - Voor waarschuwingen (bijvoorbeeld noscript)

> [!NOTE]
> Bekende tekortkomingen in community componenten worden vastgelegd in GitHub issues. Controleer de [Utrecht Design System repository](https://github.com/nl-design-system/utrecht) voor actuele informatie.

## Technische Details

### LocalStorage

Beide componenten gebruiken dezelfde `localStorage` key: `cookie-consent-preferences`

De opgeslagen data heeft het volgende formaat:

```json
{
  "preferences": ["analytics", "preferences"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Waarbij `preferences` een array is die kan bevatten:

- `"analytics"` - wanneer analytics cookies zijn geaccepteerd
- `"preferences"` - wanneer preference cookies zijn geaccepteerd

### Custom Elements

Alle componenten zijn geïmplementeerd als Web Components:

- `<clippy-cookie-consent-drawer>` - De non-modal cookiebanner
- `<clippy-cookie-consent-modal>` - De modal cookiebanner
- `<clippy-cookie-form>` - Herbruikbaar formulier voor cookie-instellingen
- `<clippy-cookies-page>` - Volledige cookie-instellingen pagina

### Progressive Enhancement en JavaScript

De componenten zijn gebouwd met progressive enhancement in gedachten:

**Zonder JavaScript:**

- De banner HTML is zichtbaar (zonder `hidden` attribuut in de basis HTML)
- Basis functionaliteit werkt (formulier kan worden verzonden)
- Links werken normaal
- Een `noscript` waarschuwing wordt getoond op de cookie-instellingen pagina

**Met JavaScript (enhancement):**

- De banner wordt alleen getoond wanneer er nog geen voorkeur is opgeslagen
- Voorkeuren worden opgeslagen in `localStorage`
- Modal functionaliteit wordt toegevoegd (indien gewenst)
- Formulier validatie en interactieve features
- Automatisch herstellen van opgeslagen voorkeuren

**Implementatie:**

- De component start met `hidden` attribuut
- JavaScript verwijdert `hidden` wanneer nodig
- Gebruik `<noscript>` voor fallback content
- Test altijd zonder JavaScript om te zorgen dat basis functionaliteit werkt

## Veelvoorkomende problemen met cookie banners

Hieronder een overzicht van de meestvoorkomende problemen met cookie banners en hoe deze te voorkomen:

### 1. Geen duidelijke keuze mogelijkheid

**Probleem**: Banner heeft alleen een "Accepteren" knop, geen mogelijkheid om te weigeren.

**Oplossing**: Zorg altijd voor minimaal twee opties:

- Accepteren
- Weigeren
- (Optioneel) Cookie-instellingen aanpassen

### 2. Pre-checked checkboxes

**Probleem**: Checkboxes voor optionele cookies zijn standaard aangevinkt.

**Oplossing**: Laat optionele cookies standaard uitgeschakeld. Alleen essentiële cookies mogen standaard aan staan.

### 3. Dark patterns

**Probleem**: Gebruik van manipulerende technieken zoals:

- Grote "Accepteren" knop, kleine "Weigeren" link
- Moeilijk te vinden weiger optie
- Automatisch accepteren na X seconden

**Oplossing**: Gebruik gelijkwaardige styling voor beide opties. Geen automatische acceptatie.

### 4. Geen mogelijkheid om voorkeuren te wijzigen

**Probleem**: Gebruikers kunnen hun keuze niet meer aanpassen na de eerste keuze.

**Oplossing**: Bied altijd een link naar cookie-instellingen waar gebruikers hun voorkeuren kunnen wijzigen.

### 5. Onduidelijke teksten

**Probleem**: Vage of technische teksten die gebruikers niet begrijpen.

**Oplossing**: Gebruik heldere, eenvoudige taal. Leg uit wat cookies zijn en waarom ze gebruikt worden.

### 6. Geen identificatie van afzender

**Probleem**: Gebruikers weten niet wie de website beheert.

**Oplossing**: Identificeer duidelijk de organisatie in de banner tekst.

### 7. Toegankelijkheidsproblemen

**Probleem**: Banner is niet toegankelijk voor screen readers of keyboard gebruikers.

**Oplossing**: Gebruik semantische HTML, ARIA attributen, en test met screen readers.

### 8. Geen link naar meer informatie

**Probleem**: Geen link naar cookie-instellingen of externe informatie.

**Oplossing**: Voeg altijd links toe naar:

- Cookie-instellingen pagina
- Externe informatie (bijvoorbeeld Autoriteit Persoonsgegevens)

### 9. Server-side tracking zonder toestemming

**Probleem**: Analytics of tracking scripts worden geladen voordat gebruiker toestemming heeft gegeven.

**Oplossing**: Laad tracking scripts alleen na expliciete toestemming. Gebruik server-side consent management.

### 10. Verouderde implementaties

**Probleem**: Gebruik van oude, niet-toegankelijke implementaties.

**Oplossing**: Gebruik moderne webstandaarden (`<dialog>`, Web Components) en test regelmatig.

### Scrollen in de banner

Wanneer de banner veel content bevat, scrollt deze automatisch. De component heeft standaard:

```css
.clippy-cookie-consent-drawer__dialog {
  max-height: 90vh;
  overflow-y: auto;
}
```

Dit zorgt ervoor dat de banner kan scrollen wanneer de content langer is dan 90% van de viewport hoogte.

## Aanpassingen

### Backend integratie

**Belangrijk**: De huidige implementatie slaat voorkeuren alleen op in `localStorage`. Voor een juridisch geldige cookie consent implementatie moet je:

1. De voorkeuren ook naar je backend sturen (bijvoorbeeld via een `fetch()` call)
2. Server-side cookies instellen op basis van de voorkeuren
3. Analytics en andere tracking scripts alleen laden wanneer de gebruiker toestemming heeft gegeven

### Styling aanpassen

De componenten gebruiken CSS custom properties (design tokens) voor spacing:

- `--basis-space-block-*` - Voor verticale spacing
- `--clippy-space-block-*` - Voor verticale spacing in de drawer
- `--clippy-space-column-*` - Voor spacing tussen buttons
- `--clippy-space-inline-*` - Voor horizontale spacing

Je kunt deze aanpassen door de design tokens te overschrijven in je eigen CSS.

### Teksten aanpassen

Alle teksten zijn direct in de HTML opgenomen en kunnen eenvoudig worden aangepast. Zorg ervoor dat je de structuur behoud van het patroon.

## Toegankelijkheid

### Acceptatiecriteria voor toegankelijkheid

De cookie banner component voldoet aan de volgende toegankelijkheidscriteria:

- [x] **WCAG 2.1 niveau AA** - Voldoet aan de Web Content Accessibility Guidelines
- [ ] **Semantische HTML** - Gebruikt correcte HTML5 semantische elementen (`<dialog>`, `<form>`, `<fieldset>`, `<legend>`, etc.)
- [ ] **ARIA attributen** - Correct gebruik van `aria-labelledby`, `aria-labelled`, en `role` attributen
- [ ] **Keyboard navigatie** - Volledige navigatie mogelijk met alleen het toetsenbord (Tab, Shift+Tab, Enter, Space, Esc)
- [ ] **Screen reader ondersteuning** - Compatibel met screen readers (NVDA, JAWS, VoiceOver)
- [ ] **Focus management** - Correct focus management in dialogs (autofocus op eerste actie, focus trap)
- [ ] **Kleurencontrast** - Voldoet aan WCAG contrast ratio's (minimaal 4.5:1 voor tekst)
- [ ] **Tekstalternatieven** - Alle niet-tekstuele content heeft alternatieve tekst
- [ ] **Formulier labels** - Alle formuliervelden hebben correct geassocieerde labels
- [ ] **Foutmeldingen** - Duidelijke foutmeldingen en validatie feedback

### Acceptatiecriteria voor toegankelijk gebruik

Wanneer je de cookie banner implementeert, zorg ervoor dat:

1. **Afzender identificatie**
   - De banner identificeert duidelijk wie de website beheert
   - Gebruik het `organization` attribuut om de organisatie naam in te stellen
   - Bijvoorbeeld: `<clippy-cookie-consent-drawer organization="Gemeente Utrecht">`
   - De component past automatisch de titel en intro tekst aan

2. **Duidelijke acties**
   - Gebruik duidelijke, actiegerichte button teksten
   - Vermijd vage teksten zoals "OK" of "Begrepen"
   - Gebruik in plaats daarvan: "Aanvullende cookies accepteren" en "Aanvullende cookies weigeren"

3. **Toegankelijke positionering**
   - Zichtbaar zonder te scrollen
   - Zorg dat de banner niet belangrijke content verbergt

4. **Modal vs. Non-modal**
   - Modal dialogs gebruiken `showModal()` voor automatische focus trap

5. **Scrollen**
   - Wanneer de banner veel content bevat, zorg dat deze kan scrollen
   - Gebruik `max-height` en `overflow-y: auto` voor lange content
   - Zorg dat scrollbare content toegankelijk is met keyboard

6. **Progressive Enhancement**
   - De banner werkt zonder JavaScript (toont basis functionaliteit)
   - JavaScript voegt extra functionaliteit toe (bijvoorbeeld modal gedrag)
   - Gebruik `<noscript>` voor gebruikers zonder JavaScript

7. **Link naar meer informatie**
   - Voeg altijd een link toe naar de cookie-instellingen pagina
   - Link naar externe informatie (bijvoorbeeld Autoriteit Persoonsgegevens)
   - Gebruik `rel="noreferrer"` voor externe links

8. **Wettelijke plichten**
   - Verwijs naar de [Autoriteit Persoonsgegevens richtlijnen](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners)
   - Zorg dat gebruikers hun keuze kunnen wijzigen
   - Sla voorkeuren op (lokaal of server-side)

## Browser ondersteuning

De componenten gebruiken moderne webstandaarden:

- Web Components (Custom Elements)
- `localStorage` API (alleen voor demo doeleinden)
- HTML5 `<dialog>` element

## Referenties

### Wettelijke verplichtingen

- **[Autoriteit Persoonsgegevens - Heldere cookiebanners](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners)** - Officiële richtlijnen voor cookie banners in Nederland
- **[AVG/GDPR](https://www.autoriteitpersoonsgegevens.nl/)** - Algemene Verordening Gegevensbescherming

### Technische documentatie

- **[Utrecht Design System](https://www.utrecht.nl/)** - Design system componenten
- **[Utrecht Components React](https://github.com/nl-design-system/utrecht/tree/main/packages/components-react)** - React componenten uit de community
- **[Checkbox Group React Component](https://github.com/nl-design-system/utrecht/blob/main/packages/components-react/checkbox-group-react/src/index.tsx)** - Voorbeeld implementatie van checkbox groups
- **[MDN - Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)** - Documentatie over het HTML dialog element
- **[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)** - Documentatie over Web Components

### Toegankelijkheid

- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Web Content Accessibility Guidelines
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Best practices voor ARIA gebruik
