---
description: How to start ngrok HTTPS tunnel for testing WebXR AR features on Android phone
---

# Start ngrok for AR Testing

// turbo-all

1. Start the Next.js dev server (if not already running):
```powershell
cd c:\Users\yavni\OneDrive\Desktop\python\projects\naykasamaj
npm run dev
```

2. In a **separate terminal**, start ngrok to tunnel port 3000 over HTTPS:
```powershell
ngrok http 3000
```

3. Copy the `https://` URL from the ngrok output (e.g., `https://abc123.ngrok-free.app`)

4. Open that URL on your Android phone in Chrome to test AR features

5. To debug remotely, on your desktop Chrome go to: `chrome://inspect/#devices` (phone must be connected via USB with USB debugging enabled)

**Note:** The free ngrok plan gives you a random URL each time. The URL changes every time you restart ngrok.
