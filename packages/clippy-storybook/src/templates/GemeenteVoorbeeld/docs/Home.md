# Gemeente Voorbeeld – Startpagina template

Deze template toont een voorbeeld van een gemeentelijke startpagina, ontwikkeld met het **Voorbeeld Thema** en bestaande componenten uit de **NL Design System community**. De pagina is bedoeld als startpunt voor gemeenten die een toegankelijke, herkenbare en uitbreidbare homepage willen opzetten.

## Doel en gebruik

- **Doel**: laten zien hoe een gemeentelijke startpagina kan worden ingericht met heldere navigatie en snelle ingangen naar veelgebruikte diensten.
- **Gebruik**: gebruik deze template als referentie of basis voor een eigen implementatie binnen de Theme Wizard omgeving.

De template is volledig responsive en kan in verschillende thema-configuraties worden gebruikt, met het Voorbeeld Thema als uitgangspunt.

## Relatie met het Start‑thema, basis‑tokens en gemeentethema’s

In de Theme Wizard applicatie gaat deze template uit van het **Start‑thema** van NL Design System. De visuele stijl (typografie, kleuren, ruimte, iconen) is vastgelegd in de **basis‑tokens** (`basis.*`) op het Common‑niveau.

In Storybook kun je daarnaast **verschillende gemeentelijke thema’s** aanzetten via de themaselector (toolbar). Die thema’s leveren hun eigen design tokens (bijvoorbeeld kleuren en typografie), die boven op dezelfde componentstructuur worden toegepast.

Gemeenten kunnen de stijl van dit voorbeeld **rebranden** door:

- in de eigen implementatie de waarden van basis‑tokens aan te passen (bijvoorbeeld `basis.text.*`, `basis.color.*`, `basis.space.*`), zonder dat de `GemeenteVoorbeeldHome` template of de onderliggende componenten zelf hoeven te worden gewijzigd; of
- in Storybook een ander gemeentethema te kiezen om te zien hoe dezelfde template eruitziet met een andere huisstijl.

## Opbouw van de pagina

De startpagina is opgebouwd uit herbruikbare NL Design System componenten, zoals:

- **Paginaheader**: voor gemeentenaam, merkidentiteit en hoofdnavigatie.
- **Uitgelichte diensten / tegels**: voor snelle toegang tot veelgebruikte digitale diensten.
- **Nieuwssectie**: voor actuele berichten.
- **Paginafooter**: voor contactgegevens, service-links en aanvullende navigatie.

Zie `@nl-design-system-community/theme-wizard-templates` voor de concrete implementatie van `GemeenteVoorbeeldHome` en de exacte prop-definities.

## Gebruikte componentbibliotheken (en rol in de pagina)

Deze template combineert componenten uit meerdere (NLDS) libraries:

- **NL Design System (candidate) – React (CSS)**:
  - `SkipLink` (skiplink naar `#main`)
  - `Heading` (koppen)
  - `Link` (links)
- **Utrecht component library – React**:
  - Paginastructuur: `PageHeader`, `NavBar`/`NavList`/`NavListLink`, `PageContent`, `PageFooter`
  - Interactie: `AccordionProvider`, `ButtonLink`
  - Content: `Image`, `Paragraph`, `LinkList`/`LinkListLink`, `Icon`, `PageContent`
  - Icons: `@utrecht/web-component-library-react` (o.a. `UtrechtIconAlleen`, `UtrechtIconKalender`, `UtrechtIconChevronRight`, `UtrechtIconAfspraakMaken`, etc.)
- **Amsterdam Design System**:
  - `Card` (`@amsterdam/design-system-react`) voor de nieuwskaarten
  - `ams-visually-hidden` CSS utility (`@amsterdam/design-system-css`) voor “visueel verborgen, maar screenreader-zichtbare” koppen

## Hoe werken deze componenten samen?

- **Layout & structuur (Utrecht + NLDS)**:
  - De pagina gebruikt Utrecht “page” structuur (`utrecht-page-body`, `PageHeader`, `PageContent`, `PageFooter`) en vult die met NLDS `Heading`/`Link`.
  - `PageContent` wordt gebruikt om de hoofdinhoud te wrappen in verschillende secties (MainIntro, SelfService, News) en zorgt voor consistente padding en max-width styling.
  - De navigatie is een Utrecht `NavBar` met `NavListLink` items; de huidige pagina wordt aangegeven via `aria-current="page"`.
- **Contentblokken (Utrecht + Amsterdam)**:
  - De “Veelgebruikte diensten” en “Zelf regelen” secties gebruiken Utrecht componenten (o.a. `ButtonLink`, `AccordionProvider`, `PageContent`) en eigen layout helpers (`Row`/`Column`).
  - `PageContent` wordt gebruikt om individuele secties te wrappen voor consistente content styling en max-width beperking.
  - De nieuwslijst gebruikt Amsterdam `Card` componenten (die semantisch als `<article>` renderen) en is daarnaast als lijst gemarkeerd (`role="list"` en `role="listitem"`).
- **Styling (Thema + tokens)**:
  - De Voorbeeld-theme tokens leveren de basis (kleuren/typografie/spacing).
  - Daarbovenop worden een paar Clippy tokens gebruikt om onderdelen als “cards” en pagina-breedte consistent te stylen in de Storybook preview.

## Clippy design tokens (gebruikt in deze template)

Deze startpagina gebruikt een **subset** van de Clippy design tokens (CSS custom properties) om styling consistent te houden in Storybook/preview. De tokens worden gezet in `@nl-design-system-community/theme-wizard-app/clippy-tokens.css` binnen de `.preview-theme` scope (die voor templates op `#storybook-root` wordt gezet).

De Clippy tokens die **direct** terugkomen in de Gemeentevoorbeeld styles zijn:

- **Voorbeeld “card” styling** (gebruikt in `gemeentevoorbeeld/styles.css`)
  - `--clippy-voorbeeld-card-bg`
  - `--clippy-voorbeeld-card-outline`
  - `--clippy-voorbeeld-card-padding-block`
  - `--clippy-voorbeeld-card-padding-inline`
  - `--clippy-voorbeeld-card-row-gap`

De Clippy tokens die **indirect** gebruikt worden (via mapping naar Utrecht tokens in `@nl-design-system-community/theme-wizard-app/theme.css`) zijn o.a.:

- **Page/layout** (o.a. gebruikt door Utrecht “page” componenten en/of in `gemeentevoorbeeld/styles.css`)
  - `--clippy-page-content-padding-block-start`
  - `--clippy-page-content-padding-block-end`
  - `--clippy-page-padding-inline-start`
  - `--clippy-page-padding-inline-end`
  - `--clippy-page-header-padding-block-start`
  - `--clippy-page-header-padding-block-end`
  - `--clippy-section-max-inline-size`
  - `--clippy-page-background-secondary`
  - `--clippy-nav-bar-content-max-inline-size`

NB: in `@nl-design-system-community/theme-wizard-app/theme.css` worden Clippy tokens **gemapt** naar `--utrecht-*` en `--denhaag-*` tokens, zodat componenten die die token-names verwachten dezelfde waarden gebruiken. Tokens voor breadcrumb/side-navigation staan wel in `clippy-tokens.css`, maar worden door de Gemeentevoorbeeld startpagina niet expliciet gebruikt.

## Toegankelijkheid: hoe werken de onderdelen samen?

De toegankelijkheid komt hier vooral uit de combinatie van **structuur**, **semantiek** en **interactiepatronen** die de gebruikte componenten faciliteren:

- **Skiplink + landmarks**:
  - Bovenaan staat een `SkipLink` naar `#main`, zodat toetsenbord- en screenreadergebruikers direct naar de hoofdinhoud kunnen springen.
  - De hoofdinhoud staat in een `<main id="main">…</main>`.
- **Koppen en “visually hidden” labels**:
  - De paginatitel is aanwezig als `h1`, maar visueel verborgen met `ams-visually-hidden` (wel beschikbaar voor screenreaders).
  - De hoofdnavigatie krijgt een screenreader-label via een visueel verborgen `Heading` (“Hoofdnavigatie”).
- **Navigatie feedback**:
  - Het actieve navigatie-item wordt aangeduid met `aria-current="page"`.
- **Gegroepeerde content**:
  - Secties gebruiken `<section>` en (waar relevant) `aria-labelledby`, zodat screenreaders context/sectietitels netjes koppelen.
  - De nieuwskaarten zijn gemarkeerd als lijst (`role="list"` / `role="listitem"`), wat oriëntatie verbetert.
- **Toegankelijke link- en knoplabels**:
  - “Meer lezen” links in nieuws krijgen een expliciet `aria-label` (“Lees meer over …”), zodat meerdere gelijknamige links onderscheidbaar zijn.
- **Semantische elementen**:
  - Datums in nieuws worden gemarkeerd met `<time dateTime="…">`, zodat user agents dit kunnen interpreteren.

## Wanneer gebruik je deze template?

- Voor de publieke homepage van een gemeente.
- Voor demo- en testomgevingen waarin je wil laten zien hoe NL Design System componenten samenwerken in een realistische context.

## Aandachtspunten voor toegankelijkheid

De template is ontworpen met toegankelijkheid als uitgangspunt, maar blijft afhankelijk van de content die je erin plaatst.

- **Koppenstructuur**:
  - Gebruik precies één `h1` voor de paginatitel.
  - Bouw onderliggende koppen (`h2`, `h3`, …) logisch op per sectie (diensten, nieuws).
- **Interactieve elementen**:
  - Links, knoppen en tegels zijn met het toetsenbord te bedienen.
  - Zorg voor voldoende zichtbare focus-states, ook bij thema-aanpassingen.
- **Schermlezers**:
  - Controleer leesvolgorde en aankondigingen met VoiceOver (macOS) of NVDA (Windows).
- **WCAG-audit**:
  - De referentie-implementatie is getest; voer bij hergebruik altijd opnieuw een audit uit (bijvoorbeeld met browser tooling + handmatige tests) om te bevestigen dat contrast, responsiviteit en interactie in jouw context kloppen.

## Content-richtlijnen

- Gebruik **realistische content** en vermijd placeholder tekst zoals "Lorem ipsum".
- Zorg voor **inclusieve voorbeelden**, met diverse namen en situaties.
- Houd teksten kort, taakgericht en begrijpelijk: de bezoeker moet snel zien wat hij of zij op de pagina kan doen.
- Afbeeldingen (indien aanwezig) hebben een **beschrijvende alt-tekst** die uitlegt wat er te zien is of welk doel de afbeelding heeft. Kijk op [NL Design System](https://nldesignsystem.nl/richtlijnen/content/afbeeldingen/) voor meer informatie over alt teksten bij afbeeldingen.
- Plaats de belangrijkste taken zo hoog mogelijk op de pagina, zodat ze direct zichtbaar zijn.

## Cookiebanner component (HTML + CSS)

Bij deze startpagina hoort een **cookiebanner component** (HTML + CSS) met aparte Storybook-documentatie. Dit component is bedoeld om bezoekers op een toegankelijke manier te informeren over cookies en een duidelijke keuze te bieden.

### Doel en gedrag

- **Doel**: informatie geven over cookies en bezoekers in staat stellen bewust toestemming te geven of te weigeren.
- **Gedrag**:
  - verschijnt bij eerste bezoek (of zolang er nog geen voorkeur is opgeslagen);
  - verdwijnt nadat een keuze is gemaakt;
  - komt niet onnodig terug zolang de voorkeur (bijvoorbeeld in een cookie of `localStorage`) geldig is.

### Aandachtspunten voor implementatie

- **Semantiek**:
  - Gebruik een duidelijke container (bijvoorbeeld `<section>` of `<div role="dialog">`) met een titel die aan een `aria-labelledby` is gekoppeld.
  - Zorg dat de banner vóór de hoofdinhoud in de DOM staat, of dat hij focus opvangt wanneer hij opent.
- **Toetsenbordbediening**:
  - Alle knoppen en links in de banner moeten met het toetsenbord bereikbaar zijn.
  - De focus mag niet “vast” komen te zitten in de banner; na sluiten gaat de focus logisch verder.
- **Tekst en keuzes**:
  - Gebruik heldere knoplabels, zoals “Akkoord” en “Alleen noodzakelijke cookies”.
  - Voeg een **“Meer informatie”**-link toe naar een uitgebreide cookie- of privacy­pagina.
- **Responsiveness**:
  - Zorg dat de banner op kleine schermen goed leesbaar blijft en niet de volledige pagina blokkeert.

De concrete HTML- en CSS-implementatie van de cookiebanner is terug te vinden in de bijbehorende component-story. Gebruik deze als uitgangspunt en pas de teksten aan op jullie eigen beleid.

## Integratie in Theme Wizard

- De Storybook story voor deze startpagina importeert het React component direct uit `@nl-design-system-community/theme-wizard-templates` en koppelt deze documentatie via de `docs.description.component` configuratie.
- In de Theme Wizard applicatie wordt de template geregistreerd via de `detail`-export in de bijbehorende `page.astro` file, zodat deze zichtbaar is in de template selector.
- Hergebruik deze template bij voorkeur als **referentie-implementatie**: kopieer componentopbouw, contentstructuur en toegankelijkheids­patronen, maar pas de inhoud en stijl aan op de huisstijl en eisen van de eigen gemeente.
