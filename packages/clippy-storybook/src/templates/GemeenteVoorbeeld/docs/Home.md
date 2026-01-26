# Startpagina template

Bied bezoekers een overzichtelijke toegang tot veelgebruikte diensten, actueel nieuws en contactinformatie. Deze homepage helpt bezoekers snel te vinden wat ze zoeken.

Gebruik deze template als basis voor je eigen website, in combinatie met de huisstijl die je maakt met de Theme Wizard. De template werkt met het **Start-thema** en past zich automatisch aan jouw huisstijl aan via design tokens.

> Meer over hoe templates en thema's samenwerken? Zie de [algemene template-documentatie](../../../docs/templates.md).

## Opbouw van de pagina

De startpagina is opgebouwd uit herbruikbare NL Design System componenten, zoals:

- **Banner**: voor gemeente logo en gebruikerssessie navigatie ("Mijn omgeving")
- **Paginaheader**: voor gemeentenaam, merkidentiteit en hoofdnavigatie.
- **Uitgelichte diensten / tegels**: voor snelle toegang tot veelgebruikte digitale diensten.
- **Nieuwssectie**: voor actuele berichten.
- **Paginafooter**: voor contactgegevens, service-links en aanvullende navigatie.

Zie `@nl-design-system-community/theme-wizard-templates` voor de concrete implementatie van `GemeenteVoorbeeldHome` en de exacte prop-definities.

## Gebruikte componenten

Deze template combineert componenten uit meerdere NL Design System libraries:

- **NL Design System (candidate)**:
  - Navigatie:
    - [Skip Link](https://nldesignsystem.nl/skip-link)
    - [Link](https://nldesignsystem.nl/link)
  - Content:
    - [Heading](https://nldesignsystem.nl/heading)
    - [Paragraph](https://nldesignsystem.nl/paragraph)
- **Utrecht Design System**:
  - Paginastructuur:
    - Page Body
    - [Page Header](https://nldesignsystem.nl/page-header)
    - Page Content
    - [Page Footer](https://nldesignsystem.nl/page-footer)
  - Navigatie:
    - [Navigation Bar](https://nldesignsystem.nl/navigation-bar)
    - Navigation List, Navigation List Link
    - [Accordion](https://nldesignsystem.nl/accordion)
    - ButtonLink
  - Content:
    - [Link List](https://nldesignsystem.nl/link-list), Link List Link
    - [Image](https://nldesignsystem.nl/image)
    - [Icon](https://nldesignsystem.nl/icon)
  - Toptask iconen (web components): Utrecht Icon set
- **Amsterdam Design System**:
  - [Card](https://nldesignsystem.nl/card-as-link)
- **Tabler Icons** (functionele iconen):
  - `IconUser`, `IconCalendar`, `IconCalendarEvent`, `IconChevronRight`

## Hoe werken deze componenten samen?

- **Layout & structuur**:
  - De pagina gebruikt de "page" structuur ([Page Header](https://nldesignsystem.nl/page-header), [Page Footer](https://nldesignsystem.nl/page-footer)) en vult die met [Heading](https://nldesignsystem.nl/heading) en [Link](https://nldesignsystem.nl/link).
  - De navigatie is een [Navigation Bar](https://nldesignsystem.nl/navigation-bar); de huidige pagina wordt aangegeven via `aria-current="page"`.
- **Contentblokken**:
  - De "Veelgebruikte diensten" en "Zelf regelen" secties gebruiken [Accordion](https://nldesignsystem.nl/accordion) en [Button](https://nldesignsystem.nl/button) componenten.
  - De nieuwslijst gebruikt [Card](https://nldesignsystem.nl/card-as-link) componenten (semantisch als `<article>`) en is als lijst gemarkeerd (`role="list"` en `role="listitem"`). De kaarten kunnen optioneel een afbeelding bevatten; zorg dan voor een beschrijvende alt-tekst die de inhoud van de afbeelding uitlegt. Meer hierover bij [Content-richtlijnen](#content-richtlijnen).

## Clippy design tokens (gebruikt in deze template)

Deze startpagina gebruikt een **subset** van de Clippy design tokens (CSS custom properties) om styling consistent te houden in Storybook/preview. De tokens worden gezet in `@nl-design-system-community/theme-wizard-app/clippy-tokens.css` binnen de `.preview-theme` scope (die voor templates op `#storybook-root` wordt gezet).

De Clippy tokens die **direct** terugkomen in de Gemeentevoorbeeld styles zijn:

- **Voorbeeld “card” styling** (gebruikt in `gemeentevoorbeeld/styles.css`)
  - `--clippy-voorbeeld-card-background-color`
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
  - `--clippy-page-secondary-background-color`
  - `--clippy-nav-bar-content-max-inline-size`

NB: in `@nl-design-system-community/theme-wizard-app/theme.css` worden Clippy tokens **gemapt** naar `--utrecht-*` en `--denhaag-*` tokens, zodat componenten die die token-names verwachten dezelfde waarden gebruiken. Tokens voor breadcrumb/side-navigation staan wel in `clippy-tokens.css`, maar worden door de Gemeentevoorbeeld startpagina niet expliciet gebruikt.

## Toegankelijkheid: hoe werken de onderdelen samen?

De toegankelijkheid komt hier vooral uit de combinatie van **structuur**, **semantiek** en **interactiepatronen** die de gebruikte componenten faciliteren:

- **Skiplink naar de main landmark**:
  - Gebruik een [Skip Link](https://nldesignsystem.nl/skip-link) naar `#main`, zodat toetsenbord- en screenreadergebruikers direct naar de hoofdinhoud kunnen springen.
  - Indien er gebruik wordt gemaakt van een Cookie Banner, moet de Cookie Banner voor de Skip Link geplaatst worden.
  - De hoofdinhoud staat in een `<main id="main">…</main>`.
- **Koppen en “visually hidden” labels**:
  - De hoofdkop (`h1`) is visueel verborgen met `ams-visually-hidden`, maar wel beschikbaar voor screenreaders. De tekst van de verborgen `h1` moet overeenkomen met de `<title>` van de pagina:
    - **Homepage**: `<title>Gemeente Voorbeeld</title>` + `<h1>Gemeente Voorbeeld</h1>`
    - **Andere pagina's**: `<title>Paspoort aanvragen - Gemeente Voorbeeld</title>` + `<h1>Paspoort aanvragen</h1>`
  - De hoofdnavigatie krijgt een toegankelijke naam via een visueel verborgen Heading: (“Hoofdnavigatie”).
- **Navigatie feedback**:
  - Het actieve navigatie-item (Navigation List Link) wordt aangeduid met `aria-current="page"`.
- **Gegroepeerde content**:
  - Secties gebruiken `<section>` en (waar relevant) `aria-labelledby`, zodat screenreaders context/sectietitels netjes koppelen.
  - De nieuwskaarten ([Card](https://nldesignsystem.nl/card-as-link)) zijn gemarkeerd als lijst (`role="list"` / `role="listitem"`), wat oriëntatie verbetert.
- **Toegankelijke link- en knoplabels**:
  - “Meer lezen” links ([Link](https://nldesignsystem.nl/link)) in nieuws krijgen een expliciet `aria-label` (“Lees meer over …”), zodat meerdere gelijknamige links onderscheidbaar zijn.
- **Semantische elementen**:
  - Datums in nieuws worden gemarkeerd met `<time dateTime="…">`, zodat user agents dit kunnen interpreteren.

## Aandachtspunten voor toegankelijkheid

De template is ontworpen met toegankelijkheid als uitgangspunt, maar blijft afhankelijk van de content die je erin plaatst. Door componenten uit NL Design System te gebruiken in combinatie met de Theme Wizard voorkom je tientallen soorten toegankelijkheidsfouten.

- **Koppenstructuur**:
  - Gebruik precies één `h1` voor de hoofdkop.
  - Bouw onderliggende koppen logisch op: `h2` voor secties (diensten, nieuws), `h3` voor items binnen een sectie (nieuwstitels, accordion-onderdelen).

## Content-richtlijnen

- Gebruik realistische content en vermijd placeholder tekst zoals "Lorem ipsum".
- Zorg voor inclusieve voorbeelden, met diverse namen en situaties.
- Afbeeldingen hebben een **beschrijvende alt-tekst** die uitlegt wat er te zien is. Bijvoorbeeld bij de nieuwskaart "Hoe moeten onze lammetjes heten?": `alt="Schaap met twee pasgeboren lammetjes"` in plaats van `alt="Nieuwsafbeelding"`. Zie [NL Design System](https://nldesignsystem.nl/richtlijnen/content/afbeeldingen/) voor meer informatie.
- Plaats de belangrijkste taken zo hoog mogelijk op de pagina, zodat ze direct zichtbaar zijn. [Doe gebruikersonderzoek](https://gebruikersonderzoeken.nl/docs/onderzoek-doen/) om te weten wat de belangrijkste taken zijn, dat verschilt per organisatie.

## Cookie Banner component (HTML + CSS)

Bij deze startpagina hoort een **Cookie Banner component** (HTML + CSS) met aparte Storybook-documentatie. Dit component is bedoeld om bezoekers op een toegankelijke manier te informeren over cookies en een duidelijke keuze te bieden.

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

De concrete HTML- en CSS-implementatie van de Cookie Banner is terug te vinden in de bijbehorende component-story. Gebruik deze als uitgangspunt en pas de teksten aan op jullie eigen beleid.

## Integratie in Theme Wizard

Deze template dient als **referentie-implementatie**: kopieer de componentopbouw, contentstructuur en toegankelijkheidspatronen, maar pas de inhoud en stijl aan op de huisstijl en eisen van je eigen organisatie.
