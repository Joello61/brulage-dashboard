import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Activity, CheckCircle, Clock, PauseCircle, XCircle } from 'lucide-react';

interface StatusData {
  statut: string;
  nombre: number;
  couleur: string;
  pourcentage?: number;
}

interface StatusChartProps {
  data: StatusData[];
  type?: 'pie' | 'bar';
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
}

const statusIcons = {
  'En cours': Activity,
  'Terminé': CheckCircle,
  'Planifié': Clock,
  'Suspendu': PauseCircle,
  'Annulé': XCircle
};

export function StatusChart({ 
  data, 
  type = 'pie',
  title = 'Répartition par statut',
  description = 'Distribution des brûlages par état',
  showLegend = true,
  height = 300 
}: StatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.nombre, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    pourcentage: ((item.nombre / total) * 100).toFixed(1)
  }));

  if (type === 'bar') {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            {title}
          </CardTitle>
          <p className="text-sm text-gray-600">{description}</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={dataWithPercentage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="statut" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                formatter={(value, _name) => [value, 'Nombre']}
              />
              <Bar dataKey="nombre" radius={[4, 4, 0, 0]}>
                {dataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.couleur} />
                ))}
              </Bar>
            </BarChart>
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
              <Activity className="h-5 w-5 text-orange-500" />
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <Badge variant="outline">{total} total</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={dataWithPercentage}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                dataKey="nombre"
                nameKey="statut"
              >
                {dataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.couleur} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} brûlages`, name]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          
          {showLegend && (
            <div className="space-y-3">
              {dataWithPercentage.map((item, index) => {
                const Icon = statusIcons[item.statut as keyof typeof statusIcons] || Activity;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.couleur }}
                      />
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-700">{item.statut}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{item.nombre}</div>
                      <div className="text-xs text-gray-500">{item.pourcentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}