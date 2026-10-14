"""
Spectral Indices Calculator
Vectorized computation of NDVI, NDWI, MNDWI, NBR, and EVI with numerical stabilization.
"""

import numpy as np


def compute_ndvi(red: np.ndarray, nir: np.ndarray, eps: float = 1e-7) -> np.ndarray:
    """
    Normalized Difference Vegetation Index
    NDVI = (NIR - Red) / (NIR + Red)
    Healthy vegetation: > 0.4. Water: < 0. Bare soil: 0.1 - 0.2
    """
    nir = nir.astype(np.float32)
    red = red.astype(np.float32)
    denom = nir + red + eps
    ndvi = (nir - red) / denom
    return np.clip(ndvi, -1.0, 1.0)


def compute_ndwi(green: np.ndarray, nir: np.ndarray, eps: float = 1e-7) -> np.ndarray:
    """
    Normalized Difference Water Index (McFeeters)
    NDWI = (Green - NIR) / (Green + NIR)
    Water bodies: > 0. Non-water: <= 0
    """
    green = green.astype(np.float32)
    nir = nir.astype(np.float32)
    denom = green + nir + eps
    ndwi = (green - nir) / denom
    return np.clip(ndwi, -1.0, 1.0)


def compute_mndwi(green: np.ndarray, swir: np.ndarray, eps: float = 1e-7) -> np.ndarray:
    """
    Modified Normalized Difference Water Index (Xu)
    MNDWI = (Green - SWIR) / (Green + SWIR)
    Superior for flood inundation and separating built-up noise from muddy floodwaters.
    """
    green = green.astype(np.float32)
    swir = swir.astype(np.float32)
    denom = green + swir + eps
    mndwi = (green - swir) / denom
    return np.clip(mndwi, -1.0, 1.0)


def compute_nbr(nir: np.ndarray, swir2: np.ndarray, eps: float = 1e-7) -> np.ndarray:
    """
    Normalized Burn Ratio
    NBR = (NIR - SWIR2) / (NIR + SWIR2)
    Used to detect burn severity, clearcut forest scars, and soil disturbance.
    """
    nir = nir.astype(np.float32)
    swir2 = swir2.astype(np.float32)
    denom = nir + swir2 + eps
    nbr = (nir - swir2) / denom
    return np.clip(nbr, -1.0, 1.0)


def compute_evi(blue: np.ndarray, red: np.ndarray, nir: np.ndarray, eps: float = 1e-7) -> np.ndarray:
    """
    Enhanced Vegetation Index
    EVI = 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
    Optimized for dense canopy regions like the Amazon where NDVI saturates.
    """
    nir = nir.astype(np.float32)
    red = red.astype(np.float32)
    blue = blue.astype(np.float32)
    denom = nir + 6.0 * red - 7.5 * blue + 1.0 + eps
    evi = 2.5 * (nir - red) / denom
    return np.clip(evi, -1.0, 1.0)
