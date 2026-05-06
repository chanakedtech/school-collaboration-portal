# School Collaboration Portal

A training monorepo for evaluating new developers on React, Django REST Framework, Git, GitHub issues, feature branches, pull requests, code review, and role-based application design.

The app simulates a school collaboration platform with six roles:

- Student
- Teacher
- Class Teacher
- Parent
- School Admin
- Platform Admin

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Django, Django REST Framework, SimpleJWT
- Database: SQLite for local development, PostgreSQL-ready through `DATABASE_URL`
- Auth: JWT access and refresh tokens

## Repository Structure

```txt
backend/
  apps/
    accounts/
    core/
  config/
frontend/
  src/
    api/
    auth/
    components/
    layouts/
    pages/
    routes/
    utils/
.github/
  ISSUE_TEMPLATE/
  workflows/
```

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Backend API runs at `http://127.0.0.1:8000/api/`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173/`.

## Demo Accounts

After running `python manage.py seed_demo`, use these accounts:

```txt
platform.admin@demo.school / Password123!
school.admin@demo.school / Password123!
teacher.one@demo.school / Password123!
class.teacher@demo.school / Password123!
student.one@demo.school / Password123!
parent.one@demo.school / Password123!
```

## API Overview

```txt
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/token/refresh/
GET  /api/auth/me/

GET|POST       /api/schools/
GET|PATCH|DELETE /api/schools/:id/

GET|POST       /api/users/
GET|PATCH|DELETE /api/users/:id/

GET|POST       /api/classes/
GET|PATCH|DELETE /api/classes/:id/

GET|POST       /api/subjects/
GET|PATCH|DELETE /api/subjects/:id/

GET|POST       /api/assignments/
GET|PATCH|DELETE /api/assignments/:id/

GET|POST       /api/submissions/
PATCH          /api/submissions/:id/grade/

GET|POST       /api/announcements/
GET|PATCH|DELETE /api/announcements/:id/
```

## Collaboration Workflow

1. Pick a GitHub issue.
2. Create a feature branch from `develop`.
3. Commit small, meaningful changes.
4. Push your branch.
5. Open a pull request into `develop`.
6. Request review.
7. Respond to review comments.
8. Merge only after approval and passing checks.

Branch examples:

```txt
feature/login-page
feature/student-dashboard
bugfix/assignment-submission-error
hotfix/login-token-refresh
```

## Training Evaluation Areas

- Can the developer create focused branches and pull requests?
- Do they write clear commits?
- Can they read existing code before editing?
- Do they keep frontend and backend contracts consistent?
- Do they understand role-based permissions?
- Do they test or at least manually verify their work?
- Do they respond well to code review?

