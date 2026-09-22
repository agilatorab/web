# Security policy for agilator.se

## Supported versions

The site is deployed from the latest `v*` tag; only that release receives
fixes. There is nothing to install, so there are no older lines to support.

## Reporting a vulnerability

**Do not open public GitHub issues for security problems.**

Report privately via
[GitHub Security Advisories](https://github.com/agilatorab/web/security/advisories/new),
or by email to `support@agilator.se` with "security" in the subject line.

## Response

We aim to acknowledge reports within 72 hours and to give a triage update
within 7 days.

## Disclosure

We follow coordinated disclosure: we agree a release window with the reporter
and credit them in the release notes unless they prefer otherwise.

## Scope

In scope: the published site at <https://agilator.se/> and its deploy slots,
the build pipeline in this repository (anything that could make the workflows
publish something other than this source), and the repository's own
configuration.

Out of scope: the apps and games themselves — each has its own support page on
<https://apps.agilator.se/> — and vulnerabilities in third-party dependencies
(please report those upstream).
