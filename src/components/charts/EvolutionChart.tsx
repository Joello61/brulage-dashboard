import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface EvolutionData {
  periode: string;
  nombre: number;
  surface?: number;
  efficacite?: number;
  planifies?: number;
  realises?: number;
}

interface EvolutionChartProps {
  data: EvolutionData[];
  type?: 'line' | 'area';
  title?: string;
  description?: string;
  showSurface?: boolean;
  showEfficacite?: boolean;
  height?: number;
}

export function EvolutionChart({ 
  data, 
  type = 'area',
  title = 'Évolution temporelle',
  description = 'Nombre de brûlages dans le temps',
  showSurface = false,
  showEfficacite = false,
  height = 300 
}: EvolutionChartProps) {
  const totalBrulages = data.reduce((sum, item) => sum + item.nombre, 0);
  const lastPeriod = data[data.length - 1];
  const previousPeriod = data[data.length - 2];
  const trend = previousPeriod ? 
    ((lastPeriod.nombre - previousPeriod.nombre) / previousPeriod.nombre * 100).toFixed(1) : 0;

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="text-right space-y-1">
            <Badge variant="outline">{totalBrulages} total</Badge>
            {trend !== 0 && (
              <Badge className={`text-xs ${parseFloat(trend) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {parseFloat(trend) > 0 ? '↗' : '↘'} {Math.abs(parseFloat(trend))}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            {type === 'area' && (
              <defs>
                <linearGradient id="nombreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.05}/>
                </linearGradient>
                {showSurface && (
                  <linearGradient id="surfaceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                )}
              </defs>
            )}
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="periode" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            {(showSurface || showEfficacite) && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
            )}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontSize: '14px'
              }} 
            />
            <Legend />
            
            {type === 'area' ? (
              <>
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="nombre" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fill="url(#nombreGradient)"
                  name="Brûlages"
                />
                {showSurface && (
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="surface" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#surfaceGradient)"
                    name="Surface (ha)"
                  />
                )}
              </>
            ) : (
              <>
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="nombre" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#f97316', strokeWidth: 2 }}
                  name="Brûlages"
                />
                {showSurface && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="surface" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Surface (ha)"
                  />
                )}
                {showEfficacite && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="efficacite" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    name="Efficacité (%)"
                  />
                )}
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}