# Electrical Drawing Explainer

একটি full-stack MVP যেখানে ব্যবহারকারী electrical drawing, SLD, wiring diagram, বা schematic upload করে AI দিয়ে বাংলায় explanation পেতে পারে।

This implementation uses **Gemini Vision** because the available API key is for Gemini. The API key stays only on the Express server and is never exposed to the React frontend.

## Features

- JPG, PNG, and PDF upload up to 10MB
- PDF upload support through Gemini document understanding
- Bengali AI explanation with markdown rendering
- Chat history with follow-up questions
- Quick question buttons
- Dark mode
- Mobile responsive UI
- Copy response and clear chat controls

## Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Create an API key.
4. Put it in `server/.env` as `GEMINI_API_KEY`.

If you pasted a real API key into chat or a public place, rotate it in Google AI Studio and use the new one locally.

## Install

```bash
cd electrical-explainer/server
npm install

cd ../client
npm install
```

Create the server env file:

```bash
cd ../server
copy ..\.env.example .env
```

Then edit `server/.env`:

```env
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=3001
```

## PDF Support

PDF files are sent directly to Gemini with `application/pdf`. This avoids OS-specific PDF conversion tools and works better on cloud hosts like Railway.

## Run Locally

Start backend:

```bash
cd electrical-explainer/server
npm run dev
```

Start frontend:

```bash
cd electrical-explainer/client
npm run dev
```

Open the Vite URL shown in terminal, usually:

```text
http://localhost:5173
```

## API

### `POST /api/analyze`

Body: `multipart/form-data`

- `image`: JPG, PNG, or PDF file
- `question`: user question
- `history`: JSON string of previous messages

Response:

```json
{
  "reply": "markdown string",
  "success": true
}
```

## Deploy

### One-Service Deploy on Railway

This repo can run frontend and backend from one Railway service.

1. Push or upload the `electrical-explainer` folder to GitHub.
2. Create a Railway project from that GitHub repo.
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL=gemini-1.5-flash`
   - `NODE_ENV=production`
4. Set build command:

```bash
npm run build
```

5. Set start command:

```bash
npm start
```

Railway will give you one public URL for the app.

### Frontend on Vercel

1. Deploy `client/` as a Vite project.
2. Set `VITE_API_URL` to your backend URL, for example `https://your-api.railway.app`.
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend on Railway

1. Deploy `server/`.
2. Add environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
   - `PORT`
3. Ensure uploads are acceptable for your plan. For production, use S3 or another object store instead of local storage.

## Notes

- AI explanations can be wrong or incomplete, especially with unclear scans.
- Always verify electrical work with a licensed electrician or engineer.
