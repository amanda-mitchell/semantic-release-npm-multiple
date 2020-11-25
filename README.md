# @amanda-mitchell/semantic-release-npm-multiple

This is a thin wrapper around the [@semantic-release/npm](https://github.com/semantic-release/npm) plugin for [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) that allows it to be called multiple times, which can be useful if you need to publish to multiple NPM registries simultaneously.

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
      "@amanda-mitchell/semantic-release-npm-multiple",
      {
        "registries": {
          "registryName1": {
            "npmPublish": true
          },
          "registryName2": {
            "npmPublish": true
          }
        }
      }
    ]
  ]
}
```

## Configuration

Each of the keys in `registries` refers to a specific registry that should be used and may be any value that is meaningful to you.
The object associated with that key is a set of options that should be passed to the `@semantic-release/npm` plugin when calling it.

`@amanda-mitchell/semantic-release-npm-multiple` also looks at a number of environment variables for its configuration:

- `NPM_TOKEN`
- `NPM_USERNAME`
- `NPM_PASSWORD`
- `NPM_EMAIL`
- `NPM_CONFIG_REGISTRY`

For any of these variables, if you define a `{UPPER_CASE_REGISTRY_NAME}_{VARIABLE}` environment variable, it will be used instead.

For example, if you wanted to publish a package to both a GitHub private registry and the public NPM registry, you would first create a configuration file like this:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@amanda-mitchell/semantic-release-npm-multiple",
      {
        "registries": {
          "github": {},
          "public": {}
        }
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
