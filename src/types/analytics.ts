import type { ApiMetadata, DashboardStatsApi, WeatherEfficiencyApi } from './api';

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

export const formatPercentageChange = (value: number): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};