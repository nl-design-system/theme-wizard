# Cookie Consent Drawer Pattern

Een pattern for het implementeren van een toegankelijke en gebruiksvriendelijke non-blocking cookie consent drawer in React, conform de richtlijnen van de [Autoriteit Persoonsgegevens](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners).

## Overzicht

Dit pattern toont hoe je een niet-blokkerende cookie consent drawer kunt implementeren die bovenaan de pagina verschijnt met drie acties:

- **Alle cookies accepteren** - Accepteert alle optionele cookies
- **Cookies weigeren** - Weigert alle optionele cookies
- **Link naar cookie-instellingen** - Voor gedetailleerde keuzes

Het pattern is **non-modal** (gebruikers kunnen de pagina nog steeds gebruiken) en gebruikt NL Design System componenten in combinatie met Utrecht Design System componenten.

## Quick Start

> [!NOTE]
> Dit is een **pattern** (geen installeerbaar component). Het toont een aanbevolen manier om NL Design System componenten samen te gebruiken for een cookie consent drawer. De code is bedoeld als voorbeeld om te kopiëren en aan te passen aan je eigen behoeften.

### Benodigde componenten

Dit pattern gebruikt de volgende componenten uit het NL Design System:

```bash
npm install @utrecht/component-library-react
npm install @nl-design-system-candidate/button-react
npm install @nl-design-system-candidate/heading-react
npm install @nl-design-system-candidate/link-react
```

of for css only implementatie

```bash
npm install @utrecht/component-library-css
npm install @nl-design-system-candidate/button-css
npm install @nl-design-system-candidate/heading-css
npm install @nl-design-system-candidate/link-css
```

### Componenten uit Utrecht Design System

Het pattern gebruikt bestaande componenten uit de NL Design System community:

- **`Drawer`** (Utrecht) - Voor de banner container
- **`Button`** (Candidate) - Voor alle knoppen (beide als secondary action for gelijkwaardige opties)
- **`ButtonGroup`** (Utrecht) - Voor het groeperen van knoppen
- **`Link`** (Candidate) - Voor links naar cookie-instellingen
- **`Heading`** (Candidate) - Voor de titel

> [!NOTE]
> Bekende tekortkomingen in community componenten worden vastgelegd in GitHub issues.

### Basis implementatie

```tsx
import { Button } from '@nl-design-system-candidate/button-react';
import { Heading } from '@nl-design-system-candidate/heading-react';
import { Link } from '@nl-design-system-candidate/link-react';
import { ButtonGroup, Drawer } from '@utrecht/component-library-react/dist/css-module';
import { useState } from 'react';

function CookieConsentDrawer() {
  ...
  return (
    <Drawer align="block-start" open style={{ position: 'static' }}>
      <Heading level={2}>Cookies op deze website</Heading>
      <Paragraph>
        We gebruiken cookies om deze website goed te laten werken en om gebruik van de website te analyseren.
      </Paragraph>
      <form
        method="dialog"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--basis-space-block-lg, 1.5rem)',
          marginBlockStart: 'var(--basis-space-block-xl, 2rem)',
        }}
      >
        <ButtonGroup>
          <Button purpose="secondary" onClick={handleAccept}>
            Alle cookies accepteren
          </Button>
          <Button purpose="secondary" onClick={handleReject}>
            Cookies weigeren
          </Button>
        </ButtonGroup>
        <Link href="/cookies">Cookie-instellingen</Link>
      </form>
    </Drawer>
  );
}
```

### Volledige implementatie

Zie for meer details:

- **Broncode**: `src/patterns/cookie-consent/Drawer/index.tsx`
- **Demo hook**: `src/patterns/cookie-consent/hooks/useCookieConsent.tsx` (localStorage, alleen for demo)

## API Reference

### Props van het voorbeeld pattern

De volledige implementatie (`src/patterns/cookie-consent/Drawer/index.tsx`) ondersteunt deze props:

| Prop                  | Type                             | Default                                                      | Beschrijving                        |
| --------------------- | -------------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| `buttonAccept`        | `string`                         | `'Alle cookies accepteren'`                           | Label accepteer knop                |
| `buttonReject`        | `string`                         | `'Cookies weigeren'`                             | Label weiger knop                   |
| `customizeLink`       | `{ href: string, text: string }` | `{ href: '/templates/cookies', text: 'Zelf instellen' }`     | Link naar cookie-instellingen       |
| `showLogo`            | `boolean`                        | -                                                            | Toon logo boven de titel            |
| `children`            | `React.ReactNode`                | -                                                            | Custom content                      |
| `clearStorageOnMount` | `boolean`                        | `false`                                                      | Wis localStorage bij mount (testen) |
| `title`               | `string`                         | -                                                            | Custom titel                        |

### State management

Het pattern vereist dat je zelf implementeert hoe consent voorkeuren worden opgeslagen en beheerd.

**Client-side (alleen for demo/testing):**

De repository bevat een `useCookieConsent` hook met localStorage (`src/patterns/cookie-consent/hooks/useCookieConsent.tsx`). Dit is **niet aanbevolen for productie**.

### Opslag van consent voorkeuren

**Voor productie**: Implementeer server-side opslag van consent voorkeuren (zie "State management" sectie for implementatiedetails).

**Voor demo/testing**: De repository bevat een `useCookieConsent` hook met localStorage. Dit is **niet geschikt for productie**.

### Bewaartermijn van consent cookies

**Aanbeveling**: Stel een bewaartermijn in van 12 maanden ([ePrivacy Directive](https://gdpr.eu/cookies/) best practice):

- Vernieuw consent regelmatig
- Vermeld bewaartermijn in je cookiebeleid
- Geef gebruikers mogelijkheid om consent in te trekken

### Progressive Enhancement

**Met JavaScript:**

- De drawer wordt alleen getoond wanneer er nog geen voorkeur is opgeslagen
- Voorkeuren worden opgeslagen (server-side aanbevolen)
- Automatisch herstellen van opgeslagen voorkeuren

**Zonder JavaScript:**

- De React implementatie rendert niet (retourneert `null` wanneer `isVisible` false is)
- Voor een HTML-only implementatie die werkt zonder JavaScript, zie `static/cookie-drawer.html`

### Styling aanpassen

Het pattern gebruikt CSS custom properties (design tokens) for spacing:

- `--basis-space-block-*` - Voor verticale spacing

Je kunt deze aanpassen door de design tokens te overschrijven in je eigen CSS.

#### Scrollbare content sectie

De content sectie (waar de `children` worden weergegeven) heeft een maximale hoogte van 200px en wordt automatisch scrollbaar wanneer de content deze hoogte overschrijdt. Dit voorkomt dat de cookie banner te hoog wordt en de pagina blokkeert.

**Belangrijk for toegankelijkheid:**

- De scrollbare sectie is volledig toegankelijk met keyboard navigatie
- Screen readers kunnen de volledige content lezen, ook wanneer deze scrollbaar is
- Zorg dat belangrijke informatie zichtbaar is zonder te scrollen wanneer mogelijk

**Aanpassen van de maximale hoogte:**

Als je de maximale hoogte wilt aanpassen, kun je de styling overschrijven:

```css
.cookie-consent-content {
  max-height: 200px; /* Pas aan naar je voorkeur */
  overflow-y: auto;
}
```

Of in React met inline styles:

```tsx
<CookieConsentDrawer>
  <div style={{ maxBlockSize: '200px', overflowBlock: 'auto' }}>{/* Je content */}</div>
</CookieConsentDrawer>
```

## Toegankelijkheid

### Acceptatiecriteria for toegankelijkheid

Wanneer je dit pattern implementeert, zorg ervoor dat je voldoet aan:

- [x] **WCAG 2.1 niveau AA** - Voldoet aan de Web Content Accessibility Guidelines
- [x] **Semantische HTML** - Gebruikt correcte HTML5 semantische elementen
- [x] **ARIA attributen** - Correct gebruik van ARIA attributen
- [x] **Keyboard navigatie** - Volledige navigatie mogelijk met alleen het toetsenbord (Tab, Shift+Tab, Enter, Space)
- [x] **Screen reader ondersteuning** - Compatibel met screen readers
- [x] **Kleurencontrast** - Voldoet aan WCAG contrast ratio's

### Acceptatiecriteria for toegankelijk gebruik

1. **Afzender identificatie** - Vermeld duidelijk de organisatienaam (bijv. "Cookies op de website van [organisatienaam]")
   - Een logo kan helpen bij de visuele identificatie van de organisatie
   - Het logo moet boven de titel staan, for de skip links
   - Zorg dat het logo toegankelijk is (zie "Logo's in cookie banners" hieronder)
2. **Duidelijke acties** - Gebruik actiegerichte button teksten, geen vage teksten zoals "OK"
3. **Toegankelijke positionering** - Zichtbaar zonder te scrollen, verberg geen belangrijke content. De cookie banner moet **voor** (boven) de skip links staan in de DOM volgorde en tab order, zodat gebruikers eerst de cookie banner tegenkomen voordat ze naar de skip links kunnen navigeren.
4. **Link naar meer informatie** - Voeg altijd een link toe naar de cookie-instellingen pagina
5. **Wettelijke plichten** - Gebruikers kunnen hun keuze wijzigen, voorkeuren worden opgeslagen

## Veelvoorkomende problemen

Hieronder een overzicht van de meestvoorkomende problemen met cookie banners en hoe deze te voorkomen:

### 1. Geen duidelijke keuze mogelijkheid

**Probleem**: Banner heeft alleen een "Accepteren" knop, geen mogelijkheid om te weigeren.

**Oplossing**: Zorg altijd for minimaal twee opties:

- Accepteren
- Weigeren
- Cookie-instellingen aanpassen

### 2. Dark patterns

**Probleem**: Gebruik van manipulerende technieken zoals:

- Grote "Accepteren" knop, kleine "Weigeren" link
- Moeilijk te vinden weiger optie
- Automatisch accepteren na X seconden

**Oplossing**: Gebruik gelijkwaardige styling for beide opties. Geen automatische acceptatie.

### 3. Geen mogelijkheid om voorkeuren te wijzigen

**Probleem**: Gebruikers kunnen hun keuze niet meer aanpassen na de eerste keuze.

**Oplossing**: Bied altijd een link naar cookie-instellingen waar gebruikers hun voorkeuren kunnen wijzigen.

### 4. Onduidelijke teksten

**Probleem**: Vage of technische teksten die gebruikers niet begrijpen.

**Oplossing**: Gebruik heldere, eenvoudige taal. Leg uit wat cookies zijn en waarom ze gebruikt worden.

### 5. Geen identificatie van afzender

**Probleem**: Gebruikers weten niet wie de website beheert.

**Oplossing**: Identificeer duidelijk de organisatie in de banner tekst.

### 6. Toegankelijkheidsproblemen

**Probleem**: Banner is niet toegankelijk for screen readers of keyboard gebruikers.

**Oplossing**: Zie "Toegankelijkheid" sectie for acceptatiecriteria.

### 7. Geen link naar meer informatie

**Probleem**: Geen link naar cookie-instellingen.

**Oplossing**: Voeg altijd een link toe naar de cookie-instellingen pagina.

## Aanpassingen for productie

Voor productie-gebruik:

1. **Implementeer server-side state management** - Zie "State management" sectie for details
2. **Stel server-side cookies in** - Zie "Bewaartermijn van consent cookies" for aanbevelingen (12 maanden)
3. **HTML-only variant for progressive enhancement** - Zie `static/cookie-drawer.html` for een voorbeeld dat werkt zonder JavaScript

## Logo's in cookie banners

Het gebruik van een logo in een cookie banner kan helpen bij de visuele identificatie van de organisatie en verhoogt het vertrouwen van gebruikers. Hieronder vind je richtlijnen for het correct gebruik van logo's.

### Waarom een logo gebruiken?

- **Visuele identificatie** - Gebruikers herkennen de organisatie sneller
- **Vertrouwen** - Een bekend logo verhoogt het vertrouwen in de cookie banner
- **Consistentie** - Het logo zorgt for visuele consistentie met de rest van de website
- **Professionaliteit** - Een goed geplaatst logo verhoogt de professionaliteit van de banner

### Toegankelijkheidsvereisten for logo's

Wanneer je een logo toevoegt aan je cookie banner, zorg ervoor dat:

1. **Alt-tekst** - Gebruik altijd een beschrijvende `alt` tekst for het logo:

   ```tsx
   <img src="/logo.svg" alt="Logo van [Organisatienaam]" />
   ```

2. **SVG logo's** - Voor SVG logo's, gebruik `aria-label` of `aria-labelledby`:

   ```tsx
   <svg aria-label="Logo van [Organisatienaam]">{/* SVG content */}</svg>
   ```

3. **Decoratief logo** - Als het logo puur decoratief is en de organisatienaam al in de tekst staat, gebruik `alt=""`:

   ```tsx
   <img src="/logo.svg" alt="" />
   ```

4. **Link functionaliteit** - Het logo kan optioneel linken naar de homepage:
   - Gebruik `href="/"` om naar de homepage te linken
   - Zorg dat the link toegankelijk is for screen readers

5. **Grootte** - Houd het logo compact:
   - Maximaal ~50-60px hoog wordt aanbevolen
   - Zorg dat het logo niet te groot is en de banner niet domineert
   - Het logo moet proportioneel zijn ten opzichte van de tekst

6. **Positionering** - Het logo moet:
   - Boven de titel staan
   - Voldoende spacing hebben for leesbaarheid

### Best practices

- **Consistentie** - Gebruik hetzelfde logo als op de rest van de website
- **Kwaliteit** - Zorg for een scherp logo in hoge resolutie (for retina displays)
- **Formaat** - Gebruik SVG for schaalbaarheid, of PNG/JPG met voldoende resolutie
- **Kleuren** - Zorg dat het logo goed zichtbaar is op de achtergrondkleur van de banner
- **Responsive** - Test het logo op verschillende schermformaten

### Voorbeeld implementatie

```tsx
<CookieConsentDrawer title="Cookies op de website van [Organisatie]">
  <div style={{ marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)' }}>
    <Link href="/">
      <img src="/logo.svg" alt="Logo van [Organisatienaam]" style={{ maxBlockSize: '50px', inlineSize: 'auto' }} />
    </Link>
  </div>
  <Paragraph>We gebruiken cookies om deze website goed te laten werken...</Paragraph>
</CookieConsentDrawer>
```

## Browser ondersteuning

Het pattern gebruikt moderne webstandaarden:

- React 18+
- Utrecht Design System React componenten
- Server-side of client-side state management (naar eigen keuze)

## Juridische context en wetgeving

Deze sectie bevat belangrijke juridische informatie over cookie consent. Deze informatie is relevant for het opstellen van je cookiebeleid en het bepalen van je implementatiestrategie.

### Inspiratiebronnen

- **[GOV UK](https://www.gov.uk/)** - Voorbeeld van een toegankelijke en gebruiksvriendelijke cookie consent implementatie

### Officiële richtlijnen en wetgeving

- **[Autoriteit Persoonsgegevens - Heldere cookiebanners](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners)** - Officiële richtlijnen for cookie banners in Nederland
- **[Rijksoverheid - Mag een website ongevraagd cookies plaatsen?](https://www.rijksoverheid.nl/onderwerpen/telecommunicatie/vraag-en-antwoord/mag-een-website-ongevraagd-cookies-plaatsen)** - Nederlandse cookiewet en uitleg over wanneer toestemming nodig is
- **[Business.gov.nl - Cookies on your website](https://business.gov.nl/regulations/cookies/)** - Officiële informatie over cookievereisten for ondernemers in Nederland
- **[GDPR.eu - Cookies, the GDPR, and the ePrivacy Directive](https://gdpr.eu/cookies/)** - Uitleg over cookies in relatie tot GDPR en ePrivacy Directive
- **[AVG/GDPR](https://www.autoriteitpersoonsgegevens.nl/)** - Algemene Verordening Gegevensbescherming

### Wanneer is toestemming nodig?

Volgens de [cookiewet](https://www.rijksoverheid.nl/onderwerpen/telecommunicatie/vraag-en-antwoord/mag-een-website-ongevraagd-cookies-plaatsen) moeten websites bezoekers toestemming vragen for plaatsing van cookies, met uitzondering van cookies die niet privacygevoelig zijn.

#### Cookies waarvoor geen toestemming nodig is

Voor cookies die geen of weinig inbreuk op de privacy maken, is geen toestemming van de bezoeker nodig ([Business.gov.nl](https://business.gov.nl/regulations/cookies/)):

- **Functionele cookies** - Noodzakelijk om een dienst of webshop te laten functioneren, zoals bestanden die bijhouden wat er in een winkelwagentje zit.
- **Analytische cookies** - Voor het verzamelen van anonieme informatie over het gebruik van je website. De informatie wordt alleen gebruikt om de kwaliteit en functionaliteit van je website te verbeteren. **Belangrijk**: Je moet bezoekers nog steeds informeren over deze cookies, ook al is geen toestemming nodig.
- **A/B testing cookies** - Gebruikt om te bepalen welke versie van een advertentie of website meer gewaardeerd wordt door bezoekers.
- **Affiliate cookies / performance cookies** - Gebruikt om te bepalen welke advertentie the aankoopbeslissing van de consument beïnvloedt.

> [!NOTE]
> Let op: Hoewel analytische cookies vaak geen toestemming vereisen, kan dit afhangen van de specifieke implementatie en of gegevens worden gedeeld met derden. Bij twijfel is het altijd beter om toestemming te vragen. Volgens de [ePrivacy Directive](https://gdpr.eu/cookies/) moet je for alle cookies behalve strikt noodzakelijke cookies toestemming krijgen.

#### Cookies waarvoor altijd toestemming nodig is

**Tracking cookies** vereisen altijd expliciete toestemming ([Business.gov.nl](https://business.gov.nl/regulations/cookies/)). Deze cookies:

- Houden individueel websitegedrag bij
- Stellen profielen op for bijvoorbeeld gerichte advertenties
- Maken inbreuk op de privacy
- Kunnen gevoelige persoonsgegevens verzamelen en vallen daarom onder de privacyregels (GDPR)

**Marketing cookies** vereisen ook altijd toestemming. Deze cookies:

- Volgen je online activiteit om advertenties relevanter te maken
- Beperken hoe vaak je een advertentie ziet
- Kunnen informatie delen met andere organisaties of adverteerders
- Zijn meestal persistent cookies van derde partijen

### Wanneer is een cookies pagina verplicht?

Volgens de AVG/GDPR is een cookies pagina (cookiebeleid) verplicht wanneer je:

- **Tracking cookies gebruikt** - Cookies die individueel gedrag bijhouden
- **Gegevens deelt met derden** - Bijvoorbeeld analytics providers, advertentie netwerken, of andere externe diensten
- **Persoonsgegevens verwerkt** - Bij plaatsing van cookies waarbij persoonsgegevens worden verwerkt (bijvoorbeeld bij banken)
- **Anonieme tracking gebruikt** - Zelfs anonieme gegevens kunnen als persoonsgegevens worden beschouwd onder de AVG wanneer ze worden gedeeld met derden

> [!IMPORTANT]
> Zelfs wanneer je tracking volledig anoniem is en geen directe persoonlijke informatie verzamelt, moet je volgens de AVG een cookiebeleid hebben als je gegevens deelt met derden (zoals Google Analytics, advertentie netwerken, etc.). Bij verwerking van persoonsgegevens bij plaatsing van cookies is de [AVG](https://www.rijksoverheid.nl/onderwerpen/telecommunicatie/vraag-en-antwoord/mag-een-website-ongevraagd-cookies-plaatsen) van toepassing.

### Wat moet er in je cookiebeleid staan?

Volgens [Business.gov.nl](https://business.gov.nl/regulations/cookies/) moet je bij het vragen om toestemming for cookies de volgende informatie vermelden:

1. **Welke cookies worden gebruikt**
   - Essentiële cookies (altijd toegestaan)
   - Functionele cookies
   - Analytics cookies
   - Marketing/tracking cookies

2. **Welke gegevens worden verzameld**
   - Type gegevens (bijvoorbeeld: IP-adres, browsertype, bezochte pagina's)
   - Of gegevens anoniem zijn of niet
   - Of gegevens kunnen leiden tot identificatie van personen

3. **Voor welke doeleinden**
   - Waarom worden cookies gebruikt?
   - Wat is het doel van de dataverzameling?

4. **Met wie worden gegevens gedeeld**
   - Welke derde partijen ontvangen gegevens?
   - Namen van de diensten (bijvoorbeeld: Google Analytics, Facebook Pixel)
   - Doeleinden van het delen

5. **Hoe lang worden gegevens bewaard**
   - Bewaartermijn van cookies (zie "Bewaartermijn van consent cookies" for aanbevelingen)
   - Bewaartermijn van verzamelde gegevens

6. **Rechten van gebruikers**
   - Recht om toestemming in te trekken
   - Recht om gegevens te verwijderen
   - Hoe gebruikers hun voorkeuren kunnen wijzigen

7. **Contactinformatie**
   - Wie is verantwoordelijk for de dataverwerking?
   - Contactgegevens for vragen over cookies

### Anonieme tracking en delen met derden

Ook bij anonieme tracking moet je dit vermelden als je gegevens deelt met derden:

- Vermeld expliciet dat tracking anoniem is
- Leg uit wat "anoniem" betekent
- Vermeld alle derde partijen die gegevens ontvangen
- Geef aan of anonieme gegevens kunnen worden gecombineerd om personen te identificeren

### Vereisten for toestemming

Volgens [Business.gov.nl](https://business.gov.nl/regulations/cookies/) en [ePrivacy Directive](https://gdpr.eu/cookies/):

- Duidelijk zichtbare keuze bieden
- Bewijs van toestemming kunnen tonen
- Toegang bieden bij weigering
- Toestemming net zo makkelijk kunnen intrekken

**NIET geldig:**

- Onduidelijke informatie in voorwaarden
- Geen actieve toestemming vereisen
- Vooraf aangevinkte vakjes
- Cookiewall

### Link naar cookiebeleid

Je cookiebeleid moet:

- Toegankelijk zijn via een element dat op elke pagina staat (bijv. een footer).
- Altijd beschikbaar zijn
- Up-to-date zijn
- Begrijpelijk zijn (heldere taal, geen juridisch jargon)
- Accurate en specifieke informatie bevatten ([GDPR.eu](https://gdpr.eu/cookies/))

## Referenties

### Technische documentatie

- **[Utrecht Design System](https://www.utrecht.nl/)** - Design system componenten
- **[Utrecht Components React](https://github.com/nl-design-system/utrecht/tree/main/packages/components-react)** - React componenten uit de community

### Toegankelijkheid

- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Web Content Accessibility Guidelines
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Best practices for ARIA gebruik
