# To-do

A small to-do site built with HTML, CSS, and JavaScript. Add a task, edit it, mark it done, or remove it. New tasks are saved in Firebase Realtime Database.

## Open it

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8765
```

Then visit http://127.0.0.1:8765.

## Use it

- Type a task and press **Add**.
- Press **Edit**, change the text, then press Enter to save or Escape to cancel.
- Check a task to mark it done.
- Press **Remove** to delete a task.
- Use **All**, **Active**, and **Done** to filter the list.

Adding a task writes it under `todos` in Realtime Database. The list loads from that path, including after a refresh.

## Deploy on Vercel

`firebase-config.js` stays off GitHub. Vercel creates it during the build from these environment variables:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_DATABASE_URL`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

Use the values in your local `firebase-config.js`. Add them in the Vercel project settings, then redeploy.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Layout and styles |
| `script.js` | Add, edit, remove, filter, and save |
