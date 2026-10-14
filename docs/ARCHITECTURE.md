# TerraWatch AI Architecture & Data Pipeline Plan

## 1. System Architecture Overview

```
                                      +-----------------------------------------+
                                      |         TERRAWATCH MISSION CONTROL       |
                                      |     React 18 + Vite + MapLibre GL       |
                                      |   Swipe Slider / Heatmap Overlay / D3   |
                                      +--------------------+--------------------+
                                                           |
                                           REST API / JSON / GeoJSON
                                                           |
                                      +--------------------v--------------------+
                                      |         FASTAPI HIGH-THROUGHPUT         |
                                      |             BACKEND CORE                |
                                      +--------------------+--------------------+
                                                           |
             +--------------------+------------------------+------------------------+-------------------+
             |                    |                                                 |                   |
+------------v-----------+ +------v-----------------+                             +-v-----------------+ +-v-----------------+
| Planetary Computer     | | Open-Meteo &           |                             | Pre-Cached Real   | | PDF & GeoJSON     |
| STAC API & Copernicus  | | NASA POWER API         |                             | Scenarios Store   | | Export Engine     |
| (Sentinel-2 L2A Bands) | | (Precip / Temp Daily)  |                             | (Offline Fallback)| | (ReportLab)       |
+------------+-----------+ +------+-----------------+                             +--------+----------+ +-------------------+
             |                    |                                                        |
             +--------->----------+-------------------------+------------------------------+
                                                            |
                                              +-------------v--------------+
                                              |    IMAGE CO-REGISTRATION   |
                                              |      & CLOUD MASKING       |
                                              |     (SCL Band 3,8,9,10)    |
                                              +-------------+--------------+
                                                            |
                                              +-------------v--------------+
                                              |   SPECTRAL INDICES ENGINE  |
                                              |  NDVI / NDWI / NBR / EVI   |
                                              +-------------+--------------+
                                                            |
                                              +-------------v--------------+
                                              | CHANGE DETECTION PIPELINE  |
                                              |  CVA + Differencing + Otsu |
                                              | Severity Matrix & Clusters |
                                              +-------------+--------------+
                                                            |
                                              +-------------v--------------+
                                              |    WEATHER CORRELATION &   |
                                              |       ALERT VERDICT        |
                                              | Natural vs Anthropogenic   |
                                              +----------------------------+
```

## 2. Directory Structure

```
terra-watch-ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI entrypoint, CORS, routes
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py               # Settings, API base URLs, paths
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── analysis.py             # /api/analyze, /api/scenarios, /api/weather
│   │   │   ├── alerts.py               # /api/alerts, /api/timeseries
│   │   │   └── export.py               # /api/export/pdf, /api/export/geojson
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── planetary.py            # STAC search & Sentinel-2 downloader
│   │       ├── weather.py              # Open-Meteo & NASA POWER climate fetcher
│   │       ├── correlation.py          # Weather vs Earth change heuristic logic
│   │       ├── scenarios_service.py    # Offline real-data cache loader
│   │       └── report_service.py       # ReportLab PDF generator
├── ml/
│   ├── __init__.py
│   ├── indices/
│   │   ├── __init__.py
│   │   └── calculator.py               # NDVI, NDWI, MNDWI, NBR, EVI calculation
│   ├── preprocessing/
│   │   ├── __init__.py
│   │   ├── cloud_mask.py               # SCL scene classification masking
│   │   └── coregistration.py           # OpenCV ECC / ORB affine alignment
│   └── change_detection/
│       ├── __init__.py
│       ├── differencing.py             # Normalized difference & adaptive Otsu
│       ├── cva.py                      # Change Vector Analysis (Magnitude + Angle)
│       └── classifier.py               # Categorizer: Deforestation, Crop, Flood, Urban
├── data/
│   └── cached_scenarios/
│       ├── amazon_deforestation.json
│       ├── himachal_mandi_floods.json
│       ├── punjab_crop_stress.json
│       └── bengaluru_urbanization.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MissionControlHeader.tsx
│   │   │   ├── EarthMapViewer.tsx       # MapLibre GL dual-pane / swipe viewer
│   │   │   ├── SwipeSlider.tsx         # Before / After interactive split
│   │   │   ├── LayerControl.tsx        # RGB / NDVI / NDWI / Heatmap selector
│   │   │   ├── ModuleVerdictCard.tsx   # 4 core modules verdict displays
│   │   │   ├── WeatherCorrelation.tsx  # Meteo overlay & attribution badge
│   │   │   ├── AlertFeed.tsx           # Live alert triage list
│   │   │   ├── TimeSeriesChart.tsx     # 12-month NDVI trajectory + event marker
│   │   │   ├── ScenarioPresets.tsx     # 4 Quick-load scenario selectors
│   │   │   └── ExportModal.tsx         # PDF / GeoJSON download trigger
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
├── tests/
│   ├── test_indices.py
│   ├── test_change_detection.py
│   └── test_weather.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 3. Data Flow & Algorithmic Steps

1. **Query Sentinel-2**: STAC API queries STAC items for bounding box (BBox) and datetime range. Filters cloud cover < 20%. Fallback to cached ground-truth tiles if offline or rate-limited.
2. **Cloud Masking**: Sentinel-2 Scene Classification Layer (SCL). Mask values 3 (cloud shadow), 8 (cloud medium prob), 9 (cloud high prob), 10 (cirrus).
3. **Coregistration**: Align T1 and T2 images using Enhanced Correlation Coefficient (ECC) maximization on the Green band (B3) to ensure zero sub-pixel false positives.
4. **Spectral Indices**:
   - `NDVI = (B08 - B04) / (B08 + B04 + 1e-7)`
   - `NDWI = (B03 - B08) / (B03 + B08 + 1e-7)` (McFeeters water)
   - `MNDWI = (B03 - B11) / (B03 + B11 + 1e-7)` (Modified water / flood extent)
   - `NBR = (B08 - B12) / (B08 + B12 + 1e-7)` (Normalized Burn Ratio / Fire / Clearcut)
   - `EVI = 2.5 * (B08 - B04) / (B08 + 6.0 * B04 - 7.5 * B02 + 1.0)`
5. **Change Vector Analysis (CVA)**:
   - Magnitude: $\Delta M = \sqrt{\Delta NDVI^2 + \Delta NDWI^2}$
   - Direction: $\theta = \arctan2(\Delta NDWI, \Delta NDVI)$
   - Otsu automated thresholding on Magnitude identifies true signal vs noise.
6. **Module Verdicts**:
   - Deforestation: Forest pixels ($NDVI_{T1} > 0.6$) dropping by $> 0.25$ in T2. Area computed in hectares from GSD.
   - Crop Stress: Cropland pixels showing $15\% - 40\%$ drop in NDVI without soil transition.
   - Flood: Water pixels where $MNDWI_{T2} > 0$ and $MNDWI_{T1} \le 0$.
   - Urban/Bare Soil: Vegetation loss accompanied by increase in SWIR/Red reflectance.
7. **Weather Correlation (The Differentiator)**:
   - Query daily precipitation, soil moisture, and temperature via Open-Meteo Archive API.
   - If water gain occurs with 14-day cumulative rainfall $> 200\text{ mm}$ (e.g. Mandi Aug 2023): Flag as `CLIMATE_TRIGGERED_EVENT (Monsoon Inundation / Flash Flood)` with $94\%$ confidence.
   - If forest loss occurs during normal precipitation and stable temperatures: Flag as `ANTHROPOGENIC_EVENT (Illegal Encroachment / Logging)` with $91\%$ confidence.
