# Application Design

Theme Wizard allows users to create their own NL Design System themes.
It does this by loading in an [https://github.com/nl-design-system/themes/tree/main/packages/start-design-tokens](existing tree of design tokens).

## Sequence Diagram

```mermaid
sequenceDiagram
  actor User
  User->>+App: Opens app
  create participant Theme
  App->>+Theme: Creates
  Theme->>-App: Returns stylesheet
  App->>+Preview: Sets stylesheet
  App->>Preview: Sets initial template
  create participant Scraper
  Preview->>+Scraper: Requests CSS from URL
  Scraper->>-Preview: Returns CSS for template
  Preview->>-App: Renders template with theme
  App->>-User: Shows preview

  opt Editing tokens
  App->>User: Shows token values as form
  User->>+App: Changes token value
  App->>-Theme: Updates theme token
  Theme->>Theme: Updates stylesheet
  Preview->>Preview: Rerenders due to stylesheet change
  end

  opt Fetching token options
  User->>+App: Inputs URL to scrape 
  App->>+Scraper: Requests tokens from URL
  Scraper->>-App: Returns tokens
  App->>App: Updates options with scraped tokens
  App->>-User: Shows token options
  opt Managing token options
  User->>+App: Removes token option
  App->>-User: Shows token options
  end
  end

  opt Changing templates
  User->>+App: Selects different template
  App->>+Preview: Sets specified template
  Preview->>+Scraper: Requests CSS from URL
  Scraper->>-Preview: Returns CSS for template
  Preview->>-App: Renders template with theme
  App->>-User: Shows preview
  end
```

## Class Diagram

> [!IMPORTANT]  
> This diagram is under development

```mermaid

classDiagram
    class DesignToken:::Object {
        +$type
        +$value
        +$extensions
    }

    TokenTree *-- TokenTree
    TokenTree o-- DesignToken
    class TokenTree:::Object {
        +TokenTree | DesignToken [key]
    }

    ColorScale ..> ColorToken
    ColorScale ..> TokenTree
    class ColorScale {
        +ColorToken from
        +list() Array~ColorToken~
        +get() ColorToken
        +toObject() TokenTree
    }

    Theme ..> TokenTree
    Theme ..> CSSStylesheet
    class Theme {
        +TokenTree defaults$
        +TokenTree defaults
        +TokenTree tokens
        +CSSStylesheet stylesheet
        +reset()
        +toCSS() string
    }

    App ..> Theme
    App ..> Scraper
    App ..> Option
    class App:::Singleton {
        +Theme theme
        +Scraper scraper
        +Array~Option~ options
    }

    Scraper ..> DesignToken
    class Scraper {
        -URL scraperURL
        +getCSS(url) string   
        +getTokens(url) Array~DesignToken~   
    }

    Option ..> DesignToken
    Option ..> ColorScale
    class Option {
        +string title
        +DesignToken | ColorScale value
    }

    ColorToken ..|> DesignToken
    class ColorToken {
        +toCSSColorFunction() string
        +toHex() string
        +toObject() DesignToken
    }

    TokenEditField ..|> DesignToken
    TokenEditField ..> Option
    class TokenEditField:::UI {
        +DesignToken token
        +string path
        +DesignToken[$value] value
        +Array~Option~ options
        -emit("change")
    }

classDef Object fill:#eff,stroke:#9cc
classDef Singleton fill:#fee,stroke:#c99
classDef UI fill:#ffe,stroke:#cc9
```
