# Cookie Consent Drawer

Een toegankelijke en gebruiksvriendelijke React component voor een non-blocking cookie consent drawer, conform de richtlijnen van de [Autoriteit Persoonsgegevens](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners).

Er is onderzoek gedaan naar de best practices omtrent een cookie banner en dit component haalt inspiratie uit de volgende cookie consent dialogen:

1. [GOV UK](https://www.gov.uk/)
2. ...
3. ...

## Overzicht

De `CookieConsentDrawer` is een niet-blokkerende banner die bovenaan de pagina verschijnt met drie acties:

- **Aanvullende cookies accepteren** - Accepteert alle optionele cookies
- **Aanvullende cookies weigeren** - Weigert alle optionele cookies
- Link naar cookie-instellingen pagina voor gedetailleerde keuzes

De component is **non-modal** (gebruikers kunnen de pagina nog steeds gebruiken).

## Features

- Gebruikt het Utrecht `Drawer` component voor de banner container
- Gebruikt `Button` en `ButtonGroup` componenten voor de actieknoppen
- Gebruikt `Link` component voor de link naar cookie-instellingen
- Slaat gebruikersvoorkeuren op in `localStorage`
- Toont de drawer alleen wanneer er nog geen voorkeur is opgeslagen
- Altijd bovenaan de pagina gepositioneerd
- **Non-modal** - gebruikers kunnen de pagina nog steeds gebruiken
- Identificeert de afzender van de website (via `organization` prop)

## Props

| Prop                  | Type              | Default                | Beschrijving                                                                   |
| --------------------- | ----------------- | ---------------------- | ------------------------------------------------------------------------------ |
| `buttonAccept`        | `string`          | `'Accepteren'`         | Label voor de accepteer knop                                                   |
| `buttonReject`        | `string`          | `'Weigeren'`           | Label voor de weiger knop                                                      |
| `buttonCustomize`     | `string`          | `'Zelf instellen'`     | Label voor de link naar cookie-instellingen                                    |
| `customizeHref`       | `string`          | `'/templates/cookies'` | URL naar de cookie-instellingen pagina                                         |
| `children`            | `React.ReactNode` | -                      | Custom content voor de drawer (optioneel)                                      |
| `clearStorageOnMount` | `boolean`         | `false`                | Of de localStorage moet worden gewist bij mount (voor testen)                  |
| `organization`        | `string`          | -                      | Naam van de organisatie (wordt gebruikt in de titel en content)                |
| `title`               | `string`          | -                      | Custom titel voor de drawer (optioneel, wordt gecombineerd met `organization`) |

## Gebruik

```tsx
import { CookieConsentDrawer } from '@nl-design-system-community/clippy-components';
import '@utrecht/component-library-css';

function App() {
  return (
    <>
      <CookieConsentDrawer organization="Gemeente Utrecht" />
      {/* Rest van je app */}
    </>
  );
}
```

### Met custom content

```tsx
<CookieConsentDrawer organization="Gemeente Utrecht" customizeHref="/cookies">
  <p>We gebruiken cookies om de website te verbeteren.</p>
</CookieConsentDrawer>
```

### Met custom labels

```tsx
<CookieConsentDrawer
  buttonAccept="Alle cookies accepteren"
  buttonReject="Alleen essentiële cookies"
  buttonCustomize="Cookie-instellingen aanpassen"
  organization="Gemeente Utrecht"
/>
```

## Hergebruik van Utrecht Design System componenten

De cookie drawer maakt gebruik van bestaande componenten uit de Utrecht Design System community:

- **`Drawer`** - Voor de banner container
- **`Button`** - Voor alle knoppen (primary en secondary action)
- **`ButtonGroup`** - Voor het groeperen van knoppen
- **`Link`** - Voor links naar cookie-instellingen
- **`Heading2`** - Voor de titel

> [!NOTE]
> Bekende tekortkomingen in community componenten worden vastgelegd in GitHub issues. Controleer de [Utrecht Design System repository](https://github.com/nl-design-system/utrecht) voor actuele informatie.

## Technische Details

### LocalStorage

De component gebruikt de `localStorage` key: `cookie-consent-preferences`

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

### Hook: `useCookieConsent`

De component gebruikt intern de `useCookieConsent` hook die de volgende functionaliteit biedt:

- Controleert of er al voorkeuren zijn opgeslagen
- Biedt `handleAccept` en `handleReject` handlers
- Biedt `isVisible` state om te bepalen of de drawer zichtbaar moet zijn
- Slaat voorkeuren op in `localStorage`

### Progressive Enhancement

De component is gebouwd met progressive enhancement in gedachten:

**Met JavaScript:**

- De drawer wordt alleen getoond wanneer er nog geen voorkeur is opgeslagen
- Voorkeuren worden opgeslagen in `localStorage`
- Automatisch herstellen van opgeslagen voorkeuren

**Zonder JavaScript:**

- De component rendert niet (retourneert `null` wanneer `isVisible` false is)
- Voor een volledige progressive enhancement implementatie, gebruik de HTML variant

## Veelvoorkomende problemen met cookie banners

Hieronder een overzicht van de meestvoorkomende problemen met cookie banners en hoe deze te voorkomen:

### 1. Geen duidelijke keuze mogelijkheid

**Probleem**: Banner heeft alleen een "Accepteren" knop, geen mogelijkheid om te weigeren.

**Oplossing**: De drawer biedt standaard drie opties:

- Accepteren
- Weigeren
- Cookie-instellingen aanpassen

### 2. Dark patterns

**Probleem**: Gebruik van manipulerende technieken zoals:

- Grote "Accepteren" knop, kleine "Weigeren" link
- Moeilijk te vinden weiger optie
- Automatisch accepteren na X seconden

**Oplossing**: De drawer gebruikt gelijkwaardige styling voor beide opties. Geen automatische acceptatie.

### 3. Geen mogelijkheid om voorkeuren te wijzigen

**Probleem**: Gebruikers kunnen hun keuze niet meer aanpassen na de eerste keuze.

**Oplossing**: Bied altijd een link naar cookie-instellingen waar gebruikers hun voorkeuren kunnen wijzigen via de `customizeHref` prop.

### 4. Onduidelijke teksten

**Probleem**: Vage of technische teksten die gebruikers niet begrijpen.

**Oplossing**: Gebruik heldere, eenvoudige taal via de `children` prop of pas de default content aan via de `useCookieConsent` hook.

### 5. Geen identificatie van afzender

**Probleem**: Gebruikers weten niet wie de website beheert.

**Oplossing**: Identificeer duidelijk de organisatie via de `organization` prop. De component past automatisch de titel en content aan.

### 6. Toegankelijkheidsproblemen

**Probleem**: Banner is niet toegankelijk voor screen readers of keyboard gebruikers.

**Oplossing**: De component gebruikt semantische HTML en Utrecht componenten die toegankelijk zijn. Test altijd met screen readers.

### 7. Geen link naar meer informatie

**Probleem**: Geen link naar cookie-instellingen of externe informatie.

**Oplossing**: De drawer bevat standaard een link naar cookie-instellingen via de `customizeHref` prop.

## Aanpassingen

### Backend integratie

**Belangrijk**: De huidige implementatie slaat voorkeuren alleen op in `localStorage`. Voor een juridisch geldige cookie consent implementatie moet je:

1. De voorkeuren ook naar je backend sturen (bijvoorbeeld via een `fetch()` call in de `handleAccept` en `handleReject` handlers)
2. Server-side cookies instellen op basis van de voorkeuren
3. Analytics en andere tracking scripts alleen laden wanneer de gebruiker toestemming heeft gegeven

Je kunt de `useCookieConsent` hook uitbreiden of een wrapper component maken die deze functionaliteit toevoegt.

### Styling aanpassen

De component gebruikt CSS custom properties (design tokens) voor spacing:

- `--basis-space-block-*` - Voor verticale spacing

Je kunt deze aanpassen door de design tokens te overschrijven in je eigen CSS.

### Custom content

Je kunt custom content toevoegen via de `children` prop:

```tsx
<CookieConsentDrawer organization="Gemeente Utrecht">
  <p>We gebruiken cookies om de website te verbeteren.</p>
  <p>
    Lees meer over ons <a href="/privacy">privacybeleid</a>.
  </p>
</CookieConsentDrawer>
```

## Toegankelijkheid

### Acceptatiecriteria voor toegankelijkheid

De cookie drawer component voldoet aan de volgende toegankelijkheidscriteria:

- [x] **WCAG 2.1 niveau AA** - Voldoet aan de Web Content Accessibility Guidelines
- [x] **Semantische HTML** - Gebruikt correcte HTML5 semantische elementen via Utrecht componenten
- [x] **ARIA attributen** - Utrecht componenten gebruiken correcte ARIA attributen
- [x] **Keyboard navigatie** - Volledige navigatie mogelijk met alleen het toetsenbord (Tab, Shift+Tab, Enter, Space)
- [x] **Screen reader ondersteuning** - Compatibel met screen readers via Utrecht componenten
- [x] **Kleurencontrast** - Voldoet aan WCAG contrast ratio's via Utrecht componenten

### Acceptatiecriteria voor toegankelijk gebruik

Wanneer je de cookie drawer implementeert, zorg ervoor dat:

1. **Afzender identificatie**
   - De drawer identificeert duidelijk wie de website beheert
   - Gebruik de `organization` prop om de organisatie naam in te stellen
   - Bijvoorbeeld: `<CookieConsentDrawer organization="Gemeente Utrecht" />`
   - De component past automatisch de titel en intro tekst aan

2. **Duidelijke acties**
   - Gebruik duidelijke, actiegerichte button teksten via de `buttonAccept` en `buttonReject` props
   - Vermijd vage teksten zoals "OK" of "Begrepen"
   - Gebruik in plaats daarvan: "Aanvullende cookies accepteren" en "Aanvullende cookies weigeren"

3. **Toegankelijke positionering**
   - Zichtbaar zonder te scrollen (drawer verschijnt bovenaan de pagina)
   - Zorg dat de drawer niet belangrijke content verbergt

4. **Link naar meer informatie**
   - Voeg altijd een link toe naar de cookie-instellingen pagina via de `customizeHref` prop
   - Link naar externe informatie kan worden toegevoegd via de `children` prop

5. **Wettelijke plichten**
   - Verwijs naar de [Autoriteit Persoonsgegevens richtlijnen](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners)
   - Zorg dat gebruikers hun keuze kunnen wijzigen via de cookie-instellingen pagina
   - Sla voorkeuren op (lokaal of server-side)

## Browser ondersteuning

De component gebruikt moderne webstandaarden:

- React 18+
- Utrecht Design System React componenten
- `localStorage` API (alleen voor demo doeleinden)

## Referenties

### Wettelijke verplichtingen

- **[Autoriteit Persoonsgegevens - Heldere cookiebanners](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners)** - Officiële richtlijnen voor cookie banners in Nederland
- **[AVG/GDPR](https://www.autoriteitpersoonsgegevens.nl/)** - Algemene Verordening Gegevensbescherming

### Technische documentatie

- **[Utrecht Design System](https://www.utrecht.nl/)** - Design system componenten
- **[Utrecht Components React](https://github.com/nl-design-system/utrecht/tree/main/packages/components-react)** - React componenten uit de community

### Toegankelijkheid

- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Web Content Accessibility Guidelines
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Best practices voor ARIA gebruik
