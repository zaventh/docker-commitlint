# docker-commitlint

> A preconfigured [Docker](https://www.docker.com/) image that lints Git commit messages against the [Conventional Commits](https://www.conventionalcommits.org/) specification — usable as a **standalone CLI**, a **pre-commit hook**, or a **GitHub Action**.

[![Docker Image](https://img.shields.io/badge/docker-zaventh%2Fcommitlint-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/r/zaventh/commitlint)
[![commitlint](https://img.shields.io/badge/commitlint-v21-000000?logo=commitlint&logoColor=white)](https://commitlint.js.org)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

`docker-commitlint` bundles [commitlint](https://commitlint.js.org) with an opinionated configuration into a small, ready-to-run container. There is **nothing to install** beyond Docker — no Node.js, no npm, no local commitlint setup. Pull the image and pipe a commit message to it.

---

## Table of contents

- [What it checks](#what-it-checks)
- [Quick start](#quick-start)
- [Usage](#usage)
  - [As a standalone CLI](#1-as-a-standalone-cli)
  - [As a pre-commit hook](#2-as-a-pre-commit-hook)
  - [As a GitHub Action](#3-as-a-github-action)
- [Configuration](#configuration)
- [FAQ](#faq)
- [License](#license)
- [Attributions](#attributions)

---

## What it checks

The image ships with a [`commitlint.config.js`](./commitlint.config.js) that applies two rule sets:

| Rule set | Source | Level | Effect |
| --- | --- | --- | --- |
| Conventional Commits structure | [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) | **error** | A malformed or unknown commit type **fails** the check (exit code `1`). |
| Imperative-mood subject | [`commitlint-plugin-tense`](https://github.com/actuallydamo/commitlint-plugin-tense) (`tense/subject-tense`) | **warning** | A non-imperative subject (e.g. `added` instead of `add`) prints a **warning** but does **not** fail the check. |

**Valid** — passes:

```
feat: add support for relaxed linting
fix(parser): handle empty commit body
docs: update usage examples
```

**Blocked** — unknown type fails with exit code `1`:

```
wibble: this is not a conventional type
```

**Warned** — wrong tense is flagged but still allowed through:

```
feat: added a new feature
⚠  tense of subject must be present-imperative. Words in other tenses: added - past-tense [tense/subject-tense]
```

---

## Quick start

```bash
docker pull zaventh/commitlint
echo "feat: add a new feature" | docker run --rm -i zaventh/commitlint
```

An empty (exit code `0`) result means the message is valid.

---

## Usage

The image can be used in three ways.

### 1. As a standalone CLI

Lint a single message by piping it to the container over `stdin`:

```bash
echo "feat: add a new feature" | docker run --rm -i zaventh/commitlint
```

Lint a **range of existing commits** by mounting your repository's `.git` directory into the container:

```bash
docker run --rm \
  -v "$(git rev-parse --show-toplevel)/.git:/app/.git" \
  -i zaventh/commitlint --from HEAD~1
```

Any arguments after the image name are passed straight through to [`commitlint`](https://commitlint.js.org/reference/cli.html) (e.g. `--from`, `--to`, `--edit`).

### 2. As a pre-commit hook

The image can back a [pre-commit](https://pre-commit.com) hook. A ready-made
[commitlint pre-commit hook](https://github.com/extenda/pre-commit-hooks) can be wired into your `.pre-commit-config.yaml`:

```yaml
- repo: https://github.com/extenda/pre-commit-hooks
  rev: v0.4
  hooks:
    - id: commitlint
      stages: [commit-msg]
```

### 3. As a GitHub Action

For GitHub Actions, the image exposes an alternative entrypoint at `/app/bin/action.sh`:

```
Usage: action.sh [-c <sha>] [-x <bool>] [-m <string>]
```

| Flag | Meaning |
| --- | --- |
| `-m <string>` | Lint a single commit-message string. |
| `-c <sha>` | Lint every commit in the range `<sha>..HEAD`. |
| `-x <bool>` | Relaxed mode. When `true`, the range is linted **only** if `<sha>` equals `HEAD` (i.e. a single new commit); otherwise linting is skipped. Useful for tolerating existing history on feature branches. |

Example step:

```yaml
- name: Lint commit messages
  run: |
    docker run --rm \
      -v "${{ github.workspace }}/.git:/app/.git" \
      --entrypoint /app/bin/action.sh \
      zaventh/commitlint -c "${{ github.event.pull_request.base.sha }}" -x true
```

---

## Configuration

The full configuration lives in [`commitlint.config.js`](./commitlint.config.js):

```js
module.exports = {
  extends: [
    '@commitlint/config-conventional',
  ],
  plugins: [
    'commitlint-plugin-tense',
  ],
  rules: {
    'tense/subject-tense': [1, 'always'],
  }
};
```

To change the rules, fork this repository, edit `commitlint.config.js`, and rebuild the image:

```bash
docker build -t my-commitlint .
```

---

## FAQ

**What is this?**
A Docker image that validates Git commit messages against the Conventional Commits spec, with an added imperative-mood check on the subject line.

**Do I need Node.js or npm installed?**
No. Everything runs inside the container. You only need Docker.

**Does a wrong verb tense fail my commit?**
No. The imperative-mood rule (`tense/subject-tense`) is configured as a **warning**, so it is advisory. Only violations of the Conventional Commits structure cause a non-zero exit code.

**How do I lint a range of commits instead of a single message?**
Mount your repo's `.git` directory into the container and pass `--from`/`--to`, e.g. `--from HEAD~1`. See [As a standalone CLI](#1-as-a-standalone-cli).

**What base image and versions does it use?**
`node:24-alpine` with `@commitlint/cli` and `@commitlint/config-conventional` at v21, plus `commitlint-plugin-tense`.

**Where is the Docker image published?**
On Docker Hub as [`zaventh/commitlint`](https://hub.docker.com/r/zaventh/commitlint).

---

## License

This project is licensed under the [MIT license](./LICENSE).

## Attributions

- Forked from [Extenda Retail's `docker-commitlint`](https://github.com/extenda/docker-commitlint), then modernized and customized.
- The imperative-mood word list is derived from the MIT-licensed [git-good-commit](https://github.com/tommarshall/git-good-commit) project.
