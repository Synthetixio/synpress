# Deployment Guide

## Materials worth reading

- https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md
- https://github.com/changesets/changesets/blob/main/docs/prereleases.md

## How to deploy

⚠️ Remember to run all the commands from the root directory of the repository!

1. Run the following command to select the package to be released:

```bash
pnpm changeset
```

2. Consume the changeset by running:

```bash
pnpm changeset version
```

3. Verify all the `package.json` and `CHANGELOG.md` files that were changed by the previous command.

4. Run `pnpm build` in root

5. Run `pnpm build` in `./release/`

6. Commit changes

7. Publish the packages by running:

```bash
# You might have to run this command twice if it fails to publish the `@synthetixio/synpress` package on the first run.
pnpm changeset publish
```

## Tags

If you're running in prerelease mode, make sure you're also pushing the release tags to GitHub with:

```bash
git push --follow-tags
```
