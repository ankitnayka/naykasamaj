# AR Admin Calibration Panel - User Guide

## Accessing the Panel
The AR calibration controls are hidden from normal users. To unlock the panel, you must append `?admin=true` to the URL.

**Example URL:**
`https://<your-ngrok-id>.ngrok-free.app/ar-building?admin=true`

Once accessed, the **"🔧 AR Calibration Settings"** panel will appear above the "Start AR Experience" button. **Important:** Set your configuration *before* clicking the Start AR button.

---

## Panel Settings Explained

### 1. Model Scale
- **Range:** `0.1x` to `150.0x`
- **Default:** `1.0x`
- **Description:** Adjusts the physical size of the building model in the AR space. If the model appears microscopic or covers the entire screen, use this slider to bring it to architectural scale.

### 2. Rotations (Pitch, Horizontal, Roll)
- **Range:** `-180°` to `180°`
- **Default:** `0°`
- **Description:** 
  - **Rotation Y (Horizontal):** Spins the building like a top on the ground. Use this to orient the entrance towards a specific real-world direction.
  - **Rotation X (Pitch):** Tilts the building forward or backward.
  - **Rotation Z (Roll):** Tilts the building left or right.

### 3. Lighting Adjustments
- **Brightness (Range: 0 to 3, Default: 1.0):** Mathematically multiplies the material colors of the 3D model. Lower values darken the building for cloudy days or indoors; higher values brighten it for direct sunlight.
- **Contrast (Range: 0 to 3, Default: 1.0):** Adjusts the difference between light and dark points on the 3D model. Values below 1.0 create a flatter appearance (useful on overcast days), while values above 1.0 create deeper shadows and blown-out highlights.
*(Note: These sliders only affect the 3D building, not your phone's camera feed.)*

### 4. Force Placement (Skip Surface Detection)
- **Default:** `Unchecked`
- **Description:** ARCore heavily relies on texture and lighting to detect a "floor". If you are on an empty site with flat dirt/concrete, surface detection may fail, leaving you stuck in "Searching for floor...". 
- Checking this box allows you to bypass surface scanning entirely. The building will instantly drop exactly **N meters** directly in front of your camera at your approximate foot level.

### 5. Forward Distance (Only visible if Force Placement is Checked)
- **Range:** `1m` to `50m`
- **Default:** `15m`
- **Description:** Dictates how far away from your physical body the building will spawn. 15m is generally enough to fit a large structure in your phone's field of view without needing to walk backwards immediately.

---

## Reset All Settings
At the bottom of the panel is a **Reset All Settings** button. Clicking this instantly reverts all sliders, sizes, and bypass controls back to their default state. Use this if you get the building's rotation completely twisted or the brightness completely washed out.

---

## Best Practices on Site
1. **Calibrate First:** Set your expected scale and rotation *before* tapping Start AR.
2. **If Stuck:** If the "Searching for floor" message doesn't disappear after moving your phone sideways a few times, hit **Exit AR**, enable **Force Placement** in the admin panel, and try again.
3. **Lighting matching:** While looking at the building through the camera, if the building looks unnaturally bright, hit Exit AR, drop the brightness slider slightly, and re-enter.
