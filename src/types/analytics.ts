import type { ApiMetadata, DashboardStatsApi, AnalyticsTrendsApi, WeatherEfficiencyApi } from './api';

// Types pour toutes les réponses analytics

// Dashboard principal
export interface AnalyticsDashboard extends DashboardStatsApi {
  weather_summary?: {
    temperature: number;
    wind_speed: number;
    humidity: number;
    conditions: string;
  };
  recent_alerts?: Array<{
    type: 'weather' | 'performance' | 'system';
    priority: 'high' | 'medium' | 'low';
    message: string;
    timestamp: string;
  }>;
  quick_actions?: Array<{
    action: string;
    label: string;
    url: string;
    count?: number;
  }>;
}

// Évolution temporelle
export interface EvolutionData {
  evolution_mensuelle: Array<{
    mois: number | string;
    count: number;
    surface: number;
    efficiency?: number;
    year?: number;
  }>;
  comparaison_annuelle?: {
    current: number;
    previous: number;
    evolution_percentage: number;
  };
  seasonal_breakdown?: Record<string, {
    total_count: number;
    average_efficiency: number;
    peak_month: string;
  }>;
  metadata?: ApiMetadata;
}

// Distribution des statuts
export interface StatusDistribution {
  repartition: Record<string, {
    count: number;
    percentage: number;
    evolution?: number;
  }>;
  total_brulages: number;
  insights: Array<{
    statut: string;
    message: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  metadata?: ApiMetadata;
}

// Conditions météorologiques optimales
export interface AnalyticsConditions extends WeatherEfficiencyApi {
  optimal_ranges: {
    temperature: { min: number; max: number; optimal: number };
    humidity: { min: number; max: number; optimal: number };
    wind_speed: { min: number; max: number; optimal: number };
  };
  seasonal_patterns: Record<string, {
    best_conditions: string;
    success_rate: number;
    common_issues: string[];
  }>;
  weather_impact_analysis: {
    high_impact_factors: string[];
    correlation_scores: Record<string, number>;
    prediction_accuracy: number;
  };
  metadata?: ApiMetadata;
}

// Tendances étendues
export interface AnalyticsTrendsExtended extends AnalyticsTrendsApi {
  machine_learning_insights?: {
    pattern_detection: Array<{
      pattern_type: string;
      confidence: number;
      description: string;
    }>;
    anomaly_detection: Array<{
      date: string;
      anomaly_type: string;
      severity: 'low' | 'medium' | 'high';
      explanation: string;
    }>;
    feature_importance: Record<string, number>;
  };
  comparative_analysis?: {
    vs_national_average: number;
    vs_regional_average: number;
    ranking_position: number;
    benchmarking_insights: string[];
  };
}

// Prédictions avancées
export interface AnalyticsPredictions {
  predictions: {
    prediction: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    slope: number;
    prediction_interval: {
      lower_bound: number;
      upper_bound: number;
    };
  };
  weather_recommendations: Array<{
    parameter: 'temperature' | 'humidity' | 'wind_speed';
    optimal_value: number;
    current_deviation: number;
    impact_on_success: number;
    message: string;
  }>;
  risk_assessment: {
    overall_risk_level: 'low' | 'medium' | 'high';
    risk_factors: Array<{
      factor: string;
      impact_score: number;
      mitigation: string;
    }>;
    confidence_level: number;
  };
  scenario_analysis: Array<{
    scenario_name: string;
    probability: number;
    predicted_outcome: number;
    conditions: Record<string, any>;
  }>;
  confidence_level: number;
  metadata?: ApiMetadata;
}

// Données cartographiques analytiques
export interface AnalyticsMaps {
  geojson: {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      geometry: {
        type: 'Point';
        coordinates: [number, number];
      };
      properties: {
        id: number;
        nom: string;
        departement: string;
        population?: number;
        brulagesCount: number;
        efficiency: number;
        activity_level: 'high' | 'medium' | 'low' | 'none';
        risk_level: 'low' | 'medium' | 'high';
        last_activity?: string;
      };
    }>;
  };
  insights: {
    by_region: Array<{
      region: string;
      count: number;
      surface: number;
      avg_efficiency: number;
    }>;
    coverage: {
      total_communes: number;
      communes_actives: number;
      coverage_percentage: number;
    };
    hotspots: Array<{
      nom: string;
      coordinates: [number, number];
      activity_score: number;
      reason: string;
    }>;
    improvement_opportunities: Array<{
      commune: string;
      current_efficiency: number;
      potential_improvement: number;
      recommendations: string[];
    }>;
  };
  clustering_analysis?: {
    clusters: Array<{
      cluster_id: number;
      center: [number, number];
      communes: string[];
      characteristics: string[];
    }>;
    spatial_patterns: string[];
  };
  metadata?: ApiMetadata;
}

// Performance analytique
export interface AnalyticsPerformance {
  kpis: {
    brulages: { total: number; anneeEnCours: number; evolution: number };
    surface: { total: number; moyenne: number; evolution: number };
    reussite: { tauxMoyen: number; evolution: number; distribution: Record<string, number> };
    efficience: { score: number; benchmark: number; ranking: number };
  };
  trends: {
    evolution_mensuelle: Array<{
      mois: number;
      count: number;
      surface: number;
      efficiency: number;
      quality_score: number;
    }>;
    comparaison_annuelle: {
      current: number;
      previous: number;
      two_years_ago: number;
      trend_analysis: string;
    };
    performance_drivers: Array<{
      factor: string;
      impact: number;
      trend: 'positive' | 'negative' | 'neutral';
    }>;
  };
  benchmarking: {
    industry_standards: Record<string, number>;
    peer_comparison: Array<{
      metric: string;
      our_value: number;
      peer_average: number;
      ranking: number;
    }>;
    best_practices: string[];
  };
  optimization_opportunities: Array<{
    area: string;
    current_performance: number;
    potential_improvement: number;
    implementation_difficulty: 'low' | 'medium' | 'high';
    expected_timeline: string;
    priority_score: number;
  }>;
  metadata?: ApiMetadata;
}

// Résumé exécutif complet
export interface AnalyticsSummary {
  executive_summary: {
    kpis: {
      brulages: { total: number; anneeEnCours: number; evolution: number };
      surface: { total: number; moyenne: number };
      reussite: { tauxMoyen: number };
      efficiency_score: number;
    };
    key_trends: Array<{
      trend_type: string;
      description: string;
      impact: 'positive' | 'negative' | 'neutral';
      confidence: number;
    }>;
    predictions: {
      prediction: number;
      confidence: number;
      trend: string;
      timeline: string;
    };
    strategic_recommendations: Array<{
      category: 'operational' | 'strategic' | 'tactical';
      priority: 'critical' | 'high' | 'medium' | 'low';
      title: string;
      description: string;
      expected_impact: string;
      implementation_effort: 'low' | 'medium' | 'high';
    }>;
  };
  insights: {
    recommendations: Array<{
      type: 'operational' | 'strategic' | 'technical' | 'organizational';
      priority: 'critical' | 'high' | 'medium' | 'low';
      title: string;
      message: string;
      expected_benefit: string;
      implementation_steps?: string[];
    }>;
    alerts: Array<{
      type: 'performance' | 'operational' | 'quality' | 'system';
      priority: 'critical' | 'high' | 'medium' | 'low';
      title: string;
      message: string;
      threshold_exceeded?: boolean;
      recommended_action: string;
    }>;
    opportunities: Array<{
      type: 'growth' | 'efficiency' | 'quality' | 'innovation' | 'excellence';
      priority: 'high' | 'medium' | 'low';
      title: string;
      message: string;
      potential_impact: string;
      success_probability: number;
    }>;
  };
  risk_assessment: {
    overall_risk_level: 'low' | 'medium' | 'high' | 'critical';
    key_risks: Array<{
      risk_type: string;
      probability: number;
      impact: number;
      risk_score: number;
      mitigation_strategies: string[];
    }>;
    risk_evolution: 'improving' | 'stable' | 'deteriorating';
  };
  action_plan: {
    immediate_actions: string[];
    short_term_goals: string[];
    long_term_objectives: string[];
    resource_requirements: Array<{
      resource_type: string;
      quantity: string;
      timeline: string;
    }>;
  };
  metadata?: ApiMetadata;
}

// Types pour les graphiques et visualisations
export interface ChartDataPoint {
  name: string | number;
  value: number;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  category?: string;
  additionalMetrics?: Record<string, number>;
}

export interface PerformanceMatrix {
  dimensions: Array<{
    name: string;
    weight: number;
    current_score: number;
    target_score: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  overall_score: number;
  category: 'excellent' | 'good' | 'average' | 'poor';
  improvement_areas: string[];
}

// Configuration pour les seuils d'alerte
export interface AlertThresholds {
  success_rate: {
    critical: number;
    warning: number;
    target: number;
  };
  activity_level: {
    minimum: number;
    target: number;
    maximum: number;
  };
  efficiency: {
    poor: number;
    average: number;
    good: number;
    excellent: number;
  };
}

// Export des constantes
export const DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
  success_rate: {
    critical: 50,
    warning: 70,
    target: 85
  },
  activity_level: {
    minimum: 10,
    target: 50,
    maximum: 200
  },
  efficiency: {
    poor: 60,
    average: 75,
    good: 85,
    excellent: 95
  }
};

// Helpers pour les calculs analytiques
export const calculateTrend = (current: number, previous: number): {
  percentage: number;
  direction: 'up' | 'down' | 'stable';
  classification: 'strong' | 'moderate' | 'weak';
} => {
  const percentage = ((current - previous) / previous) * 100;
  const direction = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable';
  const absPercentage = Math.abs(percentage);
  const classification = absPercentage > 10 ? 'strong' : absPercentage > 3 ? 'moderate' : 'weak';
  
  return { percentage, direction, classification };
};

export const getPerformanceColor = (value: number, thresholds: { poor: number; average: number; good: number; excellent: number }): string => {
  if (value >= thresholds.excellent) return '#22c55e'; // green
  if (value >= thresholds.good) return '#3b82f6'; // blue
  if (value >= thresholds.average) return '#eab308'; // yellow
  return '#ef4444'; // red
};

export const formatPercentageChange = (value: number): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};