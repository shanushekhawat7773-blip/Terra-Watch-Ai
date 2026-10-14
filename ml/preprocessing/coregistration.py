"""
Satellite Image Co-registration
Aligns multitemporal satellite tiles using Enhanced Correlation Coefficient (ECC)
or ORB feature matching to prevent false change signals from spatial shifts.
"""

import cv2
import numpy as np


def coregister_images(
    ref_image: np.ndarray,
    target_image: np.ndarray,
    method: str = "ecc"
) -> np.ndarray:
    """
    Warps target_image to align precisely with ref_image coordinate grid.
    ref_image and target_image should be 2D single-band float32 or uint8 arrays.
    """
    # Normalize to uint8 for robust alignment
    def to_u8(img: np.ndarray) -> np.ndarray:
        valid = img[~np.isnan(img)]
        if len(valid) == 0:
            return np.zeros(img.shape, dtype=np.uint8)
        p2, p98 = np.percentile(valid, (2, 98))
        norm = np.clip((img - p2) / (p98 - p2 + 1e-7), 0, 1)
        return (norm * 255).astype(np.uint8)

    im1_gray = to_u8(ref_image)
    im2_gray = to_u8(target_image)

    h, w = ref_image.shape

    if method == "ecc":
        warp_matrix = np.eye(2, 3, dtype=np.float32)
        criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 50, 1e-5)
        try:
            _, warp_matrix = cv2.findTransformECC(
                im1_gray, im2_gray, warp_matrix, cv2.MOTION_TRANSLATION, criteria
            )
            aligned = cv2.warpAffine(
                target_image, warp_matrix, (w, h), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP
            )
            return aligned
        except cv2.error:
            # If ECC fails to converge (e.g., massive land cover difference), fallback to identity
            return target_image
    else:
        # ORB Feature based alignment fallback
        orb = cv2.ORB_create(500)
        kp1, des1 = orb.detectAndCompute(im1_gray, None)
        kp2, des2 = orb.detectAndCompute(im2_gray, None)

        if des1 is None or des2 is None:
            return target_image

        matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = matcher.match(des1, des2)
        matches = sorted(matches, key=lambda x: x.distance)

        if len(matches) < 4:
            return target_image

        src_pts = np.float32([kp1[m.queryIdx].pt for m in matches]).reshape(-1, 1, 2)
        dst_pts = np.float32([kp2[m.trainIdx].pt for m in matches]).reshape(-1, 1, 2)

        M, _ = cv2.estimateAffinePartial2D(dst_pts, src_pts)
        if M is None:
            return target_image

        aligned = cv2.warpAffine(target_image, M, (w, h))
        return aligned
