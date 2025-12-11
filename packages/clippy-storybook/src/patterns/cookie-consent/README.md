# Cookie Consent Drawer Pattern

Een pattern voor het implementeren van een toegankelijke en gebruiksvriendelijke non-blocking cookie consent drawer in React, conform de richtlijnen van de [Autoriteit Persoonsgegevens](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners).

## Overzicht

Dit pattern toont hoe je een niet-blokkerende cookie consent drawer kunt implementeren die bovenaan de pagina verschijnt met drie acties:

- **Aanvullende cookies accepteren** - Accepteert alle optionele cookies
- **Aanvullende cookies weigeren** - Weigert alle optionele cookies
- **Link naar cookie-instellingen** - Voor gedetailleerde keuzes

Het pattern is **non-modal** (gebruikers kunnen de pagina nog steeds gebruiken) en gebruikt Utrecht Design System componenten.

## Quick Start

> [!NOTE]
> Dit is een **pattern** (geen installeerbaar component). Het toont een aanbevolen manier om Utrecht Design System componenten samen te gebruiken voor een cookie consent drawer. De code is bedoeld als voorbeeld om te kopiëren en aan te passen aan je eigen behoeften.

### Benodigde componenten

Dit pattern gebruikt de volgende Utrecht Design System componenten:

```bash
npm install @utrecht/component-library-react
```

of voor css only implementatie

```bash
npm install @utrecht/component-library-css
```

### Basis implementatie

```tsx
import { Drawer, Button, ButtonGroup, Link, Heading2, Paragraph } from '@utrecht/component-library-react';
import { useState } from 'react';

function CookieConsentDrawer() {
  ...
  return (
    <Drawer>
      <Heading2>Cookies op deze website</Heading2>
      <Paragraph>
        We gebruiken cookies om deze website goed te laten werken en om gebruik van de website te analyseren.
      </Paragraph>
      <ButtonGroup>
        <Button appearance="primary-action-button" onClick={handleAccept}>
          Aanvullende cookies accepteren
        </Button>
        <Button appearance="secondary-action-button" onClick={handleReject}>
          Aanvullende cookies weigeren
        </Button>
      </ButtonGroup>
      <Link href="/cookies">Cookie-instellingen</Link>
    </Drawer>
  );
}
```

### Volledige implementatie

Zie voor meer details:

- **Broncode**: `src/patterns/cookie-consent/Drawer/index.tsx`
- **Storybook**: [Cookie Consent Drawer stories](http://localhost:6006/?path=/docs/patterns-cookie-consent-drawer)
- **Demo hook**: `src/patterns/cookie-consent/hooks/useCookieConsent.tsx` (localStorage, alleen voor demo)

## API Reference

### Props van het voorbeeld pattern

De volledige implementatie (`src/patterns/cookie-consent/Drawer/index.tsx`) ondersteunt deze props:

| Prop                  | Type                             | Default                                                  | Beschrijving                        |
| --------------------- | -------------------------------- | -------------------------------------------------------- | ----------------------------------- |
| `buttonAccept`        | `string`                         | `'Aanvullende cookies accepteren'`                       | Label accepteer knop                |
| `buttonReject`        | `string`                         | `'Aanvullende cookies weigeren'`                         | Label weiger knop                   |
| `customizeLink`       | `{ href: string, text: string }` | `{ href: '/templates/cookies', text: 'Zelf instellen' }` | Link naar cookie-instellingen       |
| `children`            | `React.ReactNode`                | -                                                        | Custom content                      |
| `clearStorageOnMount` | `boolean`                        | `false`                                                  | Wis localStorage bij mount (testen) |
| `title`               | `string`                         | -                                                        | Custom titel                        |

### State management

Het pattern vereist dat je zelf implementeert hoe consent voorkeuren worden opgeslagen en beheerd.

**Client-side (alleen voor demo/testing):**

De repository bevat een `useCookieConsent` hook met localStorage (`src/patterns/cookie-consent/hooks/useCookieConsent.tsx`). Dit is **niet aanbevolen voor productie**.

## Hoe dit pattern te gebruiken

Dit is een **referentie implementatie** (geen npm package).

**Stappen:**

1. Bekijk de broncode in `src/patterns/cookie-consent/Drawer/` of de statische HTML in de Storybook omgeving voor een community compositie van componenten voor de cookie banner.
2. Kopieer de code naar je eigen project
3. Pas aan voor je eigen behoeften
4. Gebruik de best practices als richtlijn

## Best Practices & Technische Details

### Componenten uit Utrecht Design System

Het pattern gebruikt bestaande componenten uit de Utrecht Design System community:

- **`Drawer`** - Voor de banner container
- **`Button`** - Voor alle knoppen (primary en secondary action)
- **`ButtonGroup`** - Voor het groeperen van knoppen
- **`Link`** - Voor links naar cookie-instellingen
- **`Heading2`** - Voor de titel

> [!NOTE]
> Bekende tekortkomingen in community componenten worden vastgelegd in GitHub issues. Controleer de [Utrecht Design System repository](https://github.com/nl-design-system/utrecht) voor actuele informatie.

### Opslag van consent voorkeuren

**Voor productie**: Implementeer server-side opslag van consent voorkeuren (zie "State management" sectie voor implementatiedetails).

**Voor demo/testing**: De repository bevat een `useCookieConsent` hook met localStorage. Dit is **niet geschikt voor productie**.

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

Het pattern gebruikt CSS custom properties (design tokens) voor spacing:

- `--basis-space-block-*` - Voor verticale spacing

Je kunt deze aanpassen door de design tokens te overschrijven in je eigen CSS.

## Toegankelijkheid

### Acceptatiecriteria voor toegankelijkheid

Wanneer je dit pattern implementeert, zorg ervoor dat je voldoet aan:

- [x] **WCAG 2.1 niveau AA** - Voldoet aan de Web Content Accessibility Guidelines
- [x] **Semantische HTML** - Gebruikt correcte HTML5 semantische elementen
- [x] **ARIA attributen** - Correct gebruik van ARIA attributen
- [x] **Keyboard navigatie** - Volledige navigatie mogelijk met alleen het toetsenbord (Tab, Shift+Tab, Enter, Space)
- [x] **Screen reader ondersteuning** - Compatibel met screen readers
- [x] **Kleurencontrast** - Voldoet aan WCAG contrast ratio's

### Acceptatiecriteria voor toegankelijk gebruik

1. **Afzender identificatie** - Vermeld duidelijk de organisatienaam (bijv. "Cookies op de website van [organisatienaam]")
2. **Duidelijke acties** - Gebruik actiegerichte button teksten, geen vage teksten zoals "OK"
3. **Toegankelijke positionering** - Zichtbaar zonder te scrollen, verberg geen belangrijke content
4. **Link naar meer informatie** - Voeg altijd een link toe naar de cookie-instellingen pagina
5. **Wettelijke plichten** - Gebruikers kunnen hun keuze wijzigen, voorkeuren worden opgeslagen

## Veelvoorkomende problemen

Hieronder een overzicht van de meestvoorkomende problemen met cookie banners en hoe deze te voorkomen:

### 1. Geen duidelijke keuze mogelijkheid

**Probleem**: Banner heeft alleen een "Accepteren" knop, geen mogelijkheid om te weigeren.

**Oplossing**: Zorg altijd voor minimaal twee opties:

- Accepteren
- Weigeren
- Cookie-instellingen aanpassen

### 2. Dark patterns

**Probleem**: Gebruik van manipulerende technieken zoals:

- Grote "Accepteren" knop, kleine "Weigeren" link
- Moeilijk te vinden weiger optie
- Automatisch accepteren na X seconden

**Oplossing**: Gebruik gelijkwaardige styling voor beide opties. Geen automatische acceptatie.

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

**Probleem**: Banner is niet toegankelijk voor screen readers of keyboard gebruikers.

**Oplossing**: Zie "Toegankelijkheid" sectie voor acceptatiecriteria.

### 7. Geen link naar meer informatie

**Probleem**: Geen link naar cookie-instellingen.

**Oplossing**: Voeg altijd een link toe naar de cookie-instellingen pagina.

## Aanpassingen voor productie

Voor productie-gebruik:

1. **Implementeer server-side state management** - Zie "State management" sectie voor details
2. **Stel server-side cookies in** - Zie "Bewaartermijn van consent cookies" voor aanbevelingen (12-13 maanden)
3. **HTML-only variant voor progressive enhancement** - Zie `static/cookie-drawer.html` voor een voorbeeld dat werkt zonder JavaScript

## Browser ondersteuning

Het pattern gebruikt moderne webstandaarden:

- React 18+
- Utrecht Design System React componenten
- Server-side of client-side state management (naar eigen keuze)

## Juridische context en wetgeving

Deze sectie bevat belangrijke juridische informatie over cookie consent. Deze informatie is relevant voor het opstellen van je cookiebeleid en het bepalen van je implementatiestrategie.

### Inspiratiebronnen

- **[GOV UK](https://www.gov.uk/)** - Voorbeeld van een toegankelijke en gebruiksvriendelijke cookie consent implementatie

### Officiële richtlijnen en wetgeving

- **[Autoriteit Persoonsgegevens - Heldere cookiebanners](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners)** - Officiële richtlijnen voor cookie banners in Nederland
- **[Rijksoverheid - Mag een website ongevraagd cookies plaatsen?](https://www.rijksoverheid.nl/onderwerpen/telecommunicatie/vraag-en-antwoord/mag-een-website-ongevraagd-cookies-plaatsen)** - Nederlandse cookiewet en uitleg over wanneer toestemming nodig is
- **[Business.gov.nl - Cookies on your website](https://business.gov.nl/regulations/cookies/)** - Officiële informatie over cookievereisten voor ondernemers in Nederland
- **[GDPR.eu - Cookies, the GDPR, and the ePrivacy Directive](https://gdpr.eu/cookies/)** - Uitleg over cookies in relatie tot GDPR en ePrivacy Directive
- **[AVG/GDPR](https://www.autoriteitpersoonsgegevens.nl/)** - Algemene Verordening Gegevensbescherming

### Wanneer is toestemming nodig?

Volgens de [cookiewet](https://www.rijksoverheid.nl/onderwerpen/telecommunicatie/vraag-en-antwoord/mag-een-website-ongevraagd-cookies-plaatsen) moeten websites bezoekers toestemming vragen voor plaatsing van cookies, met uitzondering van cookies die niet privacygevoelig zijn.

#### Cookies waarvoor geen toestemming nodig is

Voor cookies die geen of weinig inbreuk op de privacy maken, is geen toestemming van de bezoeker nodig ([Business.gov.nl](https://business.gov.nl/regulations/cookies/)):

- **Functionele cookies** - Noodzakelijk om een dienst of webshop te laten functioneren, zoals bestanden die bijhouden wat er in een winkelwagentje zit.
- **Analytische cookies** - Voor het verzamelen van anonieme informatie over het gebruik van je website. De informatie wordt alleen gebruikt om de kwaliteit en functionaliteit van je website te verbeteren. **Belangrijk**: Je moet bezoekers nog steeds informeren over deze cookies, ook al is geen toestemming nodig.
- **A/B testing cookies** - Gebruikt om te bepalen welke versie van een advertentie of website meer gewaardeerd wordt door bezoekers.
- **Affiliate cookies / performance cookies** - Gebruikt om te bepalen welke advertentie de aankoopbeslissing van de consument beïnvloedt.

> [!NOTE]
> Let op: Hoewel analytische cookies vaak geen toestemming vereisen, kan dit afhangen van de specifieke implementatie en of gegevens worden gedeeld met derden. Bij twijfel is het altijd beter om toestemming te vragen. Volgens de [ePrivacy Directive](https://gdpr.eu/cookies/) moet je voor alle cookies behalve strikt noodzakelijke cookies toestemming krijgen.

#### Cookies waarvoor altijd toestemming nodig is

**Tracking cookies** vereisen altijd expliciete toestemming ([Business.gov.nl](https://business.gov.nl/regulations/cookies/)). Deze cookies:

- Houden individueel websitegedrag bij
- Stellen profielen op voor bijvoorbeeld gerichte advertenties
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

Volgens [Business.gov.nl](https://business.gov.nl/regulations/cookies/) moet je bij het vragen om toestemming voor cookies de volgende informatie vermelden:

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
   - Bewaartermijn van cookies (zie "Bewaartermijn van consent cookies" voor aanbevelingen)
   - Bewaartermijn van verzamelde gegevens

6. **Rechten van gebruikers**
   - Recht om toestemming in te trekken
   - Recht om gegevens te verwijderen
   - Hoe gebruikers hun voorkeuren kunnen wijzigen

7. **Contactinformatie**
   - Wie is verantwoordelijk voor de dataverwerking?
   - Contactgegevens voor vragen over cookies

### Anonieme tracking en delen met derden

Ook bij anonieme tracking moet je dit vermelden als je gegevens deelt met derden:

- Vermeld expliciet dat tracking anoniem is
- Leg uit wat "anoniem" betekent
- Vermeld alle derde partijen die gegevens ontvangen
- Geef aan of anonieme gegevens kunnen worden gecombineerd om personen te identificeren

### Vereisten voor toestemming

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

- Toegankelijk zijn via footer of cookie banner
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
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Best practices voor ARIA gebruik
