# Zoekresultaten template

Bied bezoekers een krachtige zoekervaring met filters, sortering en duidelijke resultaatweergave. Deze zoekresultaten template helpt bezoekers snel te vinden wat ze zoeken binnen de content van je organisatie.

Gebruik deze template als basis voor je eigen zoekfunctionaliteit, in combinatie met de huisstijl die je maakt met de Theme Wizard. De template werkt met het **Start-thema** en past zich automatisch aan jouw huisstijl aan via design tokens.

> Meer over hoe templates en thema's samenwerken? Zie de [algemene template-documentatie](../../../docs/templates.md).

## Opbouw van de pagina

De zoekresultaten pagina is opgebouwd uit herbruikbare NL Design System componenten, zoals:

- **Zoekformulier**: voor het invoeren en aanpassen van zoekopdrachten
- **Filters**: voor het verfijnen van resultaten op periode
- **Resultatenlijst**: voor het tonen van zoekresultaten met metadata
- **Sortering**: voor het ordenen van resultaten op relevantie of datum

Zie `@nl-design-system-community/theme-wizard-templates` voor de concrete implementatie van `SearchResults` en de exacte prop-definities.

## Gebruikte componenten

Deze template combineert componenten uit meerdere NL Design System libraries:

- **NL Design System (candidate)**:
  - Navigatie:
    - [Skip Link](https://nldesignsystem.nl/skip-link)
  - Content:
    - [Heading](https://nldesignsystem.nl/heading)
    - [Paragraph](https://nldesignsystem.nl/paragraph)
- **Utrecht Design System**:
  - Paginastructuur:
    - Page Body
    - Page Content
  - Formulieren:
    - [Fieldset](https://nldesignsystem.nl/fieldset), Fieldset Legend
    - Form Field, Form Label
    - [Radio Button](https://nldesignsystem.nl/radio-button)
    - [Textbox](https://nldesignsystem.nl/textbox)
  - Interactie:
    - [Button](https://nldesignsystem.nl/button), Button Group
- **Clippy Components** (web components):
  - `clippy-button`: voor zoekknop
- **Tabler Icons** (functionele iconen):
  - `IconTarget`, `IconCalendar` (sorteerindicatoren)
  - `IconSearch` (zoekformulier)

## Hoe werken deze componenten samen?

- **Layout & structuur**:
  - De pagina gebruikt een twee-kolommen grid: filters in de sidebar, resultaten in de hoofdkolom
  - Het zoekformulier staat bovenaan voor directe toegang
  - Elk zoekresultaat is een clickable `<a>` block met semantisch `<article>` wrapper
  - Resultaattitels gebruiken native `<h3>` elementen

- **Zoeken & filteren**:
  - Het zoekformulier staat bovenaan en blijft altijd zichtbaar
  - Filters zijn gegroepeerd in een `<aside>` met `aria-label="Zoekfilters"`
  - De periode filter gebruikt radio buttons voor exclusieve keuzes
  - Filterwijzigingen triggeren direct een nieuwe zoekopdracht (via callbacks)

- **Resultaten weergeven**:
  - Elk resultaat is een clickable block (hele `<a>` tag) zoals Rijksoverheid.nl
  - Het resultaatenaantal heeft `role="status"` voor screenreader aankondigingen
  - Elk resultaat toont: titel (h3), beschrijving, type en datum binnen de link
  - De sorteervolgorde wordt visueel aangegeven met icoon en tekst
  - Hover en focus states maken het clickable area duidelijk zichtbaar

- **Interactie patronen**:
  - Alle interactieve elementen zijn toetsenbord toegankelijk
  - De sorteer dropdown is een native `<select>` voor maximale toegankelijkheid
  - Buttons hebben duidelijke `aria-label` attributen
  - Live regions kondigen wijzigingen aan zonder focus te verplaatsen

## Clippy design tokens (gebruikt in deze template)

Deze zoekresultaten pagina gebruikt Utrecht design tokens voor consistente styling. De belangrijkste tokens zijn:

- **Kleuren**:
  - `--utrecht-color-grey-90` (tekst)
  - `--utrecht-color-blue-5`, `--utrecht-color-blue-30` (filter achtergrond)

- **Spacing**:
  - `--basis-space-row-*` (verticale afstanden)
  - `--basis-space-inline-*` (horizontale afstanden)

- **Layout**:
  - `--utrecht-button-border-radius` (afgeronde hoeken)

De tokens worden gemapt in `@nl-design-system-community/theme-wizard-app/theme.css` en kunnen worden overschreven in je eigen thema.

## Toegankelijkheid: hoe werken de onderdelen samen?

De toegankelijkheid komt hier vooral uit de combinatie van **structuur**, **semantiek** en **interactiepatronen** die de gebruikte componenten faciliteren:

- **Skiplink naar de main landmark**:
  - Gebruik een [Skip Link](https://nldesignsystem.nl/skip-link) naar `#main`, zodat toetsenbord- en screenreadergebruikers direct naar de hoofdinhoud kunnen springen
  - De hoofdinhoud staat in een `<main id="main" aria-label="Zoekresultaten">…</main>`

- **Koppen en semantische structuur**:
  - De `<main>` heeft `aria-label="Zoekresultaten"` voor context
  - Resultaatenaantal is een `h2` voor duidelijke hiërarchie
  - Elke resultaattitel is een `h3` binnen een `<article>`
  - Filters hebben een visueel verborgen `h2` "Vul zoekcriteria in" voor screenreaders

- **Live regions voor dynamische content**:
  - Het resultaatenaantal heeft `role="status"` zodat wijzigingen worden aangekondigd
  - De sorteerindicator heeft ook `aria-live="polite"` voor feedback bij wijzigingen

- **Formulier toegankelijkheid**:
  - Alle form controls hebben geassocieerde labels via `htmlFor`/`id`
  - Radio buttons zijn gegroepeerd in een `<fieldset>` met `<legend>`
  - De fieldset heeft `role="radiogroup"` voor extra context

- **Resultaten lijst**:
  - Elk resultaat is een `<article>` met `aria-labelledby` die verwijst naar de titel
  - Metadata (type, datum) heeft eigen `aria-label` voor context
  - Datums gebruiken `<time dateTime="…">` voor machine-leesbaarheid
  - Positie-informatie is visueel verborgen maar beschikbaar voor screenreaders

- **Toetsenbordnavigatie**:
  - Alle interactieve elementen zijn bereikbaar met Tab
  - Native `<select>` voor sortering werkt met pijltjestoetsen
  - Buttons activeren met Enter of Spatie
  - Focus indicators zijn zichtbaar (via Utrecht component styling)

## Aandachtspunten voor toegankelijkheid

De template is ontworpen met toegankelijkheid als uitgangspunt, maar blijft afhankelijk van de content die je erin plaatst. Door componenten uit NL Design System te gebruiken in combinatie met de Theme Wizard voorkom je tientallen soorten toegankelijkheidsfouten.

- **Koppenstructuur**:
  - De pagina heeft geen `h1` - context wordt gegeven via `aria-label` op `<main>`
  - Eerste zichtbare kop is `h2` voor resultaatenaantal
  - Individuele resultaattitels zijn `h3` binnen `<article>` elementen
  - Spring geen niveaus over in de hiërarchie

- **Kleurcontrast**:
  - Alle tekst voldoet aan WCAG 2.1 Level AA (4.5:1 voor normale tekst, 3:1 voor grote tekst)
  - Links gebruiken Utrecht design system kleuren met proper visited states
  - Focus indicators (2px outline) zijn altijd zichtbaar
  - Buttons gebruiken Utrecht design system appearances die getest zijn op contrast

- **Focus management**:
  - Verplaats focus niet automatisch bij filterwijzigingen
  - Gebruik `aria-live` regions om wijzigingen aan te kondigen zonder focus te verstoren
  - Zorg dat focus indicators altijd zichtbaar zijn

- **Foutafhandeling**:
  - Toon duidelijke foutmeldingen bij mislukte zoekopdrachten
  - Gebruik `role="alert"` voor urgente meldingen
  - Geef suggesties voor het verbeteren van de zoekopdracht

## Content-richtlijnen

- **Zoekresultaten**:
  - Gebruik beschrijvende titels die de inhoud van de pagina samenvatten
  - Schrijf korte, informatieve beschrijvingen (max 2-3 zinnen)
  - Vermeld altijd het type document (Onderwerp, Publicatie, etc.)
  - Toon publicatiedatum waar relevant

- **Filters**:
  - Gebruik duidelijke labels voor filteropties
  - Beperk het aantal filters tot de meest gebruikte (op basis van gebruikersonderzoek)
  - Toon het aantal resultaten per filteroptie indien mogelijk

- **Lege staten**:
  - Geef een duidelijke melding bij geen resultaten: "Geen resultaten gevonden voor '[zoekopdracht]'"
  - Bied suggesties: "Probeer andere zoektermen" of "Verwijder filters"
  - Toon eventueel gerelateerde content of veelgestelde vragen

- **Foutmeldingen**:
  - Wees specifiek over wat er mis ging: "De zoekopdracht kon niet worden uitgevoerd"
  - Geef een actie: "Probeer het opnieuw" met een knop
  - Vermijd technisch jargon

## Component hiaten en aanbevelingen

Deze template gebruikt een combinatie van bestaande NLDS componenten en custom implementaties. De volgende componenten ontbreken momenteel in NLDS en zijn custom geïmplementeerd:

### Ontbrekende componenten

1. **Filter/Facet component**
   - Huidige oplossing: Custom `SearchFiltersComponent` met Utrecht form componenten
   - Aanbeveling: Maak een `clippy-search-filters` component met support voor verschillende filtertypes

3. **Badge/Indicator component**
   - Huidige oplossing: Custom `<span>` voor sorteerindicator
   - Aanbeveling: Maak een `clippy-badge` component voor status en count indicators

### Interoperabiliteit

De template combineert web components (`clippy-*`) met React components (`@nl-design-system-candidate/*`). Dit werkt goed, maar let op:

- **Event handling**: Web components gebruiken native DOM events, React components gebruiken synthetic events
- **TypeScript**: Web components hebben beperkte type-safety in JSX
- **Styling**: Zorg dat design tokens consistent worden gebruikt over beide systemen

## Bekende beperkingen

Deze template is een referentie-implementatie en heeft enkele beperkingen die je moet oplossen voor productiegebruik:

1. **Geen paginering**: Toont alle resultaten tegelijk (voeg paginering toe voor grote resultaatsets)
2. **Mock data**: Gebruikt statische data (vervang met API-integratie)
3. **Geen URL sync**: Filters en zoekopdracht worden niet gesynchroniseerd met de URL
4. **Geen autocomplete**: Zoekformulier heeft geen suggesties tijdens typen
5. **Geen highlighting**: Zoektermen worden niet gemarkeerd in resultaten
6. **Placeholder export**: Export functionaliteit is nog niet geïmplementeerd

## Integratie in Theme Wizard

Deze template dient als **referentie-implementatie**: kopieer de componentopbouw, contentstructuur en toegankelijkheidspatronen, maar pas de inhoud en stijl aan op de huisstijl en eisen van je eigen organisatie.

### Aanpassen voor je organisatie

1. **Vervang mock data** met je eigen zoek-API
2. **Pas filters aan** op basis van je content types en gebruikersonderzoek
3. **Voeg paginering toe** voor grote resultaatsets
4. **Implementeer URL sync** voor deelbare zoekresultaten
5. **Voeg autocomplete toe** voor betere gebruikerservaring
6. **Implementeer export** functionaliteit (CSV, PDF)

### Design tokens aanpassen

Overschrijf de volgende tokens in je eigen thema voor custom styling:

```css
/* Filters */
--utrecht-color-blue-5: #e6f2ff;
--utrecht-color-blue-30: #99ccff;

/* Spacing */
--basis-space-row-lg: 1.5rem;
--basis-space-inline-lg: 1.5rem;
```
