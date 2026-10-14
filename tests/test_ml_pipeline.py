import pytest
import numpy as np
from ml.indices.calculator import (
    compute_ndvi,
    compute_ndwi,
    compute_mndwi,
    compute_nbr,
    compute_evi
)
from ml.change_detection.differencing import (
    compute_spectral_differencing,
    compute_severity_score
)
from ml.change_detection.cva import compute_cva
from ml.change_detection.classifier import (
    analyze_deforestation,
    analyze_crop_stress,
    analyze_flood_extent
)


def test_ndvi_computation():
    red = np.array([[0.1, 0.2], [0.05, 0.3]], dtype=np.float32)
    nir = np.array([[0.8, 0.6], [0.70, 0.4]], dtype=np.float32)
    ndvi = compute_ndvi(red, nir)
    assert ndvi.shape == (2, 2)
    assert np.all(ndvi >= -1.0) and np.all(ndvi <= 1.0)
    # NIR 0.8, Red 0.1 => (0.8 - 0.1)/(0.9) = 0.777
    assert round(float(ndvi[0, 0]), 2) == 0.78


def test_ndwi_and_mndwi_computation():
    green = np.array([[0.4, 0.1]], dtype=np.float32)
    nir = np.array([[0.1, 0.5]], dtype=np.float32)
    swir = np.array([[0.05, 0.6]], dtype=np.float32)

    ndwi = compute_ndwi(green, nir)
    mndwi = compute_mndwi(green, swir)

    assert ndwi[0, 0] > 0  # Water characteristic
    assert mndwi[0, 0] > 0


def test_spectral_differencing_and_severity():
    before = np.full((10, 10), 0.75, dtype=np.float32)
    after = np.full((10, 10), 0.20, dtype=np.float32)
    diff, mask, thresh = compute_spectral_differencing(before, after)

    assert np.all(mask)
    severity = compute_severity_score(np.abs(diff), mask)
    assert severity["overall_severity"] in ["High", "Critical"]
    assert severity["score"] > 60


def test_deforestation_classifier():
    t1_ndvi = np.full((100, 100), 0.70, dtype=np.float32)
    t2_ndvi = np.full((100, 100), 0.70, dtype=np.float32)
    # 20% area deforested
    t2_ndvi[:20, :] = 0.15

    verdict = analyze_deforestation(t1_ndvi, t2_ndvi, pixel_area_ha=0.01)
    assert verdict["verdict"] == "CRITICAL_LOSS"
    assert verdict["lost_forest_hectares"] == 20.0
    assert verdict["loss_percentage"] == 20.0


def test_flood_classifier():
    t1_mndwi = np.full((50, 50), -0.3, dtype=np.float32)
    t2_mndwi = np.full((50, 50), -0.3, dtype=np.float32)
    # Inundate 1500 pixels
    t2_mndwi[:30, :] = 0.4

    verdict = analyze_flood_extent(t1_mndwi, t2_mndwi, pixel_area_ha=0.01)
    assert verdict["inundated_hectares"] == 15.0
    assert verdict["verdict"] in ["LOCAL_SURGE", "MASSIVE_INUNDATION"]
