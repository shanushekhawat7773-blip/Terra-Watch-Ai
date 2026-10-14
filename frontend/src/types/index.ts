export interface FloodFlowImpact {
  source_river: string;
  flow_direction: string; // e.g. "North-East to South-West (Downstream Beas Gorge)"
  peak_discharge_cusecs: string;
  surge_height_meters: number;
  flow_path: [number, number][]; // Line coordinates along the river channel
  affected_zones: {
    id: string;
    name: string;
    coordinates: [number, number];
    status: 'SUBMERGED' | 'SEVERE_DAMAGE' | 'THREATENED';
    type: 'HIGHWAY' | 'BRIDGE' | 'SETTLEMENT' | 'CAMPUS_ROAD';
    impact_description: string;
  }[];
  water_extent_polygon: [number, number][];
}

export interface ScenarioSummary {
  id: string;
  title: string;
  location: string;
  coordinates: {
    lat: number;
    lon: number;
    zoom: number;
  };
  primary_module: 'flood_detection' | 'deforestation' | 'crop_stress' | 'general_land_change';
  dates: {
    before: string;
    after: string;
  };
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  context_note: string;
}

export interface ModuleVerdict {
  module: string;
  verdict: string;
  summary: string;
  [key: string]: any;
}

export interface WeatherTimeSeries {
  date: string;
  precipitation_mm: number;
  temperature_c: number;
  soil_moisture: number;
}

export interface WeatherAttribution {
  attribution_verdict: string;
  confidence_score: number;
  scientific_rationale: string;
  weather_indicators: {
    total_precipitation_mm: number;
    max_daily_rain_mm: number;
    climate_source: string;
  };
}

export interface AnalysisDetail {
  id: string;
  title: string;
  location: string;
  coordinates: {
    lat: number;
    lon: number;
    zoom: number;
  };
  bbox: [number, number, number, number];
  dates: {
    before: string;
    after: string;
  };
  primary_module: string;
  context_note: string;
  cloud_cover_percent: number;
  confidence_score: number;
  severity: {
    overall_severity: 'Low' | 'Medium' | 'High' | 'Critical';
    score: number;
    distribution: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  };
  cva_stats: {
    mean_magnitude: number;
    max_magnitude: number;
    dominant_vector_degrees: number;
  };
  modules: {
    deforestation: ModuleVerdict;
    crop_stress: ModuleVerdict;
    flood_detection: ModuleVerdict;
    general_land_change: ModuleVerdict;
  };
  weather_attribution: WeatherAttribution;
  weather_history: {
    source: string;
    total_precipitation_mm: number;
    mean_temperature_c: number;
    max_single_day_rain_mm: number;
    days_analyzed: number;
    time_series: WeatherTimeSeries[];
  };
  time_series_12m: {
    month: string;
    ndvi: number;
    is_event_period: boolean;
  }[];
  heatmap: {
    width: number;
    height: number;
    grid: number[][];
    before_grid: number[][];
    after_grid: number[][];
  };
  flood_impact?: FloodFlowImpact;
}

export interface AlertItem {
  id: string;
  scenario_id: string;
  title: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  date: string;
  summary: string;
  attribution: string;
}
