# Deployment and releases

The site deploys to GitHub Pages on the custom domain `agilator.se`
(`public/CNAME`). One Pages deploy carries up to three builds of the site,
each at its own path, so a released version, the current `main` and a branch
under review can all be looked at on the same domain without colliding.

## The slots

| Slot       | Path        | Built from                                  | Indexed                     |
| ---------- | ----------- | ------------------------------------------- | --------------------------- |
| Production | `/`         | the highest `v*` tag (not the nearest one)  | yes — the only indexed slot |
| Preview    | `/preview/` | `main` HEAD, on every push                  | no (`noindex,nofollow`)     |
| Branch     | `/branch/`  | the branch last parked by a manual dispatch | no (`noindex,nofollow`)     |

Until the first release tag exists, `main` is served at `/` and there is no
`/preview/`. Each build is the same source built with a different `VITE_BASE`;
`seo-plugin.ts` reads that to decide whether the build is indexable, and every
slot's canonical URL points at production.

The footer's build label says which slot and commit you are looking at:
`0.3.0.57-pre+4f23a97` is version 0.3.0, CI run 57, the preview slot, commit
`4f23a97`.

## `pages.yml`

Runs on every push to `main`, on `workflow_call` from the release workflow, and
on manual dispatch. One run builds every slot it needs, merges them into one
tree and deploys once (`concurrency: pages`, never cancelled mid-run):

1. Resolve the production ref: the `release_ref` input if the release workflow
   passed one, else the highest `v*` tag.
2. If there is one, check it out and build it with `VITE_BASE=/`.
3. Build the triggering commit with `VITE_BASE=/preview/` (or `/` when no
   release exists yet).
4. If the run was dispatched with a `branch_ref`, build that ref with
   `VITE_BASE=/branch/` and force-push the output to the orphan branch
   `branch-deploy`.
5. Rehydrate `/branch/` from `branch-deploy` if it exists — so a parked branch
   survives every later deploy until the next dispatch replaces it.
6. Merge (`/`, `/preview/`, `/branch/`; only the root keeps `CNAME`), upload,
   deploy. A rejected deploy is retried once after 45 seconds, because Pages
   occasionally refuses a fresh deployment while settling the previous one.

### Parking a branch

Actions → **pages** → _Run workflow_ → set `branch_ref` to the branch name.
`/branch/` then serves that branch, and keeps serving it across pushes to
`main` and across releases, until the next dispatch with a `branch_ref`.

## Cutting a release

Actions → **Release** → _Run workflow_ on `main`. With `bump: auto` (the
default) it:

1. Derives the bump from the fragments in `.changes/unreleased/` — breaking →
   major, Added/Changed/Removed/Deprecated → minor, Fixed/Security → patch.
2. Collates the fragments into a dated section of `CHANGELOG.md` and deletes
   them.
3. Bumps `package.json`, commits `chore(release): vX.Y.Z`, tags, pushes both.
4. Creates a GitHub Release with that changelog section as its notes.
5. Chains into `pages.yml` with the new tag so `/` updates immediately.

Pick `patch` / `minor` / `major` to override the derived bump. Set `commit` to
release from an earlier commit than `main` HEAD; then only the tag is pushed
and reconciling `main` is a manual follow-up.

**Version bump** (`version-bump.yml`) is the dry run: dispatch it to see the
bump and version a release would produce, written to the job summary, with
nothing pushed. `make bump` does the same locally.

## Mirror

`mirror.yml` pushes `main` to an external git mirror on every commit, so
sibling repositories can clone this one from sandboxes where github.com is
blocked. It is inert until the repository variables `MIRROR_URL` (and
optionally `MIRROR_USER`) and the secret `MIRROR_TOKEN` are set.
