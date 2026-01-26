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

## Gebruikte componentbibliotheken (en rol in de pagina)

Deze template combineert componenten uit meerdere (NL Design System) libraries:

- **NL Design System (candidate) – React**:
  - `SkipLink` – `@nl-design-system-candidate/skip-link-react/css`
  - `Heading` – `@nl-design-system-candidate/heading-react/css`
  - `Link` – `@nl-design-system-candidate/link-react/css`
  - `Paragraph` – `@nl-design-system-candidate/paragraph-react`
- **Utrecht component library – React (standalone packages)**:
  - `PageBody` – `@utrecht/page-body-react`
  - `PageHeader` – `@utrecht/page-header-react`
  - `PageFooter` – `@utrecht/page-footer-react`
  - `NavBar` – `@utrecht/nav-bar-react`
- **Utrecht component library – React (CSS Modules)**:
  - `PageContent` – `@utrecht/component-library-react/dist/css-module`
  - `AccordionProvider` – `@utrecht/component-library-react/dist/css-module`
  - `ButtonLink` – `@utrecht/component-library-react/dist/css-module`
  - `LinkList`, `LinkListLink` – `@utrecht/component-library-react/dist/css-module`
  - `Image` – `@utrecht/component-library-react/dist/css-module`
- **Utrecht component library – React (reguliere export)**:
  - `NavList`, `NavListLink` – `@utrecht/component-library-react`
  - `Icon` – `@utrecht/component-library-react`
- **Utrecht web component library – React (toptask iconen)**:
  - `UtrechtIconPaspoort`, `UtrechtIconMeldingKlacht`, `UtrechtIconVerhuizen`, `UtrechtIconWerken`, `UtrechtIconNummerbord`, `UtrechtIconAfvalScheiden` – `@utrecht/web-component-library-react`
- **Tabler Icons (functionele iconen)**:
  - `IconUser`, `IconCalendar`, `IconChevronRight`, `IconCalendarEvent` – `@tabler/icons-react`
- **Amsterdam Design System**:
  - `Card` – `@amsterdam/design-system-react`
  - `ams-visually-hidden` CSS utility – `@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css`

## Hoe werken deze componenten samen?

- **Layout & structuur (Utrecht + NL Design System)**:
  - De pagina gebruikt Utrecht “page” structuur (`PageBody`, `PageHeader`, `PageContent`, `PageFooter`) en vult die met NL Design System `Heading`/`Link`.
  - `PageBody`, `PageHeader`, `PageFooter` en `NavBar` worden standalone geïmporteerd (resp. `@utrecht/page-body-react`, `@utrecht/page-header-react`, `@utrecht/page-footer-react`, `@utrecht/nav-bar-react`), omdat Utrecht Design System deze componenten naar losse npm-packages aan het migreren is.
  - `PageContent` wordt geïmporteerd uit `@utrecht/component-library-react/dist/css-module` en wordt gebruikt om de hoofdinhoud te wrappen in verschillende secties (MainIntro, SelfService, News) en zorgt voor consistente padding en max-width styling.
  - De navigatie is een Utrecht `NavBar` met `NavListLink` items; de huidige pagina wordt aangegeven via `aria-current="page"`.
- **Contentblokken (Utrecht + Amsterdam)**:
  - De “Veelgebruikte diensten” en “Zelf regelen” secties gebruiken Utrecht componenten (o.a. `ButtonLink`, `AccordionProvider`, `PageContent`) en eigen layout helpers (`Row`/`Column`).
  - De nieuwslijst gebruikt Amsterdam `Card` componenten (die semantisch als `<article>` renderen) en is daarnaast als lijst gemarkeerd (`role="list"` en `role="listitem"`).
- **Styling (Thema + tokens)**:
  - De Voorbeeld-theme tokens leveren de basis (kleuren/typografie/spacing).
  - Daarbovenop worden een paar Clippy tokens gebruikt om onderdelen als “cards” en pagina-breedte consistent te stylen in de Storybook preview.

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
  - Bovenaan staat een `SkipLink` naar `#main`, zodat toetsenbord- en screenreadergebruikers direct naar de hoofdinhoud kunnen springen.
  - De hoofdinhoud staat in een `<main id="main">…</main>`.
- **Koppen en “visually hidden” labels**:
  - De hoofdkop is aanwezig als `h1`, maar visueel verborgen met `ams-visually-hidden` (wel beschikbaar voor screenreaders).
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

- Voor de publieke homepage van een gemeente of een andere (semi)-overheidsorganisatie.

## Aandachtspunten voor toegankelijkheid

De template is ontworpen met toegankelijkheid als uitgangspunt, maar blijft afhankelijk van de content die je erin plaatst. Door componenten uit NL Design System te gebruiken in combinatie met de Theme Wizard voorkom je tientallen soorten toegankelijkheidsfouten.

- **Koppenstructuur**:
  - Gebruik precies één `h1` voor de hoofdkop.
  - Bouw onderliggende koppen logisch op: `h2` voor secties (diensten, nieuws), `h3` voor items binnen een sectie (nieuwstitels, accordion-onderdelen).
- **Schermlezers**:
  - Controleer leesvolgorde en aankondigingen met VoiceOver (macOS) of NVDA (Windows).

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

- De Storybook story voor deze startpagina importeert het React component direct uit `@nl-design-system-community/theme-wizard-templates` en koppelt deze documentatie via de `docs.description.component` configuratie.
- In de Theme Wizard applicatie wordt de template geregistreerd via de `detail`-export in de bijbehorende `page.astro` file, zodat deze zichtbaar is in de template selector.
- Deze template dient bij voorkeur als **referentie-implementatie**: kopieer de componentopbouw, contentstructuur en toegankelijkheids­patronen, maar pas de inhoud en stijl aan op de huisstijl en eisen van de eigen gemeente.
