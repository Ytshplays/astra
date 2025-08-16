'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Gamepad2, 
  Trophy, 
  Clock,
  Star,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { GrokParticleBackground } from '@/components/grok-particle-background';

export default function DashboardPage() {
  const [user] = useAuthState(auth);

  // If no user, this will be handled by the layout's AuthGate
  if (!user) {
    return null;
  }

  const userName = user.displayName || 'Astra Player';

  return (
    <>
      <GrokParticleBackground config="dashboard" />
      <div className="flex flex-col gap-8 console-scanlines">
        {/* Welcome Header */}
        <div className="space-y-1 animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight console-text console-glow">
            WELCOME BACK, {userName.toUpperCase()}
          </h1>
          <p className="text-muted-foreground font-mono">
            &gt; Your gaming command center is ready for action
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <Card className="console-card animated-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground console-text">GAMES OWNED</p>
                  <p className="text-2xl font-bold text-primary">42</p>
                </div>
                <Gamepad2 className="h-8 w-8 text-primary console-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="console-card animated-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground console-text">ACHIEVEMENTS</p>
                  <p className="text-2xl font-bold text-accent">158</p>
                </div>
                <Trophy className="h-8 w-8 text-accent console-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="console-card animated-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground console-text">FRIENDS ONLINE</p>
                  <p className="text-2xl font-bold text-green-400">8</p>
                </div>
                <Users className="h-8 w-8 text-green-400 console-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="console-card animated-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground console-text">HOURS PLAYED</p>
                  <p className="text-2xl font-bold text-blue-400">247</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400 console-glow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {/* Recently Played */}
          <div className="lg:col-span-2">
            <Card className="console-card h-full">
              <CardHeader className="console-header">
                <CardTitle className="flex items-center gap-2 console-text">
                  <Activity className="h-5 w-5" />
                  RECENT ACTIVITY
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { game: 'Cyberpunk 2077', time: '2.5 hours', progress: 85 },
                    { game: 'The Witcher 3', time: '1.8 hours', progress: 67 },
                    { game: 'Elden Ring', time: '4.2 hours', progress: 92 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg console-border bg-black/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Gamepad2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.game}</h4>
                          <p className="text-sm text-muted-foreground">Played {item.time} today</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.progress}%</p>
                        <Progress value={item.progress} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Stats */}
          <div className="space-y-6">
            <Card className="console-card">
              <CardHeader className="console-header">
                <CardTitle className="flex items-center gap-2 console-text">
                  <Zap className="h-5 w-5" />
                  SYSTEM STATUS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium text-green-400">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Memory</span>
                    <span className="text-sm font-medium text-blue-400">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage</span>
                    <span className="text-sm font-medium text-orange-400">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="console-card">
              <CardHeader className="console-header">
                <CardTitle className="flex items-center gap-2 console-text">
                  <Target className="h-5 w-5" />
                  DAILY GOALS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Play 2 hours</span>
                    <Badge variant="secondary" className="bg-green-400/20 text-green-400">
                      COMPLETE
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Earn achievement</span>
                    <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                      IN PROGRESS
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connect with friends</span>
                    <Badge variant="secondary" className="bg-gray-400/20 text-gray-400">
                      PENDING
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <Card className="console-card">
            <CardHeader className="console-header">
              <CardTitle className="console-text">QUICK ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2 console-border">
                  <Gamepad2 className="h-6 w-6" />
                  <span className="text-xs">LAUNCH GAME</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 console-border">
                  <Users className="h-6 w-6" />
                  <span className="text-xs">FIND FRIENDS</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 console-border">
                  <Trophy className="h-6 w-6" />
                  <span className="text-xs">VIEW ACHIEVEMENTS</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 console-border">
                  <Star className="h-6 w-6" />
                  <span className="text-xs">RATE GAMES</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
  );
}
          </Card>
        </div>
      </div>
    </>
  );
}
      </div>
    </>
  );
}
