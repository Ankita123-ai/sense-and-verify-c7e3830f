import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, Video, LogOut, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const features = [
    {
      title: 'Text Analysis',
      description: 'Analyze news articles and text content for authenticity',
      icon: FileText,
      path: '/text-analysis',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Image Analysis',
      description: 'Verify the authenticity of news images and detect manipulation',
      icon: Image,
      path: '/image-analysis',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Real-time News',
      description: 'Monitor and analyze live news videos (Coming soon)',
      icon: Video,
      path: '#',
      gradient: 'from-orange-500 to-red-500',
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">DeepVerify</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Welcome to DeepVerify
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combating misinformation with AI-powered fact-checking and verification tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  feature.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => !feature.disabled && navigate(feature.path)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                
                {feature.disabled && (
                  <CardContent>
                    <span className="text-xs text-muted-foreground italic">Coming Soon</span>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">About DeepVerify</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                DeepVerify uses advanced machine learning algorithms to detect fake news and misinformation 
                in crime reporting. Our system analyzes text, images, and cross-references with verified databases.
              </p>
              <p>
                By linking news with official crime records, we help build public trust and promote truthful information.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
