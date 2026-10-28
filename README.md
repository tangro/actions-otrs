# tangro/actions-otrs

Checks GitHub issue bodies and comments for OTRS Urls. Found OTRS Urls will be formatted with Markdown and the OTRS ticket will be notified via a note that an issue has linked to this ticket. Also a (configurable) label will be added to the issue. Another notification will be sent out when an issue referencing a ticket is closed.

> **Attention** This action is suited for our needs at @tangro. There is a high possibility that it won't work for you. Reach out to us if you're interested in using it in your workflows.

> **Attention** You need to set `OTRS_URL` and `OTRS_URL_REST` as github environment variables.

# Example job

```yml
name: Check for OTRS Ticket Urls
on:
  issues:
    types: [opened, edited, closed]
  issue_comment:
    types: [created, edited]
jobs:
  otrs:
    name: Check for OTRS tickets
    runs-on: ubuntu-latest
    steps:
      - name: Check for OTRS tickets
        uses: tangro/actions-otrs@v1.0.16
        env:
          OTRS_USERNAME: ${{ secrets.OTRS_USERNAME }}
          OTRS_PASSWORD: ${{ secrets.OTRS_PASSWORD }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_CONTEXT: ${{ toJson(github) }}
        with:
          label: 'Ticket'
```

> **Attention** Do not forget to pass the `GITHUB_TOKEN`, the `GITHUB_CONTEXT` the `OTRS_USERNAME` and the `OTRS_PASSWORD` via `env` variables. The `OTRS_USERNAME` and `OTRS_PASSWORD` have to be added to the secrets configuration.

Steps the example job will perform:

1.  Only act when an issue body gets created, edited or closed or an issue comment gets created or edited
2.  Run the action which will check the text and works its magic

# Usage

The action will only run on events _issues_ and _issue_comment_ so make sure that your workflow only runs on those, too. Also you'll need a user inside OTRS with the sufficient rights to read issues and post notes. The credentials of this user have to be saved in the secret configuration under `OTRS_USERNAME` and `OTRS_PASSWORD`.

## Parameters

- `label` - The action will automatically add a label when a ticket URL has been found. By default it will add a `Ticket` label. You can set a different label here.

# Development

Use Node.js 24 for development. The action runs on the GitHub Actions Node.js 24
runtime independently of the Node.js version selected by `actions/setup-node`.
Self-hosted runners must support the Node.js 24 action runtime.

Run `npm ci` followed by `npm run build`. The build compiles TypeScript with
`tsc` before bundling the generated JavaScript with `ncc`, whose TypeScript
loader does not support the native TypeScript 7 compiler.
TypeScript preserves ESM imports so `ncc` can bundle the ESM-only dependencies
into the CommonJS action entry point.

Follow the guide of the [tangro-actions-template](https://github.com/tangro/tangro-actions-template)

# Scripts

- `npm run update-readme` - Run this script to update the README with the latest versions.

  > You do not have to run this script, since it is run automatically by the release action

- `npm run update-dependencies` - Run this script to update all the dependencies
