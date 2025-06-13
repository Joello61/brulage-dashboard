import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Thermometer, Wind, Droplets, AlertTriangle } from 'lucide-react';

interface WeatherData {
  periode: string;
  temperature: number;
  vent: number;
  humidite: number;
  visibilite?: string;
  brulagesReussis?: number;
  conditions?: 'favorable' | 'moderate' | 'defavorable';
}

interface WeatherChartProps {
  data: WeatherData[];
  type?: 'line' | 'composed' | 'radar';
  title?: string;
  description?: string;
  showBrulages?: boolean;
  height?: number;
}

export function WeatherChart({ 
  data, 
  type = 'composed',
  title = 'Conditions météorologiques',
  description = 'Évolution des conditions météo',
  showBrulages = false,
  height = 300 
}: WeatherChartProps) {
  const avgTemp = (data.reduce((sum, item) => sum + item.temperature, 0) / data.length).toFixed(1);
  const avgWind = (data.reduce((sum, item) => sum + item.vent, 0) / data.length).toFixed(1);
  const avgHumidity = (data.reduce((sum, item) => sum + item.humidite, 0) / data.length).toFixed(1);

  if (type === 'radar') {
    const radarData = [
      { parameter: 'Température', valeur: parseFloat(avgTemp), optimal: 20 },
      { parameter: 'Vent', valeur: parseFloat(avgWind), optimal: 10 },
      { parameter: 'Humidité', valeur: parseFloat(avgHumidity), optimal: 50 }
    ];

    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            {title}
          </CardTitle>
          <p className="text-sm text-gray-600">{description}</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="parameter" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar 
                name="Valeur actuelle" 
                dataKey="valeur" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.3} 
                strokeWidth={2}
              />
              <Radar 
                name="Valeur optimale" 
                dataKey="optimal" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.1} 
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (type === 'line') {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                {title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <div className="text-right text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-red-500" />
                  <span>Moy: {avgTemp}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-3 w-3 text-blue-500" />
                  <span>Moy: {avgWind} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="periode" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Température (°C)"
              />
              <Line 
                type="monotone" 
                dataKey="vent" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Vent (km/h)"
              />
              <Line 
                type="monotone" 
                dataKey="humidite" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                name="Humidité (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-red-100 text-red-700 text-xs">
              <Thermometer className="h-3 w-3 mr-1" />
              {avgTemp}°C
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 text-xs">
              <Wind className="h-3 w-3 mr-1" />
              {avgWind} km/h
            </Badge>
            <Badge className="bg-cyan-100 text-cyan-700 text-xs">
              <Droplets className="h-3 w-3 mr-1" />
              {avgHumidity}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="periode" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
            {showBrulages && (
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
            )}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            
            {showBrulages && (
              <Bar 
                yAxisId="right" 
                dataKey="brulagesReussis" 
                fill="#22c55e" 
                name="Brûlages réussis"
                opacity={0.7}
              />
            )}
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Température (°C)"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="vent" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Vent (km/h)"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="humidite" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              name="Humidité (%)"
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Alertes météo */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.slice(-1).map((latest, index) => (
            <div key={index} className="space-y-2">
              {latest.temperature > 30 && (
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-red-700 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Température élevée</span>
                </div>
              )}
              {latest.vent > 25 && (
                <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg text-orange-700 text-xs">
                  <Wind className="h-3 w-3" />
                  <span>Vent fort</span>
                </div>
              )}
              {latest.humidite < 30 && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg text-yellow-700 text-xs">
                  <Droplets className="h-3 w-3" />
                  <span>Humidité faible</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}