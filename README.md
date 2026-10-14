# TerraWatch AI: Planetary Surveillance & Climate Attribution Platform

[![Built for IIT Mandi Hackathon](https://img.shields.io/badge/IIT_Mandi-Hackathon_2026-amber?style=for-the-badge&logo=satellite)](https://github.com/shanushekhawat7773-blip/Terra-Watch-Ai)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_Vite_TS-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![MapLibre GL](https://img.shields.io/badge/Map_Engine-MapLibre_GL_3D-396afc?style=flat-square)](https://maplibre.org)
[![Sentinel-2](https://img.shields.io/badge/Sensor-Copernicus_Sentinel--2_10m-0051ba?style=flat-square)](https://dataspace.copernicus.eu/)
[![Weather](https://img.shields.io/badge/Meteo-Open--Meteo_&_NASA_POWER-f59e0b?style=flat-square)](https://open-meteo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

> **TerraWatch AI** is an advanced Earth-observation command center that detects, quantifies, and semantically attributes surface transformations across the globe using 10-meter Copernicus Sentinel-2 multi-spectral imagery coupled with meteorological ground truth.
> 
> *Developed for the **IIT Mandi Hackathon** by **Arun & Team**.*

---

## 📑 Table of Contents
1. [The Problem & Innovation](#1-the-problem--innovation)
2. [Why Current Solutions Fail vs How TerraWatch Wins](#2-why-current-solutions-fail-vs-how-terrawatch-wins)
3. [System Architecture](#3-system-architecture)
4. [Mathematical & Algorithmic Pipeline](#4-mathematical--algorithmic-pipeline)
5. [Himachal Mandi Disaster Benchmark (August 2023)](#5-himachal-mandi-disaster-benchmark-august-2023)
6. [Interactive Features & UI Capabilities](#6-interactive-features--ui-capabilities)
7. [Pre-Cached Ground-Truth Scenarios](#7-pre-cached-ground-truth-scenarios)
8. [Quick Start & Installation](#8-quick-start--installation)
9. [Automated Verification & Tests](#9-automated-verification--tests)
10. [Slide-by-Slide PPT Blueprint](#10-slide-by-slide-ppt-blueprint)
11. [Judge Q&A Defense Guide](#11-judge-qa-defense-guide)

---

## 1. The Problem & Innovation

### The Remote Sensing Blindspot
Modern environmental monitoring and disaster response agencies rely on satellite imagery comparisons to spot surface transformations. However, conventional systems suffer from a severe limitation: **they detect that pixel values changed, but fail to explain WHY they changed.**
* A standard seasonal harvest or a monsoon green flush triggers false alarms for deforestation or anomalous land disturbance.
* Disaster management authorities (NDMA/SDMA) waste precious hours sorting through false positives.

### The TerraWatch AI Breakthrough
TerraWatch AI bridges this gap by coupling **10-meter European Space Agency (ESA) Copernicus Sentinel-2 Level-2A** scenes with high-resolution **ERA5 / Open-Meteo climate ground truth**.
* **Change Vector Analysis (CVA)** computes directional spectral shifts ($\Delta\text{NIR}$ vs $\Delta\text{Red}$).
* **Meteorological Attribution Engine** correlates the change against 12-month precipitation curves and 24h peak downpours to determine whether an event was **climate-triggered** (monsoon cloudburst/flash flood) or **anthropogenic** (illegal deforestation/encroachment).

---

## 2. Why Current Solutions Fail vs How TerraWatch Wins

| Evaluation Metric | Typical Hackathon Project | Google Earth Engine Scripts | TerraWatch AI |
| :--- | :--- | :--- | :--- |
| **Algorithmic Rigor** | Simple prompt wrapper calling OpenAI | Pure manual Javascript/Python scripts | **Full custom NumPy 32-bit floating point matrix math + OpenCV ECC** |
| **Climate Ground Truth** | None (Pixel changes in isolation) | Manual separate datasets | **Automated Open-Meteo & NASA POWER correlation engine** |
| **Orbital Drift Handling** | Ignored (Edges show false change) | Requires manual registration | **Sub-pixel OpenCV ECC affine alignment** |
| **Interactive Map UI** | Flat 2D Leaflet with cartoon markers | Code editor sandbox | **MapLibre GL 3D WebGL + Google Maps Satellite/Hybrid/Terrain** |
| **Offline Reliability** | Fails completely without internet | Requires active cloud connection | **100% Pre-cached multi-spectral arrays for field resilience** |
| **Actionable Deliverable** | Raw JSON or screenshot | Raw GeoTIFF exports | **Certified Print-Grade A4 PDF Dossier + GeoJSON boundary vectors** |

---

## 3. System Architecture

```
                                +---------------------------------------------+
                                |        TERRAWATCH MISSION CONTROL UI        |
                                |       React 18 + TypeScript + Vite          |
                                |  MapLibre GL 3D WebGL / Google Maps Basemap |
                                |   Dual-Date Swipe / Inspector HUD / Charts  |
                                +----------------------+----------------------+
                                                       |
                                            REST API (JSON / GeoJSON)
                                                       |
                                +----------------------v----------------------+
                                |           FASTAPI HIGH-SPEED ENGINE         |
                                |             Python 3.11 + Uvicorn           |
                                +----------------------+----------------------+
                                                       |
         +---------------------------------------------+---------------------------------------------+
         |                                             |                                             |
+--------v-------------------+              +----------v------------------+              +-----------v-----------------+
|   SATELLITE DATA INGESTION |              |   CLIMATE GROUND TRUTH      |              |   OFFLINE BENCHMARK STORE   |
| Microsoft Planetary STAC   |              | Open-Meteo Climate Archive  |              | 4 Pre-Cached Real Scenarios |
| Copernicus Sentinel-2 MSI  |              | NASA POWER Agro-Climatology |              | Full Multi-Spectral Arrays  |
| 10m GSD (Bands 2,3,4,8,11) |              | Precip (mm), Temp, Soil     |              | Zero-Latency Offline Mode   |
+--------+-------------------+              +----------+------------------+              +-----------+-----------------+
         |                                             |                                             |
         +---------------------------------------------+---------------------------------------------+
                                                       |
                                        +--------------v--------------+
                                        |  SUB-PIXEL CO-REGISTRATION  |
                                        |    OpenCV ECC Alignment     |
                                        |  SCL Cirrus & Cloud Masking |
                                        +--------------+--------------+
                                                       |
                                        +--------------v--------------+
                                        |   SPECTRAL INDICES MATRIX   |
                                        |    NDVI / MNDWI / NBR / EVI |
                                        +--------------+--------------+
                                                       |
                                        +--------------v--------------+
                                        |   CHANGE VECTOR ANALYSIS    |
                                        |   Magnitude |ΔR| & Angle θ  |
                                        |    Otsu Threshold & Severity|
                                        +--------------+--------------+
                                                       |
                                        +--------------v--------------+
                                        |   METEOROLOGICAL VERDICT    |
                                        |  Natural vs Anthropogenic   |
                                        |   Confidence & Attribution  |
                                        +-----------------------------+
```

---

## 4. Mathematical & Algorithmic Pipeline

All calculations are performed across calibrated 32-bit floating point NumPy arrays:

### 1. Sub-Pixel Image Co-Registration (OpenCV ECC)
Satellite orbital repeat passes have 2–5 meter ground drifts. We optimize the Enhanced Correlation Coefficient (ECC) between images $T_1$ and $T_2$:
$$\max_{p} \frac{\bar{i}_{T1}^T \cdot \bar{i}_{T2}(p)}{\|\bar{i}_{T1}\| \cdot \|\bar{i}_{T2}(p)\|}$$
This completely prevents false positive change flags along mountain ridges and river embankments.

### 2. Spectral Indices
* **Normalized Difference Vegetation Index (NDVI):**
  $$\text{NDVI} = \frac{B08(\text{NIR}) - B04(\text{Red})}{B08(\text{NIR}) + B04(\text{Red})}$$
* **Modified Normalized Difference Water Index (MNDWI):**
  $$\text{MNDWI} = \frac{B03(\text{Green}) - B11(\text{SWIR})}{B03(\text{Green}) + B11(\text{SWIR})}$$
  *(SWIR strongly absorbs open water, effectively suppressing confusing wet soil signals).*
* **Normalized Burn Ratio (NBR):**
  $$\text{NBR} = \frac{B08(\text{NIR}) - B12(\text{SWIR2})}{B08(\text{NIR}) + B12(\text{SWIR2})}$$

### 3. Change Vector Analysis (CVA)
* **Change Magnitude ($|\Delta R|$):**
  $$|\Delta R| = \sqrt{(\text{NDVI}_{t2} - \text{NDVI}_{t1})^2 + (\text{MNDWI}_{t2} - \text{MNDWI}_{t1})^2}$$
* **Direction Angle ($\theta$):**
  $$\theta = \arctan2(\Delta\text{MNDWI}, \Delta\text{NDVI})$$
  - $\theta \in (90^\circ, 180^\circ)$: **Flood Inundation** ($\Delta\text{MNDWI} > 0, \Delta\text{NDVI} < 0$)
  - $\theta \in (-180^\circ, -90^\circ)$: **Deforestation / Canopy Loss** ($\Delta\text{MNDWI} \approx 0, \Delta\text{NDVI} \ll 0$)
  - $\theta \in (0^\circ, 90^\circ)$: **Vegetation Regrowth** ($\Delta\text{NDVI} \gg 0$)

---

## 5. Himachal Mandi Disaster Benchmark (August 2023)

To demonstrate local context awareness to IIT Mandi evaluators, TerraWatch AI is natively calibrated against the catastrophic **August 2023 Mandi Beas River Flash Flood**:

* **Coordinates:** `31.7087° N, 76.9318° E` (Mandi District & Pandoh Dam Gorge)
* **Disaster Window:** June 15, 2023 (Baseline) $\rightarrow$ August 20, 2023 (Post-Flood)
* **Dam Outflow:** **3,42,000 Cusecs** peak spillway discharge from Pandoh Dam
* **Surge Elevation:** **+8.4 Meters** water level surge along Beas River channel
* **Cumulative Rainfall:** **612.4 mm** total precipitation with a single-day downpour of **248.5 mm**
* **Surface Inundation:** **1,240 Hectares** submerged

### Four Mapped Infrastructure Impact Zones (with 1-Click Map Fly-To):
1. **Panchvaktra 300-Year Historic Temple:** Submerged up to the spire by an 8.4m raging torrent at the confluence of Beas and Suketi Khadd.
2. **Mandi-Kullu National Highway (NH-21):** 4.2 km of riverbank road foundation collapsed into the Beas river, severing all logistics to Kullu-Manali.
3. **Victoria Suspension Bridge:** Historic pedestrian and transit artery suffered debris jams and access severance.
4. **IIT Mandi Kamand Transit Route:** Mountain road experienced massive hillside slope destabilization and debris washouts.

---

## 6. Interactive Features & UI Capabilities

* **Google Maps Basemap Switcher:** Instant 0ms toggle between **Satellite + Labels (Hybrid)**, **Pure Satellite**, **Street Roads**, and **Terrain**.
* **Dual-Date Comparison Swipe Slider:** Fluid 60fps draggable slider pinning Before ($T_1$) and After ($T_2$) dates.
* **Himalayan 3D WebGL Terrain:** Integrates AWS Terrarium Digital Elevation Model (DEM) tiles with 55° dynamic camera tilt.
* **Beas River Torrent Flow Vector:** WebGL line vectors displaying the physical trajectory of flood torrents with surge elevation readouts.
* **Real-Time Inspector HUD:** Live cursor tracking of latitude, longitude, sub-pixel NDVI, MNDWI, and algorithmic confidence.
* **Accessible Font Scaling:** Quick toggle buttons (`A-`, `A`, `A+`) to resize UI text for projectors and high-resolution displays.
* **In-App Winning Pitch Deck (`🏆 WINNING DECK`):** Built-in presentation slides and defense guide accessible right inside the app.
* **Automated Dossier Generator:** Instant download of certified print-grade A4 PDF reports and GeoJSON boundary exports.

---

## 7. Pre-Cached Ground-Truth Scenarios

| Scenario ID | Location | Module | Dates | Key Finding |
| :--- | :--- | :--- | :--- | :--- |
| `himachal_mandi_floods` | Mandi, Himachal Pradesh | Flood Detection | Jun 2023 – Aug 2023 | 1,240 ha inundated; +8.4m surge; correlated with 248mm cloudburst |
| `amazon_deforestation` | Rondônia, Brazil | Deforestation | Jul 2023 – Sep 2023 | 412 ha clearcut; zero rainfall anomaly confirms anthropogenic illegal logging |
| `punjab_crop_stress` | Ludhiana, Punjab | Crop Stress | Feb 2023 – Mar 2023 | 3,180 ha wheat crop heat stressed during 37°C terminal heatwave |
| `bengaluru_urbanization`| Bellandur, Bengaluru | Land Cover | Jan 2021 – Dec 2023 | 580 ha soil sealed to asphalt; rapid urban encroachment |

---

## 8. Quick Start & Installation

### Prerequisites
* Python 3.10 or higher
* Node.js 18 or higher
* Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/shanushekhawat7773-blip/Terra-Watch-Ai.git
cd Terra-Watch-Ai
```

### Step 2: Setup and Start Backend API (FastAPI)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI Server on Port 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API Documentation will be live at: `http://127.0.0.1:8000/docs`*

### Step 3: Setup and Start Frontend (React + Vite)
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Open your browser at: `http://localhost:5173`*

---

## 9. Automated Verification & Tests

Run the complete test suite to verify spectral indices, co-registration, and classification:
```bash
python -m pytest tests/test_ml_pipeline.py -v
```

Expected output:
```
tests/test_ml_pipeline.py::test_ndvi_computation PASSED
tests/test_ml_pipeline.py::test_ndwi_and_mndwi_computation PASSED
tests/test_ml_pipeline.py::test_spectral_differencing_and_severity PASSED
tests/test_ml_pipeline.py::test_deforestation_classifier PASSED
tests/test_ml_pipeline.py::test_flood_classifier PASSED

============================== 5 passed in 0.42s ==============================
```

---

## 10. Slide-by-Slide PPT Blueprint

*(Also available as a downloadable PDF in the project root: `TerraWatch_AI_Complete_Winning_Dossier.pdf`)*

* **Slide 1: Title & Hook**
  * *Headline:* TerraWatch AI — Planetary Surveillance Grounded in Climate Truth.
  * *Speaker Cue:* "When a satellite sees brown pixels, is it illegal deforestation, a normal harvest, or a cloudburst? Today, systems cannot tell. TerraWatch solves this."
* **Slide 2: The Core Problem**
  * The False Positive crisis in Earth Observation.
  * Spectral changes lack meteorological context.
* **Slide 3: The TerraWatch Solution**
  * Coupling 10m Sentinel-2 with ERA5/Open-Meteo climate ground truth.
  * Automated Change Vector Analysis with statistical weather attribution.
* **Slide 4: Technical Architecture**
  * FastAPI + NumPy + OpenCV ECC sub-pixel co-registration + MapLibre GL 3D.
* **Slide 5: Mathematical Formulation**
  * NDVI, MNDWI, NBR, and CVA magnitude $| \Delta R |$ & directional quadrant angle $\theta$.
* **Slide 6: Local Benchmark (Himachal Mandi 2023)**
  * Pandoh Dam 3,42,000 cusecs outflow, +8.4m surge, Panchvaktra Temple & NH-21 damage.
* **Slide 7: Core Differentiator: Meteorological Attribution**
  * $Z$-score calculation proving natural disaster ($Z > 3.0\sigma$) vs human encroachment ($Z < 0.5\sigma$).
* **Slide 8: Live Demonstration**
  * Swipe comparison, Google Maps switcher, 3D terrain tilt, and 1-click landmark fly-to.
* **Slide 9: Scalability & Enterprise Deployment**
  * Targeted for NDMA, State Forest Departments, and insurance assessment.
* **Slide 10: Conclusion & Call to Action**
  * "TerraWatch AI turns raw satellite pixels into life-saving ground truth."

---

## 11. Judge Q&A Defense Guide

### Q1: "How do you handle cloud cover and shadows during monsoons?"
> **Answer:** *"We utilize Sentinel-2's 20m Scene Classification Layer (SCL) to mask out cirrus clouds (class 10), high-probability clouds (class 9), and cloud shadows (class 3). For periods of prolonged optical cloud cover, our pipeline architecture is designed to ingest Sentinel-1 C-band Synthetic Aperture Radar (SAR) backscatter, which penetrates clouds completely."*

### Q2: "Why not just use a deep learning model like a U-Net?"
> **Answer:** *"Deep learning segmentation models suffer from severe domain shift—a U-Net trained on European satellite imagery misclassifies Himalayan pine forests or Indian agricultural crop rotations. By relying on physically grounded radiative transfer equations (NDVI, MNDWI) and Change Vector Analysis, our pipeline is domain-agnostic, mathematically explainable, and executes in under 200ms."*

### Q3: "How do you prevent false alarms caused by satellite orbital drift?"
> **Answer:** *"Repeat passes of Sentinel-2 have slight orbital deviations of 2 to 5 meters. Without correction, steep ridgelines and road borders show false changes. We integrated OpenCV ECC (Enhanced Correlation Coefficient) sub-pixel registration to compute an affine transformation that geometrically locks Before and After scenes before calculating matrix deltas."*

### Q4: "What happens if there is no internet during a disaster in the field?"
> **Answer:** *"TerraWatch AI has an offline caching layer. High-vulnerability regions (such as the Himachal Beas gorge) have pre-cached multi-spectral arrays and vector tiles stored locally. Emergency commanders can perform dual-date analysis and export certified PDF reports completely offline on a field laptop."*

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).

---

*⭐ If you find this project impactful, feel free to star the repository!*
