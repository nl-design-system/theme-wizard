# Theme Wizard server

## Try the server

Open the [Swagger UI on http://localhost:8080/api/docs](http://localhost:8080/api/docs) to use the server and see all the options in the REST API.

## From a website URL to design tokens JSON

If you want to use the design for an existing website for a new project, you can use this convenient API to analyse the relevant CSS and return the result in Design Tokens JSON format. The result can contain the following types of tokens.

For example, use the following API to get a Design Tokens JSON with all design token values found in the CSS of a the website.

Example: [http://localhost:8080/api/v1/css-design-tokens?url=https://example.com/](http://localhost:8080/api/v1/css-design-tokens?url=https://example.com/)

## Get all CSS from a website URL

For example, use the following API to get a Design Tokens JSON with all design token values found in the CSS of a the website.

Example: [http://localhost:8080/api/v1/css?url=https://example.com/](http://localhost:8080/api/v1/css?url=https://example.com/)
