import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

const AnalyticsModule = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-[#cccccc]">Advanced analytics and reporting tools</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#00d4ff]" />
          <span className="text-sm text-[#cccccc]">Real-time</span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Performance Metrics */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-[#00d4ff]" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Total Return</span>
                <span className="text-[#00ff88] font-bold">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Sharpe Ratio</span>
                <span className="text-white font-bold">1.85</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Volatility</span>
                <span className="text-[#ffa502] font-bold">8.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-[#00d4ff]" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">VaR (95%)</span>
                <span className="text-[#ff4757] font-bold">-2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Max Drawdown</span>
                <span className="text-[#ff4757] font-bold">-8.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Beta</span>
                <span className="text-white font-bold">0.92</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Allocation */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-[#00d4ff]" />
              Sector Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Technology</span>
                <span className="text-white font-bold">35%</span>
              </div>
              <div className="w-full bg-[#2a2a3e] rounded-full h-2">
                <div className="bg-[#00d4ff] h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Healthcare</span>
                <span className="text-white font-bold">25%</span>
              </div>
              <div className="w-full bg-[#2a2a3e] rounded-full h-2">
                <div className="bg-[#00ff88] h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Financial</span>
                <span className="text-white font-bold">20%</span>
              </div>
              <div className="w-full bg-[#2a2a3e] rounded-full h-2">
                <div className="bg-[#ffa502] h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Correlation */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-[#00d4ff]" />
              Market Correlation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">S&P 500</span>
                <span className="text-white font-bold">0.89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">NASDAQ</span>
                <span className="text-white font-bold">0.92</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Bonds</span>
                <span className="text-[#ff4757] font-bold">-0.15</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Activity */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-[#00d4ff]" />
              Trading Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Trades Today</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Avg Trade Size</span>
                <span className="text-white font-bold">$2,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Success Rate</span>
                <span className="text-[#00ff88] font-bold">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Economic Indicators */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-[#00d4ff]" />
              Economic Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">GDP Growth</span>
                <span className="text-[#00ff88] font-bold">+2.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Inflation</span>
                <span className="text-[#ffa502] font-bold">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Unemployment</span>
                <span className="text-[#00ff88] font-bold">4.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Message */}
      <Card className="bg-[#1a1a2e] border-[#2a2a3e]">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <BarChart3 className="h-12 w-12 text-[#00d4ff] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics</h3>
            <p className="text-[#cccccc]">
              Advanced analytics and reporting tools coming soon...
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <span className="px-3 py-1 bg-[#00d4ff] text-black rounded-full text-sm font-medium">
              Machine Learning
            </span>
            <span className="px-3 py-1 bg-[#00ff88] text-black rounded-full text-sm font-medium">
              Predictive Models
            </span>
            <span className="px-3 py-1 bg-[#ffa502] text-black rounded-full text-sm font-medium">
              Risk Scoring
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsModule;
