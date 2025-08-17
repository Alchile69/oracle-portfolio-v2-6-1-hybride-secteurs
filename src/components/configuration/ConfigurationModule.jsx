import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Settings, Shield, Bell, Database, Globe } from 'lucide-react';

const ConfigurationModule = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Configuration Panel</h2>
          <p className="text-[#cccccc]">Manage monitoring settings, alerts, and system parameters</p>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#00d4ff]" />
          <span className="text-sm text-[#cccccc]">Settings</span>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* System Settings */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5 text-[#00d4ff]" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Auto Refresh</span>
                <span className="text-[#00ff88] font-bold">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Refresh Interval</span>
                <span className="text-white font-bold">30s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Data Retention</span>
                <span className="text-white font-bold">90 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-[#00d4ff]" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">2FA</span>
                <span className="text-[#00ff88] font-bold">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Session Timeout</span>
                <span className="text-white font-bold">8h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">API Rate Limit</span>
                <span className="text-white font-bold">1000/min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-[#00d4ff]" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Email Alerts</span>
                <span className="text-[#00ff88] font-bold">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Push Notifications</span>
                <span className="text-[#ff4757] font-bold">Disabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Alert Threshold</span>
                <span className="text-white font-bold">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5 text-[#00d4ff]" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">FRED API</span>
                <span className="text-[#00ff88] font-bold">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Alpha Vantage</span>
                <span className="text-[#00ff88] font-bold">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Yahoo Finance</span>
                <span className="text-[#00ff88] font-bold">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5 text-[#00d4ff]" />
              Regional Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Default Country</span>
                <span className="text-white font-bold">France</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Currency</span>
                <span className="text-white font-bold">EUR</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Timezone</span>
                <span className="text-white font-bold">Europe/Paris</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Settings */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5 text-[#00d4ff]" />
              Performance Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Cache Enabled</span>
                <span className="text-[#00ff88] font-bold">Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Cache TTL</span>
                <span className="text-white font-bold">5min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cccccc]">Compression</span>
                <span className="text-[#00ff88] font-bold">Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Configuration */}
      <Card className="bg-[#1a1a2e] border-[#2a2a3e]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5 text-[#00d4ff]" />
            Advanced Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* API Configuration */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">API Configuration</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-[#0f0f23] rounded-lg">
                  <span className="text-[#cccccc]">Backend URL</span>
                  <span className="text-white font-mono text-sm">oracle-backend-yrvjzoj3aa-uc.a.run.app</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#0f0f23] rounded-lg">
                  <span className="text-[#cccccc]">API Version</span>
                  <span className="text-white font-bold">v2.7.0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#0f0f23] rounded-lg">
                  <span className="text-[#cccccc]">Status</span>
                  <span className="text-[#00ff88] font-bold">Online</span>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">System Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-[#0f0f23] rounded-lg">
                  <span className="text-[#cccccc]">Frontend Version</span>
                  <span className="text-white font-bold">v3.0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#0f0f23] rounded-lg">
                  <span className="text-[#cccccc]">Build Date</span>
                  <span className="text-white font-bold">2025-08-17</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#0f0f23] rounded-lg">
                  <span className="text-[#cccccc]">Environment</span>
                  <span className="text-[#00d4ff] font-bold">Production</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 bg-[#2a2a3e] text-white rounded-lg hover:bg-[#3a3a4e] transition-colors duration-300">
          Reset to Defaults
        </button>
        <button className="px-6 py-2 bg-[#00d4ff] text-black rounded-lg hover:bg-[#00b8e6] transition-colors duration-300 font-medium">
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default ConfigurationModule;
