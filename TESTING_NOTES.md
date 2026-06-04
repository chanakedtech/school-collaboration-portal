# Testing Notes — Student Assignment Submission

## API Testing

### Submit an assignment (student only)
```bash
# 1. Login as student and get token
curl -s -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"student.one@demo.school","password":"Password123!"}' \
  | python -m json.tool

# 2. Submit (replace <token> and <assignment_id>)
curl -X POST http://127.0.0.1:8000/api/submissions/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"assignment": <assignment_id>, "answer_text": "My answer here."}'
# Expected: 201 Created with submission object
```

### Duplicate submission is rejected
```bash
# Run the same request again
# Expected: 400 Bad Request
# {"assignment": ["You have already submitted this assignment."]}
```

### Student cannot submit for another student
```bash
# The backend ignores any `student` field in the request body.
# perform_create() always sets student=request.user.
# Sending {"assignment": 1, "student": 99, "answer_text": "..."} still
# creates the submission under the authenticated user, not user 99.
```

### Non-student cannot create a submission
```bash
# Login as teacher.one@demo.school and attempt POST /api/submissions/
# Expected: 403 Forbidden
```

## UI Testing (manual)

| Step | Expected |
|------|----------|
| Log in as `student.one@demo.school` | Redirected to student dashboard |
| Go to Assignments | List of assignments for the student's class |
| Click "Submit Answer" on any assignment | Inline textarea and Submit button appear |
| Submit an empty textarea | Browser validation blocks submission |
| Type an answer and click Submit | Button shows "Submitting…", then badge "Submitted — awaiting grade" appears |
| Click "Submit Answer" again on the same assignment | Button is gone; only the badge is shown (no re-submission possible) |
| Log in as a teacher and go to Submissions | The student's submission appears with a grade input |
| Log in as `parent.one@demo.school` → Children | Submission status visible under child's assignments, no submit button |
