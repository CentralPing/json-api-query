# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - Unreleased

### Added

- Re-export `JSON_API_PAGE_STRATEGY_GROUPS` from `@centralping/ergo-wire` for shared
  JSON:API pagination strategy constants (aligned with `schema.json` page keys).
- `@centralping/ergo-wire` (`^0.1.0-beta.2`) as a runtime dependency.
- Alignment unit tests that assert set equality between wire strategy keys and
  `schema.json` page property keys.

---

## [1.0.1] - 2026-05-27

### Fixed

- Updated fast-uri to 3.1.2 (CVE remediation).

### Changed

- Bumped ajv production dependency.

---

## [1.0.0] - 2026-03-20

### Changed

- **BREAKING:** Pure ESM (`"type": "module"`) -- CJS `require()` is no longer supported.
- **BREAKING:** Minimum Node.js version is now 22.
- **BREAKING:** Upgraded AJV from v6 to v8 with JSON Schema 2020-12 (error shapes differ from v6).
- **BREAKING:** Removed `parse` module -- use `new URL()` / `URLSearchParams` for query parsing.
- Schema uses `dependentRequired` (2020-12) instead of `dependencies` (draft-07).

### Added

- ESLint flat config with Prettier integration.
- `node:test` runner with `c8` coverage thresholds.
- GitHub Actions CI (Node 22 + 24), release with npm provenance, CodeQL, OpenSSF Scorecard.
- Dependabot for npm and GitHub Actions dependencies.
- `simple-git-hooks` + `lint-staged` for pre-commit quality checks.

### Removed

- Travis CI configuration.
- Jest test framework.
- Coveralls integration (replaced by Codecov).
- `esm` runtime dependency.
- `parse` module and associated tests.
- Legacy ESLint config (`.eslintrc`, `eslint-config-google`, `eslint-plugin-jest`, `eslint-plugin-import`, `eslint-plugin-node`).
- `jsdoc-to-markdown` and `generate-changelog` dev dependencies.

---

## Previous Releases

For changes prior to 1.0.0, see the [legacy changelog](https://github.com/CentralPing/json-api-query/blob/5be88b64174c714b949cf13b911228653256e627/CHANGELOG.md).
