# Componentenpagina

## Data

Per component hebben we de volgende informatie nodig:

- `@nl-design-system-candidate/[component]-docs` package
  - [Example](https://github.com/nl-design-system/candidate/blob/main/packages/docs/code-docs/README.md)
  - Export `/[component].react.meta`: bevat `argTypes` en `component` (de React-renderable component)
    - Robbert's PoC voegt ook `parameters.tokens` toe aan de `meta`, een directe link naar `@nl-design-system-candidate/[component]-tokens` package
    - Robbert's PoC voegt ook
  - Export `/[component].stories.tsx`: export de verschillende stories zoals ze in storybook gerenderd worden
    - Robbert's Proof of Concept dupliceert deze file lokaal om er 'Design Stories' aan toe te voegen zodat alle Design Tokens gedemonstreerd kunnen worden
    - Sommige/alle? van die design stories exporteren per story een `parameters.tokens.nl.[component].[token-id]` tree om the duiden welke tokens configureerbaar zijn voor de story. Die kunnen we gebruiken om te bepalen _welke_ inputs we moeten renderen (niet welk type, die moeten we elders bepalen)
    - Export een Storybook-compatible `Story`-like object
- `@nl-design-system-candidate/[component]-tokens` package
  - [Example](https://github.com/nl-design-system/candidate/blob/main/packages/tokens/code-tokens/tokens.json)
  - Export `/tokens`: een object met
    - welke tokens instelbaar zijn voor de component
      - per token welke CSS property syntax (`<color>`, `<length`>, etc.)
      - per token welke `$type` (let wel: bevat legacy/non-standard types zoals `fontFamilies`, `fontSizes` als standaard `color`)
    - Deze informatie kunnen we gebruiken i.c.m. bovenstaand `parameters` om te bepalen _welk type_ token input we renderen
- Theme wizard app verzamelt alle componenten in een lijst
  - Hardcoded voor nu, bedoeling is vooraleerst alle candidate componenten maar later ook community componenten
  - TBD: waar vinden alle imports plaats?
    - `index.ts` import nu alle `[component].react.meta` componenten
    - ⚠️ `wizard-story-react-element` import nu zelf alle CSS voor de component vanwege shadown DOM boundaries maar is suboptimaal
  - Loop over lijst en render sectie per component:
    - Component naam
    - Intro docs
    - Toon HTML+CSS voorbeeldcode <-- Hoe komen we hieraan?
    - Toon React voorbeeldcode <-- komt uit bovestaande packages
    - Toon alle bestaande stories
      - Render Design Token inputs per story
      - Live-update de story na aanpassen token
    - Later: voeg design stories toe

## Loose thoughts

- `wizard-story-react-element` zou gewoon een `wizard-react-element` moeten zijn die een `.Component` en wat andere properties krijgt
