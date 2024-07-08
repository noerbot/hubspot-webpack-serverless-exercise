# Description

This serverless function takes a form submission, gets geolocation data using IP address, and creates a contact in Hubspot. It was a technical exercise completed as part of my application to Aptitude 8.

### Based on: CMS webpack-bundled serverless functions boilerplate [beta]
Simple boilerplate for using webpack to bundle serverless function with third-party deps

#### NOTE: 
There is a new beta which supports dependency management via a package.json file. See https://docs.google.com/document/d/e/2PACX-1vRGX60V2wQ2Co9X1NO73hkLObcQdNWp2i49XE-pY_DRS6UjZnv4UuODz4nsI_g1gUIXFC1MhN4AFsnZ/pub for more information

## Installation
These are the original installation instructions, but webpack isn't working to build:
1. `git clone` this repo
2. `yarn install`
3. If you're not yet set up with the [CMS CLI](https://designers.hubspot.com/tutorials/getting-started#quick_start) and have a specified `defaultPortal`, use `yarn hs init` to generate a CMS Personal Access Key.
4. `yarn build` to build with webpack into `/dist`
5. `yarn deploy` to build and deploy to `defaultPortal`
6. `yarn start` to build, deploy, and watch/auto-upload to `defaultPortal`]

## Installation (alternative)
You can alternatively upload files to Hubspot using the Hubspot CLI:
1. From a parent directory where you have `hubspot.config.yml` already set up, run `hs watch hubspot-webpack-serverless-exercise --initial-upload`
2. Test the `hello-world` endpoint by making a `GET` request via Postman using this format: `https://{domainName}/_hcms/api/hello-world?name={yourName}`

### Additional setup for `/geolocation` endpoint
1. In Hubspot, create a private app via Settings > Integrations > Private Apps, including scopes for reading/writing to users. Once created, copy your Access Token.
2. Use `hs secrets add HS_ACCESS_TOKEN` to give access to this key in your serverless functions via `process.env`. [Read more about this feature here](https://designers.hubspot.com/docs/developer-reference/local-development-cms-cli#serverless-commands).
3. Obtain an API key from: https://ipgeolocation.io/
4. Use `hs secrets add IP_GEO_API_KEY` to set this key.

## Helpful Resources
- [GitHub Repo: hubspot-webpack-serverless-exercise](https://github.com/noerbot/hubspot-webpack-serverless-exercise)
- [Node package: Hubspot api-client](https://www.npmjs.com/package/@hubspot/api-client)
    - [GitHub Repo: hubspot-api-nodejs](https://github.hubspot.com/hubspot-api-nodejs/)
- [Hubspot API: Contacts](https://developers.hubspot.com/docs/api/crm/contacts)
- [Hubspot CLI](https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli)
- [Hubspot Serverless Functions: Reference](https://developers.hubspot.com/docs/cms/data/serverless-functions/reference)
