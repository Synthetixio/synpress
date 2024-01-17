# CI

Running Synpress on CI is very similar to running Playwright on CI. The only difference is that you need an extra step to build the cache before running the tests, like so:

```yaml
- name: Build cache
  run: xvfb-run npx synpress

- name: Run E2E tests (headful)
  run: xvfb-run npx playwright test
```

::: warning
The `xvfb-run` is required here in both steps because Synpress and Playwright must run in the headful mode on CI. See the [Known Issues](/docs/known-issues) section for an explanation of why this is the case.
:::

For a complete example of a CI configuration, see [this file](https://github.com/Synthetixio/synpress/blob/new-dawn/.github/workflows/test.yml#L30), which we use internally to run Synpress tests on GitHub Actions.
