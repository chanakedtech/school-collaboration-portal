# Developer Onboarding

Use this document when onboarding Sabira, Habibu, or any new trainee.

## First Day Checklist

- Accept the GitHub repository invitation.
- Clone the repository.
- Create a branch from `develop`.
- Run the backend locally.
- Run the frontend locally.
- Log in with demo accounts.
- Pick one beginner issue.
- Open a pull request into `develop`.

## Local Verification

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Review Rubric

Evaluate each developer on:

- Git basics: branch naming, commits, pull request target, conflict handling.
- Code reading: follows existing patterns before adding new ones.
- Frontend skills: routes, state, API calls, forms, loading and error states.
- Backend skills: models, serializers, viewsets, permissions, data isolation.
- Communication: clear PR description, review responses, testing notes.
- Ownership: finishes the task without hiding uncertainty.

## Recommended First Assignments

Sabira:

- Polish login and register pages.
- Build a reusable empty state component.
- Improve the announcements list.

Habibu:

- Add backend permission tests for school admin and teacher access.
- Build assignment create/edit forms.
- Improve student submission flow.

Rotate tasks after the first PR so each developer touches both frontend and backend.

