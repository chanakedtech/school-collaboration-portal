# Ready-To-Create GitHub Issues

Create these issues once the repository exists on GitHub.

## 1. Set up local environment and confirm demo login

Labels: `setup`, `beginner`

Acceptance criteria:

- Backend runs locally.
- Frontend runs locally.
- Developer can log in with at least two demo roles.
- PR updates docs if any setup step is unclear.

## 2. Improve login and register UI

Labels: `frontend`, `beginner`

Acceptance criteria:

- Login and register forms are responsive.
- Form errors are clear.
- Existing auth flow still works.
- Screenshot is included in PR.

## 3. Add reusable loading and empty state components

Labels: `frontend`, `beginner`

Acceptance criteria:

- Loading and empty states are reusable components.
- Resource pages use the new components.
- UI remains consistent across desktop and mobile.

## 4. Build announcements list page

Labels: `frontend`, `beginner`

Acceptance criteria:

- Announcements are loaded from the API.
- Empty and error states are handled.
- Role-based navigation still works.

## 5. Add backend permission tests

Labels: `backend`, `advanced`

Acceptance criteria:

- Tests cover platform admin school access.
- Tests cover school admin user isolation.
- Tests cover teacher assignment access.
- Tests can run with one documented command.

## 6. Build assignment create form

Labels: `frontend`, `intermediate`

Acceptance criteria:

- Teachers can create assignments.
- Required fields are validated.
- Success and failure states are visible.
- Form redirects or refreshes data after success.

## 7. Implement student assignment submission

Labels: `full-stack`, `intermediate`

Acceptance criteria:

- Students can submit assignment responses.
- Students cannot submit for another student.
- Duplicate submission behavior is handled gracefully.
- API and UI testing notes are included.

## 8. Improve role-based sidebar navigation

Labels: `frontend`, `intermediate`

Acceptance criteria:

- Sidebar items match the logged-in role.
- Active state is clear.
- Mobile layout remains usable.
- No unauthorized links are visible.

## 9. Add parent child-view page

Labels: `full-stack`, `intermediate`

Acceptance criteria:

- Parents can view linked children.
- Parents can see child assignments and submissions.
- Parents cannot submit or grade work.

## 10. Add Docker setup

Labels: `devops`, `advanced`

Acceptance criteria:

- Backend and frontend can run with Docker Compose.
- Environment variables are documented.
- Existing local non-Docker setup still works.

