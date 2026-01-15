# Cookie Consent Form Pattern

Een pattern voor het implementeren van een uitgebreide, toegankelijke cookie consent form in React met gedetailleerde cookie-instellingen, conform de richtlijnen van de [Autoriteit Persoonsgegevens](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners).

## Overzicht

Dit pattern toont hoe je een volledige cookie consent form kunt implementeren waar gebruikers per categorie kunnen kiezen welke cookies ze accepteren:

- **Gedetailleerde cookie-instellingen** - Gebruikers kunnen per categorie kiezen
- **Gerechtvaardigd belang** - Ondersteuning voor opt-in (toestemming) en opt-out (gerechtvaardigd belang) volgens AP-richtlijnen
- **Configureerbare info secties** - Accordion met "Wat zijn cookies?", "Cookieverklaring", en "Mijn gegevens"
- **Cookie details** - Uitklapbare tabellen met alle cookies per categorie
- **Drie acties** - Accepteren, Weigeren, of Selectie opslaan

Het pattern gebruikt Utrecht Design System, NL Design System componenten en een utility class van Amsterdam Design System (ams-visual-hidden).

## Wanneer gebruik je dit pattern

Dit pattern is bedoeld voor een **aparte cookie-instellingenpagina** waar gebruikers hun voorkeuren in detail kunnen aanpassen.

### Relatie met Cookie Consent Drawer

De `CookieConsentForm` moet altijd op een **dedicated pagina** staan (bijv. `/cookies` of `/privacy/cookies`), en **niet** direct in een drawer of modal. Gebruikers komen op deze pagina via:

1. **"Zelf instellen" / "Aanpassen" link** uit de Cookie Consent Drawer
2. **Menu navigatie** - Bijvoorbeeld in het hoofdmenu of instellingenmenu
3. **Footer** - Standaard link naar "Cookie-instellingen" of "Cookies"
4. **Privacy pagina** - Als onderdeel van het privacybeleid

### Waarom een aparte pagina?

- **Toegankelijkheid** - Screen reader gebruikers kunnen de volledige content op een normale manier navigeren
- **Overzichtelijk** - Geen beperkingen van een modal/drawer viewport
- **Deep linking** - Directe link naar cookie-instellingen mogelijk (bijv. vanuit e-mails of support)
- **SEO & vindbaarheid** - Zoekmachines en site search kunnen de pagina indexeren
- **Persistente toegang** - Gebruikers kunnen altijd hun voorkeuren wijzigen zonder eerst een banner te moeten triggeren

> **Let op**: Voor de eerste cookie consent vraag bij een nieuwe bezoeker, gebruik je het [Cookie Consent Drawer pattern](../Drawer/README.md). Het formulier is bedoeld voor gebruikers die hun bestaande voorkeuren willen aanpassen.

## Quick Start

> Dit is een **pattern** (geen installeerbaar component). Het toont een aanbevolen manier om Design System componenten samen te gebruiken voor een cookie consent form. De code is bedoeld als voorbeeld om te kopiëren en aan te passen aan je eigen behoeften.

### Benodigde componenten

Dit pattern gebruikt componenten uit Utrecht Design System, NL Design System en Amsterdam Design System:

```bash
npm install @utrecht/component-library-react @nl-design-system-candidate/button-react @nl-design-system-candidate/number-badge-react @nl-design-system-candidate/paragraph-react @nl-design-system-candidate/heading-react @nl-design-system-candidate/link-react @amsterdam/design-system-react @amsterdam/design-system-css @amsterdam/design-system-tokens
```

of voor css only implementatie

```bash
npm install @utrecht/component-library-css @amsterdam/design-system-css @amsterdam/design-system-tokens
```

### Componenten uit Design Systems

Het pattern gebruikt bestaande componenten uit de Utrecht en NL Design System communities:

**Utrecht Design System:**

- **`Alert`** - Voor status feedback na het opslaan van voorkeuren
- **`Fieldset` & `FieldsetLegend`** - Voor groeperen van cookie opties
- **`FormFieldCheckbox`** - Voor cookie selectie
- **`ButtonGroup`** - Voor groeperen van actieknoppen
- **`AccordionProvider`** - Voor uitklapbare info secties

**NL Design System:**

- **`Button`** - Voor alle actieknoppen
- **`NumberBadge`** - Voor tonen van aantal cookies per categorie
- **`Paragraph`** - Voor tekstblokken
- **`Heading`** - Voor koppen
- **`Link`** - Voor hyperlinks

**Amsterdam Design System:**

- **`DescriptionList`** - Voor weergave van cookie details in een gestructureerde lijst
- **`visually-hidden`** - Voor screen reader-only tekst (CSS utility)

> Bekende tekortkomingen in community componenten worden vastgelegd in GitHub issues. Controleer de [Utrecht Design System repository](https://github.com/nl-design-system/utrecht) voor actuele informatie.

### Basis implementatie

```tsx
import { CookieConsentForm } from './patterns/cookie-consent/Form';
import { WhatAreCookiesPanel, PolicyPanel, DataPanel } from './patterns/cookie-consent/Form/components';

function App() {
  return (
    <CookieConsentForm
      customizeLink={{ href: '/privacy', text: 'Privacybeleid' }}
      infoSections={[
        {
          label: 'Wat zijn cookies?',
          body: <WhatAreCookiesPanel />,
        },
        {
          label: 'Cookieverklaring',
          body: <PolicyPanel />,
        },
        {
          label: 'Mijn gegevens',
          body: <DataPanel cookieOptions={[]} selectedCookies={new Set()} />,
        },
      ]}
      showLegitimateInterest
    />
  );
}
```

### Volledige implementatie

Zie voor meer details:

- **Broncode**: `src/patterns/cookie-consent/Form/CookieConsentForm.tsx`
- **Demo hook**: `src/patterns/cookie-consent/hooks/useCookieConsent.tsx` (localStorage, alleen voor demo)
- **Componenten**: `src/patterns/cookie-consent/Form/components/`
  - `CookieDescriptionList` - Weergave van cookie details
  - `CookieOption` - Individuele cookie categorie met checkbox
  - `CookieOptionList` - Lijst met cookie categorieën
  - `DataPanel`, `PolicyPanel`, `WhatAreCookiesPanel` - Info panelen voor accordion

## API Reference

### Props van het pattern

De volledige implementatie ondersteunt deze props:

| Prop                     | Type             | Default                     | Beschrijving                                             |
| ------------------------ | ---------------- | --------------------------- | -------------------------------------------------------- |
| `buttonAccept`           | `string`         | `'Alle cookies accepteren'` | Label accepteer alles knop                               |
| `buttonReject`           | `string`         | `'Cookies weigeren'`        | Label weiger alles knop                                  |
| `buttonSave`             | `string`         | `'Selectie opslaan'`        | Label opslaan knop                                       |
| `clearStorageOnMount`    | `boolean`        | `false`                     | Wis localStorage bij mount (testen)                      |
| `cookieOptions`          | `CookieOption[]` | _default options_           | Array met cookie categorieën en hun cookies              |
| `customizeLink`          | `object`         | -                           | Link naar privacybeleid `{ href: string, text: string }` |
| `infoSections`           | `InfoSection[]`  | `[]`                        | Array met uitklapbare info secties voor accordion        |
| `showLegitimateInterest` | `boolean`        | `true`                      | Toon aparte sectie voor gerechtvaardigd belang           |

### InfoSection Type

Info secties worden gebruikt voor de accordion (en is naar eigen invulling) met aanvullende informatie:

```typescript
interface InfoSection {
  body: React.ReactNode;
  expanded?: boolean;
  label: string;
}
```

**Voorbeeld:**

```tsx
infoSections={[
  {
    label: 'Wat zijn cookies?',
    body: <WhatAreCookiesPanel />,
    expanded: true, // Optioneel: sectie standaard open
  },
  {
    label: 'Cookieverklaring',
    body: <PolicyPanel privacyPolicyUrl="/privacy" />,
  },
  {
    label: 'Mijn gegevens',
    body: <DataPanel
      cookieOptions={cookieOptions}
      selectedCookies={selectedCookies}
    />,
  },
]}
```

### CookieOption Type

Cookie opties definiëren de categorieën en individuele cookies:

```typescript
type LegalBasis = 'consent' | 'legitimate-interest';

type CookieType = 'analytics' | 'external-content' | 'functional' | 'marketing' | 'preferences';

interface Cookie {
  description: string;
  duration: string;
  name: string;
  type?: string;
}

interface CookieOption {
  cookies?: Cookie[];
  description?: string;
  id: CookieType;
  label: string;
  legalBasis?: LegalBasis; // 'consent' (opt-in) of 'legitimate-interest' (opt-out)
  required?: boolean; // Noodzakelijke cookies kunnen niet worden uitgeschakeld
}
```

**Voorbeeld:**

```typescript
const cookieOptions: CookieOption[] = [
  {
    id: 'functional',
    label: 'Functionele cookies',
    description: 'Deze cookies zijn nodig voor het functioneren van de website.',
    required: true,
    legalBasis: 'legitimate-interest',
    cookies: [
      {
        name: 'PHPSESSID',
        description: 'Sessie identifier voor gebruikersessie',
        duration: 'Sessie',
        type: 'HTTP',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytische cookies',
    description: 'Deze cookies helpen ons de website te verbeteren.',
    legalBasis: 'consent',
    cookies: [
      {
        name: '_ga',
        description: 'Google Analytics - Unieke gebruikers identificeren',
        duration: '2 jaar',
        type: 'HTTP',
      },
    ],
  },
];
```

## Gerechtvaardigd belang (Legitimate Interest)

Het pattern ondersteunt twee juridische grondslagen voor cookies volgens de AP-richtlijnen:

### Toestemming (Consent) - Opt-in

Cookies waarvoor **expliciete toestemming** nodig is:

- **Standaard uitgeschakeld** - Gebruiker moet expliciet toestemming geven
- **Voorbeelden**: Analytische cookies, marketing cookies, externe content cookies
- **Legal basis**: `'consent'`

```typescript
{
  id: 'analytics',
  label: 'Analytische cookies',
  legalBasis: 'consent', // Opt-in: standaard UIT
  // ...
}
```

### Gerechtvaardigd belang (Legitimate Interest) - Opt-out

Cookies geplaatst op basis van **gerechtvaardigd belang**:

- **Standaard ingeschakeld** - Gebruiker kan bezwaar maken
- **Voorbeelden**: Functionele cookies, voorkeurscookies
- **Legal basis**: `'legitimate-interest'`

```typescript
{
  id: 'preferences',
  label: 'Voorkeurscookies',
  legalBasis: 'legitimate-interest', // Opt-out: standaard AAN
  // ...
}
```

### UI voor gerechtvaardigd belang

Wanneer `showLegitimateInterest={true}`:

- **Twee aparte secties** in het formulier:
  1. **"Toestemming vereist"** - Voor consent cookies (opt-in)
  2. **"Gerechtvaardigd belang"** - Voor legitimate interest cookies (opt-out)

- **Duidelijke uitleg** bij elke sectie over de rechten van de gebruiker

- **Visuele distinctie** - Legitimate interest sectie heeft subtiele achtergrondkleur

**Beschrijvingen bij cookie opties:**

- Consent cookies: Standaard beschrijving
- Legitimate interest cookies: "(Standaard actief – zet uit om bezwaar te maken)"
- Required cookies: "(Noodzakelijk – deze cookies zijn vereist voor de werking van de website en kunnen niet worden uitgeschakeld)"

### Zonder gerechtvaardigd belang sectie

Als je niet wilt dat consent en legitimate interest apart worden getoond, moet je de prop expliciet op `false` zetten (default is `true`):

```tsx
<CookieConsentForm showLegitimateInterest={false} />
```

Dit toont alle cookies in één lijst zonder onderscheid tussen legal basis.

## State management

Het pattern vereist dat je zelf implementeert hoe consent voorkeuren worden opgeslagen en beheerd.

**Client-side (alleen voor demo/testing):**

De repository bevat een `useCookieConsent` hook met localStorage (`src/patterns/cookie-consent/hooks/useCookieConsent.tsx`). Dit is **niet aanbevolen voor productie**.

**Voor productie:**

Implementeer server-side opslag van consent voorkeuren met:

- Database opslag van gebruikersvoorkeuren
- Server-side cookies met beveiligde instellingen
- Bewaartermijn van 12 maanden ([ePrivacy Directive](https://gdpr.eu/cookies/) best practice)

## Toegankelijkheid

### Acceptatiecriteria voor toegankelijkheid

Wanneer je dit pattern implementeert, zorg ervoor dat je voldoet aan:

- [x] **WCAG 2.1 niveau AA** - Voldoet aan de Web Content Accessibility Guidelines
- [x] **Semantische HTML** - Gebruikt correcte HTML5 fieldset/legend structuur
- [x] **ARIA attributen** - Correct gebruik van aria-expanded, aria-describedby, aria-live
- [x] **Keyboard navigatie** - Volledige navigatie mogelijk met alleen het toetsenbord
- [x] **Screen reader ondersteuning** - Visueel verborgen tekst voor cookie aantallen, duidelijke beschrijvingen
- [x] **Kleurencontrast** - Voldoet aan WCAG contrast ratio's

### Toegankelijkheidsfeatures in dit pattern

1. **Fieldset & Legend** - Logische groepering van gerelateerde checkboxes
2. **Visueel verborgen tekst** - Cookie aantallen worden voorgelezen maar zijn niet zichtbaar
3. **Uitgebreide beschrijvingen** - Elke cookie optie heeft een duidelijke beschrijving
4. **Status feedback** - Zowel zichtbare als screen reader feedback na elke actie (zie hieronder)
5. **Accessible toggle buttons** - Voor uitklappen van cookie details met aria-expanded
6. **Accordion** - Info secties zijn toegankelijk via keyboard en screen readers

### Status feedback na acties

Het pattern geeft duidelijke feedback wanneer een gebruiker zijn voorkeuren opslaat:

**Voor visuele gebruikers:**

- Een Utrecht `Alert` component met `type="ok"` (groene success styling) verschijnt bovenaan het formulier
- Het Alert component heeft ingebouwde toegankelijkheidsfeatures
- Styling via Utrecht design tokens (`--utrecht-alert-ok-*`) zorgt voor consistente appearance
- De message blijft zichtbaar (verdwijnt niet automatisch)

**Voor screen reader gebruikers:**

- Een `aria-live="polite"` region kondigt de status aan
- `aria-atomic="true"` zorgt dat het hele bericht wordt voorgelezen
- Aankondiging gebeurt tijdens een natuurlijke pauze in de spraakuitvoer
- De region is altijd aanwezig in de DOM maar visueel verborgen

Dit zorgt ervoor dat alle gebruikers, ongeacht hun visuele capaciteiten of hulpmiddelen, weten dat hun actie succesvol was.

### Belangrijke toegankelijkheidsoverwegingen

1. **Form structuur** - Settings zijn altijd zichtbaar, info secties zijn optioneel uitklapbaar
2. **Button hiërarchie** - Alle actieknoppen zijn gelijkwaardig (secondary) om geen voorkeur te suggereren
3. **Cookie details** - Uitklapbare tabellen met volledige keyboard ondersteuning
4. **Legal basis distinctie** - Duidelijke visuele en semantische scheiding tussen consent en legitimate interest

## Styling aanpassen

Het pattern gebruikt CSS custom properties (design tokens)

### Token architectuur

**Drie lagen:**

1. **Basis tokens** - Algemene design system tokens
2. **Clippy tokens** - Component system tokens (gekoppeld aan basis)
3. **AMS tokens** - Amsterdam Design System tokens (gekoppeld aan clippy)

### Gebruikte design tokens

**Spacing tokens:**

```css
--basis-space-block-xl
--basis-space-block-lg
--basis-space-block-md
--basis-space-block-sm
--basis-space-inline-lg
--basis-space-inline-md
--basis-space-inline-sm
```

**Color tokens:**

```css
--basis-color-default-border-subtle
--basis-color-default-color-default
--basis-color-default-color-subtle
--basis-color-accent-1-bg-subtle
```

**Typography tokens:**

```css
/* Via clippy laag */
--clippy-description-list-color
--clippy-description-list-font-family
--clippy-description-list-font-size
--clippy-description-list-line-height
--clippy-typography-hyphenate-limit-chars

/* Basis tokens */
--basis-color-default-color-default
--basis-text-font-family-default
--basis-text-font-size-md
--basis-text-font-size-sm
--basis-text-line-height-md
--basis-text-font-weight-bold
```

**Icon tokens:**

```css
/* Via clippy laag */
--clippy-icon-size

/* Utrecht tokens */
--utrecht-icon-size
```

### Gelaagde token mapping

De tokens zijn als volgt met elkaar verbonden:

```css
:root {
  /* Clippy variables linked to basis tokens */
  --clippy-description-list-color: var(--basis-color-default-color-default);
  --clippy-description-list-font-family: var(--basis-text-font-family-default);
  --clippy-description-list-font-size: var(--basis-text-font-size-md);
  --clippy-description-list-line-height: var(--basis-text-line-height-md);
  --clippy-typography-hyphenate-limit-chars: 6 3 2;
  --clippy-icon-size: 1rem;

  /* AMS variables linked to clippy variables */
  --ams-description-list-color: var(--clippy-description-list-color);
  --ams-description-list-font-family: var(--clippy-description-list-font-family);
  --ams-description-list-font-size: var(--clippy-description-list-font-size);
  --ams-description-list-line-height: var(--clippy-description-list-line-height);
  --ams-typography-hyphenate-limit-chars: var(--clippy-typography-hyphenate-limit-chars);
}
```

### Styling voor legitimate interest sectie

De legitimate interest sectie heeft een subtiele achtergrondkleur:

```css
.clippy-cookie-fieldset--legitimate-interest {
  background-color: var(--basis-color-accent-1-bg-subtle);
  padding-block: var(--basis-space-block-lg);
  padding-inline: var(--basis-space-inline-lg);
}
```

### Tokens aanpassen

Je kunt de styling op verschillende niveaus aanpassen:

**Op basis niveau** (beïnvloedt hele design system):

```css
:root {
  --basis-text-font-family-default: 'Custom Font', sans-serif;
  --basis-text-font-size-md: 1.125rem;
}
```

**Op clippy niveau** (beïnvloedt alleen clippy componenten of overrides van clippy componenten op andere design system componenten):

```css
:root {
  --clippy-description-list-font-size: 1rem;
  --clippy-description-list-line-height: 1.5;
}
```

**Op AMS niveau** (beïnvloedt alleen AMS componenten):

```css
:root {
  --ams-description-list-font-size: 0.875rem;
}
```

## Real-life cookie voorbeelden

Het pattern bevat standaard real-life cookie voorbeelden voor veel gebruikte diensten:

### Functionele cookies

- `PHPSESSID`, `cookie_consent`, `csrf_token` - Sessie en beveiliging
- `AWSALB` - Load balancing

### Analytische cookies

- `_ga`, `_gid` - Google Analytics
- `_pk_id`, `_pk_ses` - Matomo
- `_hjSessionUser_*` - Hotjar
- `_clck` - Microsoft Clarity

### Externe content cookies

- `VISITOR_INFO1_LIVE`, `YSC` - YouTube
- `vuid`, `player` - Vimeo
- `NID`, `1P_JAR` - Google Maps
- `sp_t` - Spotify

### Voorkeurscookies

- `language`, `region`, `theme`, `font_size` - Gebruikersvoorkeuren

### Marketing cookies

- `_fbp`, `_fbc` - Facebook/Meta
- `IDE`, `test_cookie` - Google Ads
- `_ttp` - TikTok

Deze voorbeelden kun je aanpassen in `defaultCookieOptions.json`.

## Aanpassingen voor productie

Voor productie-gebruik:

1. **Implementeer server-side state management** - Zie "State management" sectie
2. **Stel server-side cookies in** - Bewaartermijn van 12 maanden
3. **Pas cookie voorbeelden aan** - Vervang default voorbeelden met je eigen cookies
4. **Configureer info secties** - Pas de accordion secties aan naar je eigen content
5. **Valideer juridische basis** - Controleer of je legal basis klopt voor elke cookie volgens AP-richtlijnen

## Browser ondersteuning

Het pattern gebruikt moderne webstandaarden:

- React 18+
- Utrecht Design System React componenten
- NL Design System Button en NumberBadge componenten
- Server-side of client-side state management (naar eigen keuze)

## Juridische context

Voor juridische informatie over cookies, toestemming en gerechtvaardigd belang, zie:

- **[Autoriteit Persoonsgegevens - Heldere cookiebanners](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners)**
- **[AP - Gerechtvaardigd belang](https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/rechtmatige-grondslag/gerechtvaardigd-belang)**
- **[Rijksoverheid - Cookies](https://www.rijksoverheid.nl/onderwerpen/telecommunicatie/vraag-en-antwoord/mag-een-website-ongevraagd-cookies-plaatsen)**
- **[GDPR.eu - Cookies](https://gdpr.eu/cookies/)**

## Referenties

### Technische documentatie

- **[Utrecht Design System](https://www.utrecht.nl/)** - Design system componenten
- **[NL Design System](https://www.nldesignsystem.nl/)** - Design system community
- **[Utrecht Components React](https://github.com/nl-design-system/utrecht/tree/main/packages/components-react)** - React componenten

### Toegankelijkheid

- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Web Content Accessibility Guidelines
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Best practices voor ARIA gebruik
