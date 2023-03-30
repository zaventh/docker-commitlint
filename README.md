# docker-commitlint

This is a preconfigured Docker image with [commitlint](https://commitlint.js.org).
This was forked from [Extenda Retail](https://github.com/extenda/docker-commitlint) and has the following settings:

* Extend `@commitlint/config-conventional`
* Custom `imperative-tense` rule to check subjects for imperative mood

It has been modernized and further customized with bias by @zaventh.

## :rocket: Usage

This image can be used in three ways.

1. As a standalone `commitlint` CLI
1. As a pre-commit hook
1. As a GitHub action

### CLI

```bash
docker pull zaventh/commitlint
echo "feat: add feature" | docker run --rm -i zaventh/commitlint
docker run --rm -v$(git rev-parse --show-toplevel)/.git:/app/.git -i zaventh/commitlint --from HEAD~1
```

### Pre-Commit Hook

The image can be used to build a [pre-commit](https://pre-commit.com) hook. Extenda provides
a [commitlint pre-commit hook](https://github.com/extenda/pre-commit-hooks) that can be configured like this:

```yaml
- repo: git@github.com:extenda/pre-commit-hooks.git
  rev: v0.4
  hooks:
    - id: commitlint
      stages: [ commit-msg ]
```

### GitHub Action

To support GitHub actions, the docker image offers an alternative entrypoint under `/app/bin/action`.

> Usage: action [-c <sha>] [-m <message>]

## :page_with_curl: License

This project is licensed under the [MIT license](./LICENSE).

## Attributions

This project contains a list imperative mood blacklist from the MIT
licensed [git-good-commit](https://github.com/tommarshall/git-good-commit) project.
