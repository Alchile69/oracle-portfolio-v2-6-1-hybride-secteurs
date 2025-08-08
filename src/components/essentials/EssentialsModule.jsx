import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Activity, 
  TestTube, 
  Brain, 
  FileText, 
  Play, 
  Pause, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  Cpu,
  HardDrive
} from 'lucide-react';

const EssentialsModule = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [monitoringData, setMonitoringData] = useState({
    responseTime: 245,
    errorRate: 0.12,
    cpuUsage: 34,
    memoryUsage: 67,
    uptime: 99.8,
    status: 'healthy'
  });
  const [testResults, setTestResults] = useState([]);
  const [autoImprovements, setAutoImprovements] = useState([]);
  const [reports, setReports] = useState([]);

  // Simulation des données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setMonitoringData(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 100) + 200,
        errorRate: Math.random() * 0.5,
        cpuUsage: Math.floor(Math.random() * 40) + 20,
        memoryUsage: Math.floor(Math.random() * 30) + 50,
        uptime: 99.5 + Math.random() * 0.5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Initialisation des données
  useEffect(() => {
    // Tests automatisés
    setTestResults([
      {
        id: 1,
        name: 'Test Performance API',
        status: 'passed',
        duration: '2.3s',
        lastRun: new Date(),
        score: 95
      },
      {
        id: 2,
        name: 'Test Load Balancing',
        status: 'passed',
        duration: '1.8s',
        lastRun: new Date(),
        score: 88
      },
      {
        id: 3,
        name: 'Test Database Query',
        status: 'warning',
        duration: '4.1s',
        lastRun: new Date(),
        score: 72
      },
      {
        id: 4,
        name: 'Test Failover',
        status: 'passed',
        duration: '3.2s',
        lastRun: new Date(),
        score: 91
      }
    ]);

    // Auto-améliorations
    setAutoImprovements([
      {
        id: 1,
        type: 'optimization',
        title: 'Optimisation allocation Technologies',
        description: 'Augmentation recommandée de 2.5% basée sur performance',
        impact: 'high',
        status: 'pending',
        confidence: 87
      },
      {
        id: 2,
        type: 'rebalancing',
        title: 'Rééquilibrage secteur Finance',
        description: 'Réduction de 1.8% pour optimiser le ratio risque/rendement',
        impact: 'medium',
        status: 'applied',
        confidence: 92
      },
      {
        id: 3,
        type: 'alert',
        title: 'Surveillance secteur Énergie',
        description: 'Volatilité élevée détectée, surveillance renforcée',
        impact: 'low',
        status: 'monitoring',
        confidence: 78
      }
    ]);

    // Rapports
    setReports([
      {
        id: 1,
        title: 'Rapport Quotidien',
        type: 'daily',
        date: new Date(),
        status: 'generated',
        metrics: {
          performance: '+2.3%',
          risk: '34/100',
          diversification: '87/100'
        }
      },
      {
        id: 2,
        title: 'Rapport Hebdomadaire',
        type: 'weekly',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'sent',
        metrics: {
          performance: '+8.7%',
          risk: '31/100',
          diversification: '89/100'
        }
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'passed': 'bg-green-100 text-green-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
      'pending': 'bg-blue-100 text-blue-800',
      'applied': 'bg-green-100 text-green-800',
      'monitoring': 'bg-orange-100 text-orange-800',
      'generated': 'bg-blue-100 text-blue-800',
      'sent': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
      case 'applied':
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
      case 'monitoring':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Modules Essentiels</h2>
          <p className="text-muted-foreground">
            Monitoring, Tests, Auto-amélioration et Rapports automatiques
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          ROI: 1,464% - 4,100%
        </Badge>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">
            <Activity className="h-4 w-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="tests">
            <TestTube className="h-4 w-4 mr-2" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="improvement">
            <Brain className="h-4 w-4 mr-2" />
            Auto-amélioration
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Rapports
          </TabsTrigger>
        </TabsList>

        {/* Monitoring */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monitoringData.responseTime}ms</div>
                <p className="text-xs text-muted-foreground">
                  {monitoringData.responseTime < 300 ? 'Excellent' : 'Acceptable'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux d'Erreur</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monitoringData.errorRate.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  {monitoringData.errorRate < 0.5 ? 'Optimal' : 'À surveiller'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monitoringData.uptime.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Disponibilité système
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Utilisation CPU</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{monitoringData.cpuUsage}%</span>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${monitoringData.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilisation Mémoire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{monitoringData.memoryUsage}%</span>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${monitoringData.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tests */}
        <TabsContent value="tests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tests Automatisés</h3>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Relancer Tests
            </Button>
          </div>

          <div className="grid gap-4">
            {testResults.map((test) => (
              <Card key={test.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-semibold">{test.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Durée: {test.duration} • Score: {test.score}/100
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Auto-amélioration */}
        <TabsContent value="improvement" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recommandations Intelligentes</h3>
            <Badge className="bg-blue-100 text-blue-800">
              IA Active
            </Badge>
          </div>

          <div className="grid gap-4">
            {autoImprovements.map((improvement) => (
              <Card key={improvement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{improvement.title}</h4>
                        <Badge className={getStatusColor(improvement.status)}>
                          {improvement.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {improvement.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">
                          Impact: <span className="font-medium">{improvement.impact}</span>
                        </span>
                        <span className="text-sm">
                          Confiance: <span className="font-medium">{improvement.confidence}%</span>
                        </span>
                      </div>
                    </div>
                    {improvement.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Appliquer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rapports */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Rapports Automatiques</h3>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Générer Rapport
            </Button>
          </div>

          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{report.title}</h4>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {report.date.toLocaleDateString('fr-FR')}
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {report.metrics.performance}
                          </div>
                          <div className="text-xs text-muted-foreground">Performance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {report.metrics.risk}
                          </div>
                          <div className="text-xs text-muted-foreground">Risque</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {report.metrics.diversification}
                          </div>
                          <div className="text-xs text-muted-foreground">Diversification</div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EssentialsModule;

