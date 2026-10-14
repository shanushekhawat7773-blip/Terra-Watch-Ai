"""
Cloud Masking via Sentinel-2 Scene Classification Layer (SCL)
SCL Classes:
  0: NO_DATA
  1: SATURATED_OR_DEFECTIVE
  2: DARK_AREA_PIXELS
  3: CLOUD_SHADOWS
  4: VEGETATION
  5: NOT_VEGETATED
  6: WATER
  7: UNCLASSIFIED
  8: CLOUD_MEDIUM_PROBABILITY
  9: CLOUD_HIGH_PROBABILITY
  10: THIN_CIRRUS
  11: SNOW
"""

from typing import Tuple
import numpy as np


def apply_scl_cloud_mask(
    bands: dict[str, np.ndarray],
    scl: np.ndarray | None = None
) -> Tuple[dict[str, np.ndarray], np.ndarray, float]:
    """
    Applies cloud and shadow mask.
    Returns:
      masked_bands: Dictionary of bands with invalid pixels set to NaN or interpolated
      mask: Boolean array where True means valid pixel, False means obscured (cloud/shadow)
      cloud_fraction: Percentage of scene covered by clouds/shadows
    """
    sample_band = next(iter(bands.values()))
    h, w = sample_band.shape

    if scl is None:
        # Fallback heuristic: High blue reflectance + low NDVI = probable cloud
        if "B02" in bands and "B04" in bands and "B08" in bands:
            blue = bands["B02"]
            nir = bands["B08"]
            # Clouds are typically bright in blue and visible
            is_cloud = (blue > 0.35) & (nir > 0.30)
            valid_mask = ~is_cloud
        else:
            valid_mask = np.ones((h, w), dtype=bool)
    else:
        # Standard Sentinel-2 SCL Cloud Mask
        # Obscured: 3 (Shadow), 8 (Med cloud), 9 (High cloud), 10 (Cirrus)
        obscured = np.isin(scl, [3, 8, 9, 10])
        valid_mask = ~obscured

    cloud_fraction = float(np.mean(~valid_mask) * 100.0)

    masked_bands = {}
    for band_name, band_data in bands.items():
        masked = np.copy(band_data).astype(np.float32)
        masked[~valid_mask] = np.nan
        masked_bands[band_name] = masked

    return masked_bands, valid_mask, round(cloud_fraction, 2)
