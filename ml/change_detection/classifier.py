"""
Surface Change Classifier & Verdict Generator
Evaluates the 4 core domains:
1. Deforestation (forest loss ha and %)
2. Crop Stress (vegetation stress and drop %)
3. Flood Detection (water extent change ha)
4. General Land Change (transition classification)
"""

from typing import Dict, Any
import numpy as np


def analyze_deforestation(
    t1_ndvi: np.ndarray,
    t2_ndvi: np.ndarray,
    pixel_area_ha: float = 0.01  # 10m x 10m Sentinel-2 pixel = 100 m^2 = 0.01 hectare
) -> Dict[str, Any]:
    """
    Deforestation Verdict:
    Identifies high forest canopy (NDVI >= 0.55) transitioning to low vegetation (< 0.30).
    """
    initial_forest = (t1_ndvi >= 0.55)
    forest_lost = initial_forest & (t2_ndvi < 0.35) & ((t1_ndvi - t2_ndvi) >= 0.25)

    initial_forest_px = int(np.sum(initial_forest))
    lost_forest_px = int(np.sum(forest_lost))

    initial_ha = round(initial_forest_px * pixel_area_ha, 2)
    lost_ha = round(lost_forest_px * pixel_area_ha, 2)
    loss_pct = round((lost_forest_px / initial_forest_px * 100) if initial_forest_px > 0 else 0.0, 2)

    verdict_status = "CRITICAL_LOSS" if loss_pct > 15 else "MODERATE_LOSS" if loss_pct > 5 else "STABLE"

    return {
        "module": "deforestation",
        "verdict": verdict_status,
        "initial_forest_hectares": initial_ha,
        "lost_forest_hectares": lost_ha,
        "loss_percentage": loss_pct,
        "mean_ndvi_drop": round(float(np.nanmean(t1_ndvi[forest_lost] - t2_ndvi[forest_lost])) if lost_forest_px > 0 else 0.0, 3),
        "summary": f"{lost_ha} ha of forest lost ({loss_pct}% canopy clearance detected)."
    }


def analyze_crop_stress(
    t1_ndvi: np.ndarray,
    t2_ndvi: np.ndarray,
    pixel_area_ha: float = 0.01
) -> Dict[str, Any]:
    """
    Crop Stress Verdict:
    Detects moderate NDVI declines (15% to 45% drop) in agricultural vegetation (NDVI 0.35 - 0.75).
    """
    cropland = (t1_ndvi >= 0.35) & (t1_ndvi < 0.85)
    delta_ndvi = t2_ndvi - t1_ndvi
    
    # Significant vegetative health loss without complete clearing
    stressed = cropland & (delta_ndvi <= -0.15) & (t2_ndvi >= 0.20)
    healthy = cropland & (delta_ndvi > -0.10)

    cropland_px = int(np.sum(cropland))
    stressed_px = int(np.sum(stressed))
    healthy_px = int(np.sum(healthy))

    stressed_ha = round(stressed_px * pixel_area_ha, 2)
    healthy_ha = round(healthy_px * pixel_area_ha, 2)
    stress_pct = round((stressed_px / cropland_px * 100) if cropland_px > 0 else 0.0, 2)

    status = "ACUTE_STRESS" if stress_pct > 25 else "MODERATE_STRESS" if stress_pct > 10 else "NOMINAL"

    return {
        "module": "crop_stress",
        "verdict": status,
        "cropland_hectares": round(cropland_px * pixel_area_ha, 2),
        "stressed_hectares": stressed_ha,
        "healthy_hectares": healthy_ha,
        "stress_percentage": stress_pct,
        "summary": f"{stressed_ha} ha exhibiting vegetative stress ({stress_pct}% of crop zone)."
    }


def analyze_flood_extent(
    t1_mndwi: np.ndarray,
    t2_mndwi: np.ndarray,
    pixel_area_ha: float = 0.01
) -> Dict[str, Any]:
    """
    Flood Verdict:
    Monitors expansion of surface water using MNDWI (> 0.0 is water).
    """
    initial_water = (t1_mndwi > 0.0)
    final_water = (t2_mndwi > 0.0)

    inundated = ~initial_water & final_water
    receded = initial_water & ~final_water

    initial_ha = round(int(np.sum(initial_water)) * pixel_area_ha, 2)
    inundated_ha = round(int(np.sum(inundated)) * pixel_area_ha, 2)
    receded_ha = round(int(np.sum(receded)) * pixel_area_ha, 2)
    net_water_ha = round(int(np.sum(final_water)) * pixel_area_ha, 2)

    status = "MASSIVE_INUNDATION" if inundated_ha > 50 else "LOCAL_SURGE" if inundated_ha > 10 else "NORMAL_BASELINE"

    return {
        "module": "flood_detection",
        "verdict": status,
        "baseline_water_hectares": initial_ha,
        "inundated_hectares": inundated_ha,
        "receded_hectares": receded_ha,
        "current_water_hectares": net_water_ha,
        "summary": f"{inundated_ha} ha newly submerged land detected."
    }


def analyze_general_land_change(
    t1_ndvi: np.ndarray,
    t2_ndvi: np.ndarray,
    t1_mndwi: np.ndarray,
    t2_mndwi: np.ndarray,
    pixel_area_ha: float = 0.01
) -> Dict[str, Any]:
    """
    General Land Change:
    Categorizes transition into:
    - Vegetation Loss
    - Water Gain (Inundation)
    - Built-up / Bare Soil Expansion
    - Revegetation / Greening
    """
    d_ndvi = t2_ndvi - t1_ndvi
    d_mndwi = t2_mndwi - t1_mndwi

    veg_loss = (d_ndvi <= -0.20) & (t2_mndwi <= 0.0)
    water_gain = (t1_mndwi <= 0.0) & (t2_mndwi > 0.0)
    bare_builtup = (d_ndvi <= -0.15) & (t2_ndvi < 0.25) & (t2_mndwi < -0.10)
    greening = (d_ndvi >= 0.20)

    h_veg_loss = round(int(np.sum(veg_loss)) * pixel_area_ha, 2)
    h_water_gain = round(int(np.sum(water_gain)) * pixel_area_ha, 2)
    h_builtup = round(int(np.sum(bare_builtup)) * pixel_area_ha, 2)
    h_greening = round(int(np.sum(greening)) * pixel_area_ha, 2)

    dominant = "Vegetation Loss"
    max_h = h_veg_loss
    if h_water_gain > max_h:
        dominant = "Water Inundation"
        max_h = h_water_gain
    if h_builtup > max_h:
        dominant = "Built-up / Bare Earth"
        max_h = h_builtup
    if h_greening > max_h:
        dominant = "Revegetation / Growth"
        max_h = h_greening

    return {
        "module": "general_land_change",
        "dominant_transition": dominant,
        "breakdown_hectares": {
            "vegetation_loss": h_veg_loss,
            "water_gain": h_water_gain,
            "bare_soil_builtup": h_builtup,
            "greening": h_greening
        },
        "summary": f"Dominant trajectory: {dominant} covering {max_h} ha."
    }
