"""
ReportLab PDF Generation Service
Creates professional, mission-control grade audit reports with telemetry summaries,
scientific metrics, weather attribution, and explainability limitations.
"""

import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def generate_analysis_pdf(analysis_data: Dict[str, Any]) -> bytes:
    """Renders a PDF report from analysis telemetry."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=6
    )
    subhead_style = ParagraphStyle(
        'SubHeadStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#475569"),
        spaceAfter=14
    )
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor("#334155"),
        leading=13
    )
    callout_style = ParagraphStyle(
        'CalloutStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderPadding=8,
        spaceAfter=10
    )

    story = []

    # Title & Metadata
    title = analysis_data.get("title", "Earth Observation Analysis Report")
    loc = analysis_data.get("location", "Selected Bounding Box")
    dates = analysis_data.get("dates", {})
    b_date = dates.get("before", "T1")
    a_date = dates.get("after", "T2")

    story.append(Paragraph("TERRAWATCH AI // EARTH OBSERVATION DOSSIER", header_style))
    story.append(Paragraph(f"<b>TARGET:</b> {title} | <b>LOCATION:</b> {loc} | <b>WINDOW:</b> {b_date} to {a_date}", subhead_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=12))

    # Executive Summary Card
    weather_attr = analysis_data.get("weather_attribution", {})
    rationale = weather_attr.get("scientific_rationale", "Automated spectral change detection complete.")
    story.append(Paragraph(f"<b>EXECUTIVE VERDICT:</b> {rationale}", callout_style))

    # Telemetry Table
    sev = analysis_data.get("severity", {})
    sev_level = sev.get("overall_severity", "Moderate")
    score = sev.get("score", 0.0)
    conf = int(analysis_data.get("confidence_score", 0.88) * 100)
    cloud = analysis_data.get("cloud_cover_percent", 3.0)

    telemetry_data = [
        ["METRIC", "MEASUREMENT", "EVALUATION CRITERIA"],
        ["Severity Classification", f"{sev_level} (Index: {score}/100)", "Multi-spectral change magnitude distribution"],
        ["Detection Confidence", f"{conf}% Confidence", "Signal-to-noise ratio post SCL cloud masking"],
        ["Cloud Contamination", f"{cloud}% Cloud Cover", "Scene Classification Layer (SCL) masked"],
        ["Attribution Verdict", weather_attr.get("attribution_verdict", "ANALYTIC"), "Correlated with Open-Meteo precipitation anomaly"]
    ]

    t = Table(telemetry_data, colWidths=[150, 160, 230])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e293b")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    # Module Verdicts
    story.append(Paragraph("DOMAIN VERDICTS & IMPACT QUANTIFICATION", section_title))
    modules = analysis_data.get("modules", {})

    deforest = modules.get("deforestation", {})
    crop = modules.get("crop_stress", {})
    flood = modules.get("flood_detection", {})
    land = modules.get("general_land_change", {})

    module_data = [
        ["MODULE", "IMPACT VERDICT", "QUANTIFIED SURFACE AREA"],
        ["Forest Canopy Loss", deforest.get("verdict", "N/A"), f"{deforest.get('lost_forest_hectares', 0)} ha lost ({deforest.get('loss_percentage', 0)}%)"],
        ["Crop Vegetative Health", crop.get("verdict", "N/A"), f"{crop.get('stressed_hectares', 0)} ha under physiological stress"],
        ["Hydrological Flood Extent", flood.get("verdict", "N/A"), f"{flood.get('inundated_hectares', 0)} ha newly inundated waterbody"],
        ["Surface Reclassification", land.get("dominant_transition", "N/A"), land.get("summary", "Stable")]
    ]

    t_mod = Table(module_data, colWidths=[140, 160, 240])
    t_mod.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#334155")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_mod)
    story.append(Spacer(1, 14))

    # Weather Correlation Section
    story.append(Paragraph("METEOROLOGICAL GROUND TRUTH CORRELATION", section_title))
    w_hist = analysis_data.get("weather_history", {})
    story.append(Paragraph(
        f"<b>Precipitation Profile:</b> Total {w_hist.get('total_precipitation_mm', 0)} mm recorded over {w_hist.get('days_analyzed', 0)} days. "
        f"Single-day peak downpour: {w_hist.get('max_single_day_rain_mm', 0)} mm. Mean temperature: {w_hist.get('mean_temperature_c', 0)} °C. "
        f"<i>Source: {w_hist.get('source', 'Open-Meteo Archive')}</i>",
        body_style
    ))
    story.append(Spacer(1, 12))

    # Honest Explainability & Limitations
    story.append(Paragraph("EXPLAINABILITY & SENSOR LIMITATIONS", section_title))
    limitation_text = (
        "<b>Sensor Specification:</b> Sentinel-2 MultiSpectral Instrument (MSI) provides 10m Ground Sample Distance (GSD) for visible & NIR bands. "
        "<b>Optical Constraint:</b> Optical sensing cannot penetrate dense cloud decks; automated Scene Classification (SCL) was applied to mask obscuration. "
        "<b>Co-registration:</b> Sub-pixel shift mitigated using OpenCV ECC translation matrix. "
        "<b>Legal Notice:</b> Area estimations are calibrated algorithmic indicators for rapid operational triage and require ground validation prior to legal enforcement."
    )
    story.append(Paragraph(limitation_text, body_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
