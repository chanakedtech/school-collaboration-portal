# Contributing Guide

This repository is for collaboration training. The goal is not only to build features, but to practice the workflow expected on production projects.

## Branching

Base all work on `develop`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/short-feature-name
```

Allowed branch prefixes:

- `feature/`
- `bugfix/`
- `hotfix/`
- `chore/`
- `docs/`

## Commit Style

Use small commits with clear messages.

Good examples:

```txt
Add protected route component
Connect login form to JWT endpoint
Fix school admin user filter
```

Avoid vague messages like:

```txt
changes
fix
update stuff
```

## Pull Requests

Every PR should include:

- What changed
- How it was tested
- Screenshots for UI changes
- Any follow-up work needed

PRs should target `develop`, not `main`.

## Review Expectations

Reviewers should check:

- Does the feature match the issue?
- Is the code readable for beginner and intermediate developers?
- Are permissions handled correctly?
- Are errors and loading states handled?
- Is the change focused?

Authors should respond respectfully, push fixes, and resolve conversations only after the concern is handled.

## Definition of Done

A task is done when:

- The feature works locally
- The code is committed to a feature branch
- A PR is opened into `develop`
- Review feedback has been handled
- CI checks pass

