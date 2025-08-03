import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import Agents from "@/pages/agents";
import Tasks from "@/pages/tasks";
import Crews from "@/pages/crews";
import CrewBuilder from "@/pages/crew-builder";
import Templates from "@/pages/templates";
import Executions from "@/pages/executions";
import Analytics from "@/pages/analytics";
import Files from "@/pages/files";
import LivePreview from "@/pages/live-preview";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/agents" component={Agents} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/crews" component={Crews} />
            <Route path="/crews/new" component={CrewBuilder} />
            <Route path="/templates" component={Templates} />
            <Route path="/executions" component={Executions} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/files" component={Files} />
            <Route path="/live-preview" component={LivePreview} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="crewai-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
