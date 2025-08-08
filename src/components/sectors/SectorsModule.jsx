import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus, Building2, PieChart, Table } from 'lucide-react';
import { useSectorData } from '../../hooks/useSectorData';
import AllocationChart from './AllocationChart';
import SectorTable from './SectorTable';

const SectorsModule = () => {
  const { sectors, loading, error, stats } = useSectorData();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des secteurs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erreur lors du chargement des secteurs: {error}</p>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{stats?.averagePerformance?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Sur les 12 derniers mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risque Moyen</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.averageRisk?.toFixed(0) || '0'}/100
            </div>
            <p className="text-xs text-muted-foreground">
              Score de risque pondéré
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diversification</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.diversificationScore?.toFixed(0) || '0'}/100
            </div>
            <p className="text-xs text-muted-foreground">
              Indice Herfindahl-Hirschman
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secteurs Actifs</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {sectors?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Secteurs d'activité
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="chart">Graphique</TabsTrigger>
          <TabsTrigger value="table">Tableau</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors?.map((sector) => (
              <Card key={sector.metadata.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{sector.metadata.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{sector.metadata.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {sector.metadata.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getGradeColor(sector.grade)}>
                      {sector.grade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Allocation</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{sector.metrics.allocation.toFixed(1)}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${sector.metrics.allocation}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Performance</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(sector.metrics.trend)}
                        <span className={`font-semibold ${
                          sector.metrics.performance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sector.metrics.performance >= 0 ? '+' : ''}{sector.metrics.performance.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Risque</span>
                      <span className={`font-semibold ${
                        sector.metrics.riskScore <= 30 ? 'text-green-600' :
                        sector.metrics.riskScore <= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {sector.metrics.riskScore.toFixed(0)}/100
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Confiance</span>
                      <span className="font-semibold text-blue-600">
                        {sector.metrics.confidence.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allocation Sectorielle</CardTitle>
              <CardDescription>
                Répartition du portefeuille par secteur d'activité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllocationChart sectors={sectors} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée</CardTitle>
              <CardDescription>
                Tableau complet avec toutes les métriques sectorielles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectorTable sectors={sectors} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SectorsModule;

