import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MapPin } from 'lucide-react';

interface CommuneData {
  commune: string;
  nombre: number;
  surface: number;
  population?: number;
  efficacite?: number;
}

interface CommuneChartProps {
  data: CommuneData[];
  type?: 'bar' | 'pie';
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
}

const chartColors = ['#f97316', '#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export function CommuneChart({ 
  data, 
  type = 'bar', 
  title = 'Répartition par commune',
  description = 'Nombre de brûlages par commune',
  showLegend = true,
  height = 300 
}: CommuneChartProps) {
  const totalBrulages = data.reduce((sum, item) => sum + item.nombre, 0);
  const topCommune = data.sort((a, b) => b.nombre - a.nombre)[0];

  if (type === 'pie') {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                {title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <Badge variant="outline">{totalBrulages} total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="nombre"
                nameKey="commune"
                label={({ commune, nombre, percent }) => 
                  `${commune}: ${nombre} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              {showLegend && <Legend />}
              <Tooltip />
            </PieChart>
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
              <MapPin className="h-5 w-5 text-blue-500" />
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="text-right">
            <Badge variant="outline">{totalBrulages} total</Badge>
            {topCommune && (
              <p className="text-xs text-gray-500 mt-1">
                Leader: {topCommune.commune} ({topCommune.nombre})
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="commune" 
              stroke="#64748b" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
              formatter={(value, name) => [value, name === 'nombre' ? 'Brûlages' : 'Surface (ha)']}
            />
            <Bar 
              dataKey="nombre" 
              fill="#f97316" 
              radius={[4, 4, 0, 0]}
              name="Brûlages"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}