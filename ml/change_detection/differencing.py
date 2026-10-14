"""
Change Detection Module
Normalized Differencing, Adaptive Otsu Thresholding, and Severity Scoring.
"""

from typing import Dict, Any, Tuple
import numpy as np
from skimage.filters import threshold_otsu


def compute_spectral_differencing(
    before_index: np.ndarray,
    after_index: np.ndarray,
    valid_mask: np.ndarray | None = None
) -> Tuple[np.ndarray, np.ndarray, float]:
    """
    Computes delta = after - before.
    Applies adaptive Otsu thresholding on absolute difference to segment significant change.
    """
    diff = after_index - before_index
    abs_diff = np.abs(diff)

    if valid_mask is not None:
        valid_pixels = abs_diff[valid_mask & ~np.isnan(abs_diff)]
    else:
        valid_pixels = abs_diff[~np.isnan(abs_diff)]

    if len(valid_pixels) > 50 and np.ptp(valid_pixels) > 1e-4:
        try:
            threshold = float(threshold_otsu(valid_pixels))
        except Exception:
            threshold = 0.20
    else:
        threshold = 0.20

    # Ensure reasonable threshold bounds for vegetation/water indices
    threshold = float(np.clip(threshold, 0.12, 0.35))
    change_mask = abs_diff > threshold

    if valid_mask is not None:
        change_mask = change_mask & valid_mask

    return diff, change_mask, threshold


def compute_severity_score(
    change_magnitude: np.ndarray,
    change_mask: np.ndarray
) -> Dict[str, Any]:
    """
    Computes normalized severity distribution:
    Low, Medium, High, Critical
    """
    changed_mags = change_magnitude[change_mask & ~np.isnan(change_magnitude)]

    if len(changed_mags) == 0:
        return {
            "overall_severity": "Low",
            "score": 0.0,
            "distribution": {"low": 0, "medium": 0, "high": 0, "critical": 0}
        }

    # Severity tiers based on spectral index change magnitude
    low_cnt = int(np.sum((changed_mags >= 0.10) & (changed_mags < 0.25)))
    med_cnt = int(np.sum((changed_mags >= 0.25) & (changed_mags < 0.45)))
    high_cnt = int(np.sum((changed_mags >= 0.45) & (changed_mags < 0.65)))
    crit_cnt = int(np.sum(changed_mags >= 0.65))

    total = len(changed_mags)
    avg_score = float(np.mean(changed_mags))
    # Normalized score 0 - 100
    normalized_score = round(min(avg_score * 100 / 0.8, 100.0), 1)

    if normalized_score >= 75 or crit_cnt / total > 0.3:
        overall = "Critical"
    elif normalized_score >= 50 or high_cnt / total > 0.3:
        overall = "High"
    elif normalized_score >= 25 or med_cnt / total > 0.4:
        overall = "Medium"
    else:
        overall = "Low"

    return {
        "overall_severity": overall,
        "score": normalized_score,
        "distribution": {
            "low": round(low_cnt / total * 100, 1),
            "medium": round(med_cnt / total * 100, 1),
            "high": round(high_cnt / total * 100, 1),
            "critical": round(crit_cnt / total * 100, 1)
        }
    }
