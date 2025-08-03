import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  CreditCard, 
  Settings as SettingsIcon,
  Check,
  AlertCircle,
  Download,
  Eye,
  Sliders
} from "lucide-react";

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

const sections: SettingsSection[] = [
  {
    id: "profile",
    title: "Profile",
    icon: User,
    description: "Manage your account information and preferences"
  },
  {
    id: "api",
    title: "API Configuration",
    icon: Key,
    description: "Configure AI models and API settings"
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "Control how and when you receive notifications"
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    description: "Manage your account security and privacy"
  },
  {
    id: "billing",
    title: "Billing & Usage",
    icon: CreditCard,
    description: "View usage, billing, and manage your subscription"
  },
  {
    id: "preferences",
    title: "Preferences",
    icon: SettingsIcon,
    description: "Customize your platform experience"
  }
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState({
    theme: "light",
    autoSave: true,
    compactMode: false,
    emailNotifications: true,
    pushNotifications: false,
    crewUpdates: true,
    systemAlerts: true,
    weeklyReports: false,
    twoFactor: true,
    sessionTimeout: "24"
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderProfile = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="Doe" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue="john.doe@example.com" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" defaultValue="Acme Corp" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select defaultValue="admin">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90">
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );

  const renderApiConfiguration = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>API Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openaiKey">OpenAI API Key</Label>
            <Input id="openaiKey" type="password" placeholder="sk-..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultModel">Default Model</Label>
            <Select defaultValue="gpt-4">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input id="temperature" type="number" defaultValue="0.7" min="0" max="2" step="0.1" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input id="maxTokens" type="number" defaultValue="2048" />
          </div>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90">
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive notifications for this category
              </p>
            </div>
            <Switch 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive notifications for this category
              </p>
            </div>
            <Switch 
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Crew Updates</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive notifications for this category
              </p>
            </div>
            <Switch 
              checked={settings.crewUpdates}
              onCheckedChange={(checked) => updateSetting('crewUpdates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">System Alerts</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive notifications for this category
              </p>
            </div>
            <Switch 
              checked={settings.systemAlerts}
              onCheckedChange={(checked) => updateSetting('systemAlerts', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Weekly Reports</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive notifications for this category
              </p>
            </div>
            <Switch 
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => updateSetting('weeklyReports', checked)}
            />
          </div>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );

  const renderSecurity = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Security</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch 
              checked={settings.twoFactor}
              onCheckedChange={(checked) => updateSetting('twoFactor', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
            <Select 
              value={settings.sessionTimeout}
              onValueChange={(value) => updateSetting('sessionTimeout', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90">
          Update Security Settings
        </Button>
      </CardContent>
    </Card>
  );

  const renderBilling = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Billing & Usage</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Plan</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-primary">Pro Plan</span>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">$29/month</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Payment Method</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">•••• •••• •••• 4242</span>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Expires 12/25
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">API Usage</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">12,450</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    tokens this month
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Recent Invoices</h4>
          <div className="space-y-2">
            {[
              { id: "#1001", date: "December 1, 2024", amount: "$29.00" },
              { id: "#1002", date: "December 2, 2024", amount: "$29.00" },
              { id: "#1003", date: "December 3, 2024", amount: "$29.00" }
            ].map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">Invoice {invoice.id}</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{invoice.amount}</span>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPreferences = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5" />
          <span>Preferences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select 
              value={settings.theme}
              onValueChange={(value) => updateSetting('theme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-save</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automatically save changes as you work
              </p>
            </div>
            <Switch 
              checked={settings.autoSave}
              onCheckedChange={(checked) => updateSetting('autoSave', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Compact Mode</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Use a more compact interface layout
              </p>
            </div>
            <Switch 
              checked={settings.compactMode}
              onCheckedChange={(checked) => updateSetting('compactMode', checked)}
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-4">Account Status</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">Profile Complete</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">API Configured</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Security Enabled</span>
            </div>
          </div>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile": return renderProfile();
      case "api": return renderApiConfiguration();
      case "notifications": return renderNotifications();
      case "security": return renderSecurity();
      case "billing": return renderBilling();
      case "preferences": return renderPreferences();
      default: return renderProfile();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your account, preferences, and platform configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-sm transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 hidden lg:block">
                          {section.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}