---
title: aUToronto
blurb: A human machine interface for real-time autonomous vehicle telemetry and mission control.
# image: ../../asset/gui.png
tech:
  - React
  - C++
  - Three.js
  - TypeScript
  - Node.js
---

<video width=100% autoplay loop muted playsinline controls>
  <source src="../../asset/GUI_gif.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>
<!-- ![The user interface running on the car, artemis]() -->

## Graphical User Interface Team at aUToronto

The University of Toronto's Self-Driving Car Team, [aUToronto](https://www.autodrive.utoronto.ca/), is a student-led design team competing annually in the [GM/SAE AutoDrive Challenge Series](https://www.autodrivechallenge.com/). Our goal is to build a level 4 autonomous vehicle capable of navigating urban driving scenarios at the MCity test facility in Michigan.

While named the Graphical User Interface (GUI) team, we develop all Human-Machine Interfaces (HMI) for the vehicle—ranging from a passenger web app on an in-cabin tablet to a physical Streamdeck interface for controlling ROS nodes.

<div align="center">
  <img src="../../asset/artemis.jpg" width="70%" alt="artemis">
  <p>Artemis: our self-driving car. Source: aUToronto</p>
</div>

### What is Level 4 Autonomy?

Level 4 autonomy refers to a vehicle's ability to drive itself without human intervention under defined operational domains, while still allowing optional manual override.

At aUToronto, our vehicle addresses key autonomy challenges:

1. **Autonomous Navigation**: Vehicles must navigate a complex urban environment autonomously, including handling intersections, traffic signals, and roundabouts.
2. **Object Detection and Avoidance**: Cars must detect and avoid pedestrians, deers, other vehicles, and obstacles in real-time.
3. **Autonomous Parking**: Teams must develop systems for autonomous perpendicular parking.
4. **Path Planning**: Vehicles must create and follow an optimal path, considering dynamic and static objects.
5. **Safety and Reliability**: Ensuring the vehicle operates safely and reliably under various conditions, including inclement weather and different road types.

### My Role & Timeline

1. **August 2024 - August 2025: GUI Team Member**
   - Built a 2D web interface allowing operators to select waypoints and inspect map and trajectory overlays.
   - Assisted with software integration for the Streamdeck controller.

2. **September 2025 - June 2026: GUI Team Lead**
   - Led a sub-team of 4 engineers.
   - Built the 3D perception visualization pipeline using Three.js and customized Foxglove, an open-source data visualization and debugging platform designed for robotics developers.
   - Collaborated with the System Safety team to build the real-time vehicle health monitor.

---

## Why We Needed a Custom HMI

We needed an intuitive interface that serves two purposes:

1. **Passengers & Evaluators:** Clearly show what the car sees (detected objects, planned trajectories) and allow manual intervention if necessary.
2. **Autonomy Engineers:** Monitor stack health, sensor status, and mission progress during track testing without digging through raw logs.

Prior to our sub-team's work, engineers relied on RViz and command-line tools, requiring laptops inside the car during dynamic runs. Additionally, competition rules required us to move away from non-registered developer tools toward an intuitive interface usable by everyone.

---

## Key Implementations

<div align="center">
  <img src="../../asset/Block Diagram.png" width=full alt="GUI System Architecture">
  <p>GUI System Architecture Diagram. Source: aUToronto</p>
</div>

### 1. Dual-Panel 2D/3D Web Application on Android Tablet

We built a dual-panel web application running on an in-cabin tablet to monitor vehicle state, select destinations, and engage autonomous mode.

<style>
  .hmi-radio { display: none; }
  .ipad-viewer { margin: 8px 0 24px; }

  /* ── Two-column grid: iPad left, content right ── */
  .ipad-layout {
    display: grid;
    grid-template-columns: 1fr 0fr;
    align-items: start;
    gap: 28px;
    transition: grid-template-columns 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  }
  #itab-3d:checked ~ .ipad-layout,
  #itab-2d:checked ~ .ipad-layout,
  #itab-health:checked ~ .ipad-layout {
    grid-template-columns: 1fr 1fr;
  }

  /* ── iPad frame (less rounded) ── */
  .ipad-frame {
    background: linear-gradient(160deg, #2c2c2e 0%, #1c1c1e 100%);
    border-radius: 16px;
    padding: 11px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.07),
      inset 0 0 0 1px rgba(255,255,255,0.04),
      0 20px 60px rgba(0,0,0,0.5);
    position: relative;
  }
  .ipad-frame::before {
    content: '';
    position: absolute;
    top: 5px; left: 50%;
    transform: translateX(-50%);
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #3a3a3c;
  }
  .ipad-frame::after {
    content: '';
    position: absolute;
    right: -3px; top: 30%;
    width: 3px; height: 34px;
    background: #2c2c2e;
    border-radius: 0 2px 2px 0;
  }

  /* ── Screen (1190×744 ratio) ── */
  .ipad-screen {
    background: #000;
    border-radius: 7px;
    overflow: hidden;
    aspect-ratio: 1190 / 744;
    position: relative;
  }
  .ipad-screen-imgs {
    position: absolute;
    inset: 0;
  }
  /* Absolute cells — guaranteed top-to-bottom fill, widths match overlays exactly */
  .itab-cell-3d {
    position: absolute;
    left: 0; top: 0;
    width: 26%; height: 100%;
    overflow: hidden;
  }
  .itab-cell-2d {
    position: absolute;
    left: 26%; top: 0;
    width: 74%; height: 100%;
    overflow: hidden;
  }
  .itab-img-3d,
  .itab-img-2d {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.35s ease, filter 0.35s ease;
  }
  /* Health monitor overlay */
  .ipad-overlay-health {
    left: 59.3%;
    top: 38.2%;
    width: 16.47%;
    height: 7.8%;
    z-index: 2;
    border-radius: 3px;
  }

  /* ── Overlay labels (clickable regions) ── */
  .ipad-overlay {
    position: absolute;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .ipad-overlay:hover { background: rgba(80,80,80,0.22); }
  .ipad-overlay-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.92);
    text-shadow: 0 1px 6px rgba(0,0,0,0.95);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    text-align: center;
  }
  .ipad-overlay:hover .ipad-overlay-text { opacity: 1; }

  /* ── Dimming (inactive image when a tab is selected) ── */
  #itab-3d:checked ~ .ipad-layout .itab-img-2d { opacity: 0.38; filter: brightness(0.55) saturate(0.6); }
  #itab-2d:checked ~ .ipad-layout .itab-img-3d { opacity: 0.38; filter: brightness(0.55) saturate(0.6); }
  #itab-health:checked ~ .ipad-layout .itab-img-3d { opacity: 0.38; filter: brightness(0.55) saturate(0.6); }

  /* ── Content column ── */
  .ipad-content-col {
    overflow: hidden;
    opacity: 0;
    min-width: 0;
    transition: opacity 0.45s ease 0.18s;
  }
  #itab-3d:checked ~ .ipad-layout .ipad-content-col,
  #itab-2d:checked ~ .ipad-layout .ipad-content-col,
  #itab-health:checked ~ .ipad-layout .ipad-content-col {
    opacity: 1;
  }

  /* ── Panels ── */
  .ipad-panel {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  #itab-3d:checked ~ .ipad-layout #ipanel-3d,
  #itab-2d:checked ~ .ipad-layout #ipanel-2d,
  #itab-health:checked ~ .ipad-layout #ipanel-health {
    max-height: 5000px;
  }
  .ipad-panel h4 {
    font-family: 'Chakra Petch', sans-serif;
    font-size: 1.1rem;
    color: var(--text, #111);
    margin: 0 0 10px;
  }
  .ipad-panel p { color: var(--sub, #555); line-height: 1.75; margin-bottom: 8px; font-size: 0.92rem; }
  .ipad-panel ul, .ipad-panel ol { color: var(--sub, #555); padding-left: 18px; line-height: 1.85; margin-bottom: 10px; font-size: 0.92rem; }
  .ipad-panel li { margin-bottom: 4px; }
  .ipad-panel strong { color: var(--text, #111); }
  .ipad-panel img { border-radius: 8px; border: 1px solid var(--border, rgba(0,0,0,0.1)); max-width: 100%; margin: 6px 0; display: block; }
  .ipad-img-row { display: flex; gap: 8px; margin: 10px 0; }
  .ipad-img-row > div { flex: 1; }
  .ipad-img-row img { width: 100%; margin: 0 0 4px; }
  .ipad-img-row p { font-size: 0.72rem; color: var(--sub); margin: 0; line-height: 1.4; }
  .ipad-caption { font-size: 0.72rem; font-style: italic; color: var(--sub); margin-top: 2px !important; }

  /* ── Pill strip (below the grid) ── */
  .ipad-pills {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 12px 0 0;
  }
  .ipad-pill {
    padding: 5px 16px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid var(--border, rgba(0,0,0,0.12));
    color: var(--sub, #888);
    background: var(--panel, #f7f7f8);
    transition: background 0.22s, color 0.22s, border-color 0.22s;
    user-select: none;
  }
  #itab-3d:checked ~ .ipad-pills .ipill-3d,
  #itab-2d:checked ~ .ipad-pills .ipill-2d,
  #itab-health:checked ~ .ipad-pills .ipill-health {
    background: var(--text, #111);
    color: var(--bg, #fff);
    border-color: var(--text, #111);
  }

  @media (max-width: 768px) {
    .ipad-layout,
    #itab-3d:checked ~ .ipad-layout,
    #itab-2d:checked ~ .ipad-layout,
    #itab-health:checked ~ .ipad-layout { grid-template-columns: 1fr; }
    .ipad-content-col { opacity: 1; }
  }
</style>

<div class="ipad-viewer">
<input type="radio" name="ipad-hmi" id="itab-3d" class="hmi-radio">
<input type="radio" name="ipad-hmi" id="itab-2d" class="hmi-radio">
<input type="radio" name="ipad-hmi" id="itab-health" class="hmi-radio">
<div class="ipad-layout">
<div>
<div class="ipad-frame">
<div class="ipad-screen">
<div class="ipad-screen-imgs">
<div class="itab-cell-3d"><img class="itab-img-3d" src="../../asset/3d_map_view.jpeg" alt="3D Map View"></div>
<div class="itab-cell-2d"><img class="itab-img-2d" src="../../asset/2d_map_view.jpeg" alt="2D Dashboard View"></div>
</div>
<label for="itab-3d" class="ipad-overlay" style="left:0;top:0;width:26%;height:100%;z-index:1;">
<span class="ipad-overlay-text">3D Map</span>
</label>
<label for="itab-2d" class="ipad-overlay" style="left:26%;top:0;width:74%;height:100%;z-index:1;">
<span class="ipad-overlay-text">2D Dashboard</span>
</label>
<label for="itab-health" class="ipad-overlay ipad-overlay-health">
<span class="ipad-overlay-text">Health Monitor</span>
</label>
</div>
</div>
</div>
<div class="ipad-content-col">
<div id="ipanel-3d" class="ipad-panel">
<h4>B. 3D Spatial Visualizer</h4>
<p>Built with <strong>C++</strong>, <strong>ROS</strong>, <strong>Three.js</strong>, <strong>ROSBridge</strong>, and embedded <strong>Foxglove</strong>:</p>
<ol>
<li>
<p>We rendered lane boundaries and road markings from OpenStreetMap vector data.</p>
</li>
<li>
<p>We added detected objects created with Blender and a custom Three.js plugin.</p>
<div class="ipad-img-row">
<div>
<img src="../../asset/glb_model.png" alt="glb models">
<p>Car, pedestrian, deer, stop sign (.glb). Source: aUToronto</p>
</div>
<div>
<img src="../../asset/threejs_model.png" alt="three.js models">
<p>Cone, barrel, traffic light (Three.js). Source: aUToronto</p>
</div>
</div>
</li>
</ol>
</div>
<div id="ipanel-2d" class="ipad-panel">
<h4>A. 2D Dashboard</h4>
<p>Built with <strong>C++</strong>, <strong>ROS</strong>, <strong>React</strong>, <strong>Tailwind CSS</strong>, and <strong>Mapbox GL</strong>:</p>
<ul>
<li>Integrated an interactive 2D map overlay to let passengers and operators select navigation waypoints.</li>
<li>Visualized global route planning, localization states, and stack diagnostics.</li>
<li>Designed clean, responsive UI layouts for quick readability inside the vehicle.</li>
</ul>
</div>
<div id="ipanel-health" class="ipad-panel">
<h4>C. Health Monitor</h4>
<p>A real-time monitor displaying sensor states (<strong>Healthy</strong>, <strong>Degraded</strong>, <strong>Takeover</strong>), current draw, message frequency, and topic latency.</p>
<div class="ipad-img-row">
<div>
<img src="../../asset/gui_health_monitor_healthy.png" alt="Healthy">
<p>Healthy</p>
</div>
<div>
<img src="../../asset/gui_health_monitor_degraded.png" alt="Degraded">
<p>Degraded</p>
</div>
<div>
<img src="../../asset/gui_health_monitor_takeover.png" alt="Takeover">
<p>Takeover</p>
</div>
</div>
<p>When operating autonomously, the indicator shows solid blue lights. If a critical sensor fails, autonomy automatically disengages (flashing blue lights).</p>
<video width="100%" autoplay loop muted playsinline controls style="border-radius:8px;margin-top:8px;display:block;">
<source src="../../asset/GUI_autonomy_kickout_demo.mov" type="video/mp4">
</video>
<p class="ipad-caption">*Health Monitor co-developed with the System Safety Team.</p>
</div>
</div>
</div>
<div class="ipad-pills">
<label for="itab-3d" class="ipad-pill ipill-3d">3D Map</label>
<label for="itab-2d" class="ipad-pill ipill-2d">2D Dashboard</label>
<label for="itab-health" class="ipad-pill ipill-health">Health Monitor</label>
</div>
</div>

---

### 2. Physical Streamdeck Controls for ROS Nodes

To satisfy HMI challenge requirements and allow quick intervention, we mapped physical Streamdeck buttons to start and stop key ROS nodes directly without terminal interaction.

<img src="../../asset/streamdeck.JPG" width="500" alt="streamdeck">
Streamdeck used for HMI. Source: aUToronto

_\*Streamdeck software was developed by our team principal Chad and former GUI lead William._

---

## Engineering Challenges

### 3D Rendering Performance on In-Cabin Tablet

- **Problem:** When running on our Android tablet hardware, interacting with the 3D scene (panning and rotating) caused noticeable UI lag and dropped frames during live vehicle testing.
- **Cause:** The visualizer was attempting to process and re-render incoming high-frequency OSMs and spatial coordinate updates directly on every message arrival, causing GPU/CPU contention on the tablet without any buffer or cache.
- **Solution:** I implemented a point queue buffer to decouple incoming ROSBridge data ingestion from the Three.js render loop. This allowed the scene to batch coordinate updates and render predictably according to the screen refresh cycle rather than thrashing on every raw data packet.

<img src="../../asset/GUI_requirement_testing_result.png" alt="GUI Requirement Testing Result">
Numerical Result of Year 4 vs Year 5 Requirement Testing. Source: aUToronto
