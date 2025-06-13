import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Oups ! Une erreur s'est produite
              </h2>
              <p className="text-gray-600 mb-6">
                L'application a rencontré un problème inattendu. Nos équipes ont été notifiées.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="gradient-fire text-white w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recharger la page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}