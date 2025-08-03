import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Square, RotateCcw, Download, Settings, Bell, AlertCircle, CheckCircle, Monitor, RefreshCw } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warning" | "error" | "success";
  message: string;
  source?: string;
}

export default function LivePreview() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'log') {
        const newLog: LogEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          level: data.level || 'info',
          message: data.message,
          source: data.source
        };
        setLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
      }
    }
  });

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    sendMessage({ type: 'start_execution', crewId: selectedCrew });
  };

  const handlePause = () => {
    setIsPaused(true);
    sendMessage({ type: 'pause_execution' });
  };

  const handleResume = () => {
    setIsPaused(false);
    sendMessage({ type: 'resume_execution' });
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    sendMessage({ type: 'stop_execution' });
  };

  const handleClear = () => {
    setLogs([]);
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-500";
      case "warning": return "text-yellow-500";
      case "success": return "text-green-500";
      default: return "text-slate-600 dark:text-slate-400";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Live Preview</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Monitor real-time execution logs and crew activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Notifications Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  API usage approaching daily limit
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  30 minutes ago
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Template Created
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  New workflow template "Data Analysis" created
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  about 1 hour ago
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Crew Updated
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Research Crew configuration updated
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  about 2 hours ago • Research Crew
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Execution Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!isRunning ? (
                <Button onClick={handleStart} className="bg-success hover:bg-success/90">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : isPaused ? (
                <Button onClick={handleResume} variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button onClick={handlePause} variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button onClick={handleStop} variant="outline" disabled={!isRunning}>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button onClick={handleClear} variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Logs
              </Button>
              
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-slate-600 dark:text-slate-400">Live</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400">
                {logs.length} entries
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Viewer */}
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="text-lg">Execution Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[420px] px-6">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                  No active preview session
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                  Start a crew to see live execution logs
                </p>
                <div className="flex items-center space-x-3">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Play className="w-4 h-4 mr-2" />
                    Start Preview Session
                  </Button>
                  <Button variant="outline">
                    Use Suggestion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 text-sm border-l-2 border-slate-200 dark:border-slate-700 pl-3 py-1">
                    <span className="text-xs text-slate-400 font-mono min-w-[60px]">
                      {formatTime(log.timestamp)}
                    </span>
                    <Badge 
                      variant={log.level === 'error' ? 'destructive' : 'secondary'} 
                      className="text-xs min-w-[60px] justify-center"
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                    {log.source && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 min-w-[80px]">
                        [{log.source}]
                      </span>
                    )}
                    <span className={getLogColor(log.level)}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Live Preview Window */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Preview</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Connected</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-8 border-2 border-dashed border-slate-300 dark:border-slate-600">
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <Monitor className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                  Preview window will appear here
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Once a session starts, you'll see real-time execution output
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Logs</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{logs.length}</p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Errors</p>
                <p className="text-2xl font-bold text-red-500">
                  {logs.filter(log => log.level === 'error').length}
                </p>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Warnings</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {logs.filter(log => log.level === 'warning').length}
                </p>
              </div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Success</p>
                <p className="text-2xl font-bold text-green-500">
                  {logs.filter(log => log.level === 'success').length}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}