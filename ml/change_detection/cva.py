"""
Change Vector Analysis (CVA)
Multi-dimensional change vector calculation in (NDVI, NDWI) or (Red, NIR) space.
Magnitude denotes intensity of alteration; Angle denotes nature/type of transition.
"""

from typing import Tuple, Dict, Any
import numpy as np


def compute_cva(
    t1_ndvi: np.ndarray,
    t1_ndwi: np.ndarray,
    t2_ndvi: np.ndarray,
    t2_ndwi: np.ndarray
) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
    """
    Computes Change Vector Analysis:
      delta_ndvi = t2_ndvi - t1_ndvi
      delta_ndwi = t2_ndwi - t1_ndwi
      magnitude = sqrt(delta_ndvi^2 + delta_ndwi^2)
      angle = arctan2(delta_ndwi, delta_ndvi) in degrees [0, 360)
    """
    d_ndvi = t2_ndvi - t1_ndvi
    d_ndwi = t2_ndwi - t1_ndwi

    magnitude = np.sqrt(d_ndvi**2 + d_ndwi**2)
    # Angle in radians -> degrees
    angle_rad = np.arctan2(d_ndwi, d_ndvi)
    angle_deg = (np.degrees(angle_rad) + 360.0) % 360.0

    # Sector definitions:
    # Sector 1 (0 - 90 deg): +NDVI, +NDWI (Revegetation / Moisture Gain)
    # Sector 2 (90 - 180 deg): -NDVI, +NDWI (Flooding / Water Inundation)
    # Sector 3 (180 - 270 deg): -NDVI, -NDWI (Deforestation / Urban Clearcut)
    # Sector 4 (270 - 360 deg): +NDVI, -NDWI (Drying / Canopy Maturation)

    mean_mag = float(np.nanmean(magnitude))
    max_mag = float(np.nanmax(magnitude))

    stats = {
        "mean_magnitude": round(mean_mag, 4),
        "max_magnitude": round(max_mag, 4),
        "dominant_vector_degrees": round(float(np.nanmean(angle_deg)), 1)
    }

    return magnitude, angle_deg, stats
