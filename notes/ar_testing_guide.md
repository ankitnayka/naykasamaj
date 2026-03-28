# Testing AR Building Viewer

This guide explains how to test the WebXR Augmented Reality feature for the Nayaka Samaj Bhavan on your Android device during development.

##  Prerequisites

1.  **Android Phone:** The device must support ARCore.
2.  **Google Chrome:** Must be installed on the Android device (Safari/iOS does not support WebXR AR).
3.  **Local Dev Server:** The Next.js development server must be running (`npm run dev`).

## Step-by-Step Testing Guide

### Step 1: Start the HTTPS Tunnel (ngrok)

WebXR **requires** an HTTPS connection. Since your local server runs on HTTP, we use `ngrok` to create a secure tunnel.

1.  Open a **new** PowerShell terminal (keep the Next.js `npm run dev` terminal running).
2.  Run the following command:
    ```powershell
    ngrok http 3000
    ```
3.  Look for the line that says `Forwarding` in the output. It will look something like this:
    `Forwarding                    https://1234-abcd-efgh.ngrok-free.app -> http://localhost:3000`
4.  Copy that HTTPS URL (`https://...ngrok-free.app`).

### Step 2: Open on Android

1.  Send that copied URL to your Android phone (via WhatsApp, email, or Keep).
2.  Open the link using **Google Chrome** on your phone.
3.  Navigate to the AR page using the site menu ("Nayaka Samaj Bhavan" or `/ar-building`).

### Step 3: Test the Experience

1.  You should see the "Start AR Experience" button (if you see the "Not Supported" message, ensure you are using Android Chrome).
2.  Tap **Start AR Experience**.
3.  The browser will ask for **Camera Permissions**. Grant them.
4.  Your camera view will open. **Slowly move your phone around** while pointing it at the floor or a flat table so ARCore can detect the surface.
5.  A **gold ring (reticle)** will appear when a surface is found.
6.  **Tap the screen** anywhere.
7.  The 3D building should appear at that spot and remain anchored as you walk around it.
8.  Tap **Exit AR** to return to the website.

---

## Troubleshooting & Debugging

If things aren't working, you can connect your phone to your PC to read the console logs.

1.  Enable **Developer Options** and **USB Debugging** on your Android phone.
2.  Connect your phone to your PC via USB.
3.  Open Chrome on your PC and navigate to: `chrome://inspect/#devices`
4.  Wait a moment, and your phone's open tabs should appear in the list.
5.  Click **inspect** under the ngrok tab.
6.  This opens a DevTools window mirroring your phone, where you can read the `Console` tab for any errors.
