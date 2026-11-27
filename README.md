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

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Layout and styles |
| `script.js` | Add, edit, remove, filter, and save |
