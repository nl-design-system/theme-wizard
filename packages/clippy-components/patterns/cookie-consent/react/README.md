# Cookie Consent Drawer Pattern

Een pattern voor het implementeren van een toegankelijke en gebruiksvriendelijke non-blocking cookie consent drawer in React, conform de richtlijnen van de [Autoriteit Persoonsgegevens](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners).

Dit pattern is gebaseerd op onderzoek naar best practices voor cookie banners en volgt de officiële richtlijnen en wetgeving. De volgende bronnen zijn gebruikt:

## Inspiratiebronnen

- **[GOV UK](https://www.gov.uk/)** - Voorbeeld van een toegankelijke en gebruiksvriendelijke cookie consent implementatie

## Officiële richtlijnen en wetgeving

- **[Autoriteit Persoonsgegevens - Heldere cookiebanners](https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners)** - Officiële richtlijnen voor cookie banners in Nederland
- **[Rijksoverheid - Mag een website ongevraagd cookies plaatsen?](https://www.rijksoverheid.nl/onderwerpen/telecommunicatie/vraag-en-antwoord/mag-een-website-ongevraagd-cookies-plaatsen)** - Nederlandse cookiewet en uitleg over wanneer toestemming nodig is
- **[Business.gov.nl - Cookies on your website](https://business.gov.nl/regulations/cookies/)** - Officiële informatie over cookievereisten voor ondernemers in Nederland
- **[GDPR.eu - Cookies, the GDPR, and the ePrivacy Directive](https://gdpr.eu/cookies/)** - Uitleg over cookies in relatie tot GDPR en ePrivacy Directive
- **[AVG/GDPR](https://www.autoriteitpersoonsgegevens.nl/)** - Algemene Verordening Gegevensbescherming

## Overzicht

Dit pattern toont hoe je een niet-blokkerende cookie consent drawer kunt implementeren die bovenaan de pagina verschijnt met drie acties:

- **Aanvullende cookies accepteren** - Accepteert alle optionele cookies
- **Aanvullende cookies weigeren** - Weigert alle optionele cookies
- Link naar cookie-instellingen pagina voor gedetailleerde keuzes

Het pattern is **non-modal** (gebruikers kunnen de pagina nog steeds gebruiken).

## Pattern implementatie

Dit pattern bevat een voorbeeld implementatie (`CookieConsentDrawer`) die laat zien hoe je een cookie consent drawer kunt bouwen met:

- Het Utrecht `Drawer` component voor de banner container
- `Button` en `ButtonGroup` componenten voor de actieknoppen
- `Link` component voor de link naar cookie-instellingen
- Een `useCookieConsent` hook voor het beheren van voorkeuren
- `localStorage` voor het opslaan van gebruikersvoorkeuren
- Automatische weergave alleen wanneer er nog geen voorkeur is opgeslagen
- Altijd bovenaan de pagina gepositioneerd

## Gebruik als referentie

Dit pattern is bedoeld als referentie implementatie. Je kunt:

- De code bekijken om te zien hoe het is geïmplementeerd
- De implementatie aanpassen aan je eigen behoeften
- De code kopiëren en aanpassen voor je eigen project
- De best practices gebruiken als richtlijn voor je eigen implementatie

### Voorbeeld implementatie

De voorbeeld implementatie (`CookieConsentDrawer`) toont een mogelijke implementatie met de volgende props:

| Prop                  | Type                             | Default                                                  | Beschrijving                                                                   |
| --------------------- | -------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `buttonAccept`        | `string`                         | `'Aanvullende cookies accepteren'`                       | Label voor de accepteer knop                                                   |
| `buttonReject`        | `string`                         | `'Aanvullende cookies weigeren'`                         | Label voor de weiger knop                                                      |
| `customizeLink`       | `{ href: string, text: string }` | `{ href: '/templates/cookies', text: 'Zelf instellen' }` | Link naar cookie-instellingen met href en text                                 |
| `children`            | `React.ReactNode`                | -                                                        | Custom content voor de drawer (heeft voorrang op `content` en default content) |
| `clearStorageOnMount` | `boolean`                        | `false`                                                  | Of de localStorage moet worden gewist bij mount (voor testen)                  |
| `title`               | `string`                         | -                                                        | Custom titel voor de drawer (optioneel)                                        |

**Let op**: Dit is een voorbeeld implementatie. Pas de code aan aan je eigen behoeften en requirements.

## Best practices

Dit pattern volgt de volgende best practices:

### Componenten uit Utrecht Design System

Het pattern gebruikt bestaande componenten uit de Utrecht Design System community:

- **`Drawer`** - Voor de banner container
- **`Button`** - Voor alle knoppen (primary en secondary action)
- **`ButtonGroup`** - Voor het groeperen van knoppen
- **`Link`** - Voor links naar cookie-instellingen
- **`Heading2`** - Voor de titel

> [!NOTE]
> Bekende tekortkomingen in community componenten worden vastgelegd in GitHub issues. Controleer de [Utrecht Design System repository](https://github.com/nl-design-system/utrecht) voor actuele informatie.

### LocalStorage structuur

Het pattern gebruikt de `localStorage` key: `cookie-consent-preferences`

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

### Progressive Enhancement

Het pattern is gebouwd met progressive enhancement:

**Met JavaScript:**

- De drawer wordt alleen getoond wanneer er nog geen voorkeur is opgeslagen
- Voorkeuren worden opgeslagen in `localStorage`
- Automatisch herstellen van opgeslagen voorkeuren

**Zonder JavaScript:**

- De voorbeeld implementatie rendert niet (retourneert `null` wanneer `isVisible` false is)
- Voor een volledige progressive enhancement implementatie, overweeg een HTML variant of server-side rendering

## Veelvoorkomende problemen met cookie banners

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

**Probleem**: Gebruikers weten niet wie de website beheert en wie verantwoordelijk is voor de cookies en dataverwerking.

**Oplossing**: Identificeer duidelijk de organisatie in de banner tekst. De afzender van de cookies moet expliciet worden beschreven, bijvoorbeeld door de organisatienaam te vermelden in de titel of intro tekst van de banner.

### 6. Toegankelijkheidsproblemen

**Probleem**: Banner is niet toegankelijk voor screen readers of keyboard gebruikers.

**Oplossing**: Gebruik semantische HTML, ARIA attributen, en test met screen readers.

### 7. Geen link naar meer informatie

**Probleem**: Geen link naar cookie-instellingen of externe informatie.

**Oplossing**: Voeg altijd links toe naar:

- Cookie-instellingen pagina
- Externe informatie (bijvoorbeeld Autoriteit Persoonsgegevens)

## Cookiebeleid en cookies pagina

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
   - Bewaartermijn van cookies
   - Bewaartermijn van verzamelde gegevens

6. **Rechten van gebruikers**
   - Recht om toestemming in te trekken
   - Recht om gegevens te verwijderen
   - Hoe gebruikers hun voorkeuren kunnen wijzigen

7. **Contactinformatie**
   - Wie is verantwoordelijk voor de dataverwerking?
   - Contactgegevens voor vragen over cookies

### Anonieme tracking en delen met derden

Zelfs wanneer je tracking volledig anoniem is, moet je dit duidelijk vermelden in je cookiebeleid als je gegevens deelt met derden:

- **Vermeld expliciet** dat tracking anoniem is
- **Leg uit** wat "anoniem" betekent in jouw context
- **Vermeld alle derde partijen** die gegevens ontvangen, ook als deze anoniem zijn
- **Geef aan** of anonieme gegevens kunnen worden gecombineerd met andere gegevens om personen te identificeren

**Voorbeeld tekst voor anonieme tracking:**

> "We gebruiken anonieme analytics cookies om te begrijpen hoe bezoekers onze website gebruiken. Deze gegevens worden gedeeld met [naam derde partij] voor analytics doeleinden. De verzamelde gegevens zijn geanonimiseerd en kunnen niet direct worden gekoppeld aan individuele gebruikers."

### Vereisten voor toestemming

Volgens [Business.gov.nl](https://business.gov.nl/regulations/cookies/) en de [ePrivacy Directive](https://gdpr.eu/cookies/) moet je:

- **Duidelijk zichtbare keuze bieden** - Bezoekers moeten duidelijk zichtbaar kunnen kiezen of ze toestemming geven voor cookies
- **Bewijs van toestemming kunnen tonen** - Je moet kunnen aantonen dat bezoekers toestemming hebben gegeven
- **Toegang bieden bij weigering** - Bezoekers moeten toegang hebben tot je service, ook als ze bepaalde cookies weigeren
- **Toestemming net zo makkelijk kunnen intrekken** - Bezoekers moeten toestemming net zo makkelijk kunnen intrekken als ze deze hebben gegeven

#### Wat telt NIET als geldige toestemming?

Toestemming is niet geldig als ([Business.gov.nl](https://business.gov.nl/regulations/cookies/)):

- Je onduidelijke informatie geeft in de algemene voorwaarden of privacyverklaring (bijvoorbeeld: "Door deze website te bezoeken stem je automatisch in met het gebruik van cookies")
- De websitebezoeker geen actieve toestemming hoeft te geven (als iemand niets doet, stemt hij/zij niet automatisch in)
- Je vooraf aangevinkte vakjes gebruikt
- Je een cookiewall gebruikt die bezoekers verhindert je website te betreden als ze cookies weigeren

### Link naar cookiebeleid

Zorg ervoor dat je cookiebeleid:

- **Toegankelijk is** via een duidelijke link in de footer of cookie banner
- **Altijd beschikbaar is** - niet alleen wanneer cookies worden geaccepteerd
- **Up-to-date is** - regelmatig bijwerken wanneer je nieuwe cookies of derde partijen toevoegt
- **Begrijpelijk is** - gebruik heldere taal, vermijd juridisch jargon waar mogelijk
- **Accurate en specifieke informatie bevat** - Geef in begrijpelijke taal accurate en specifieke informatie over de gegevens die elke cookie volgt en het doel ervan, voordat toestemming wordt gegeven ([GDPR.eu](https://gdpr.eu/cookies/))

## Aanpassingen voor productie

### Backend integratie

**Belangrijk**: De voorbeeld implementatie slaat voorkeuren alleen op in `localStorage`. Voor een juridisch geldige cookie consent implementatie moet je:

1. De voorkeuren ook naar je backend sturen (bijvoorbeeld via een `fetch()` call)
2. Server-side cookies instellen op basis van de voorkeuren
3. Analytics en andere tracking scripts alleen laden wanneer de gebruiker toestemming heeft gegeven

Pas de `useCookieConsent` hook aan of maak een wrapper component die deze functionaliteit toevoegt.

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

Wanneer je de cookie drawer implementeert, zorg ervoor dat:

1. **Afzender identificatie**
   - De drawer identificeert duidelijk wie de website beheert
   - De afzender van de cookies moet duidelijk worden beschreven in de banner tekst
   - Identificeer de organisatie expliciet in de banner tekst (bijvoorbeeld: "Cookies op de website van [organisatienaam]")
   - De component past automatisch de titel en intro tekst aan wanneer een organisatienaam wordt opgegeven
   - Gebruikers moeten kunnen zien welke organisatie verantwoordelijk is voor de cookies en de dataverwerking

2. **Duidelijke acties**
   - Gebruik duidelijke, actiegerichte button teksten
   - Vermijd vage teksten zoals "OK" of "Begrepen"
   - Gebruik in plaats daarvan: "Aanvullende cookies accepteren" en "Aanvullende cookies weigeren"

3. **Toegankelijke positionering**
   - Zichtbaar zonder te scrollen (drawer verschijnt bovenaan de pagina)
   - Zorg dat de drawer niet belangrijke content verbergt

4. **Link naar meer informatie**
   - Voeg altijd een link toe naar de cookie-instellingen pagina
   - Link naar externe informatie kan worden toegevoegd

5. **Wettelijke plichten**
   - Zorg dat gebruikers hun keuze kunnen wijzigen via de cookie-instellingen pagina
   - Sla voorkeuren op (lokaal of server-side)

## Browser ondersteuning

Het pattern gebruikt moderne webstandaarden:

- React 18+
- Utrecht Design System React componenten
- `localStorage` API (alleen voor demo doeleinden)

## Referenties

### Technische documentatie

- **[Utrecht Design System](https://www.utrecht.nl/)** - Design system componenten
- **[Utrecht Components React](https://github.com/nl-design-system/utrecht/tree/main/packages/components-react)** - React componenten uit de community

### Toegankelijkheid

- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Web Content Accessibility Guidelines
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Best practices voor ARIA gebruik
