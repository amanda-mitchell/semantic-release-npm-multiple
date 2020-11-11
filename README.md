# @amanda-mitchell/semantic-release-npm-multiple

This library is a [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) plugin that supports publishing an NPM package to multiple registries.
It supports all of the same configuration options as `@semantic-release/npm`, which it uses under the hood.

## Installation

```
yarn add --dev @amanda-mitchell/semantic-release-npm-multiple
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        "first": {
          "npmPublish": true
        },
        "second": {
          "npmPublish": true
        }
      }
    ]
  ]
}
```

## Configuration

Each of the top-level keys refers to a specific registry that should be used and may be any value that is meaningful to you.
The object associated with that key is a set of options that should be passed to the `@semantic-release/npm` plugin when calling it.

`@semantic-release/npm` also looks at a number of environment variables for its configuration:

- `NPM_TOKEN`
- `NPM_USERNAME`
- `NPM_PASSWORD`
- `NPM_EMAIL`
- `NPM_CONFIG_REGISTRY`

For any of these variables, if you define a `{TOP_LEVEL_KEY}_{VARIABLE}` environment variable, it will be used instead.

For example, if you wanted to publish a package to both a GitHub private registry and the public NPM registry, you would first create a configuration file like this:

```
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        "github": {},
        "public": {}
      }
    ]
  ]
}
```

And then, when running `semantic-release`, set these environment variables:

- `GITHUB_NPM_CONFIG_REGISTRY=https://npm.pkg.github.com/`
- `GITHUB_NPM_TOKEN=XXXXX`
- `PUBLIC_NPM_CONFIG_REGISTRY=https://registry.npmjs.org`
- `PUBLIC_NPM_TOKEN=XXXXX`