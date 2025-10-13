import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

export default function TextAnalysis() {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ label: string; confidence: number; details: string } | null>(null);
  const navigate = useNavigate();

  const analyzeText = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setAnalyzing(true);
    
    // Simulating API call - In production, this would call your ML backend
    setTimeout(() => {
      // Mock result for demonstration
      const isFake = text.toLowerCase().includes('fake') || text.toLowerCase().includes('false');
      setResult({
        label: isFake ? 'FAKE' : 'TRUE',
        confidence: Math.random() * 30 + 70,
        details: isFake 
          ? 'This news article contains multiple indicators of misinformation. Cross-referencing with verified sources shows inconsistencies.'
          : 'This news article appears authentic based on language patterns and cross-referencing with verified databases.'
      });
      setAnalyzing(false);
    }, 2000);
  };

  const getResultIcon = () => {
    if (!result) return null;
    if (result.label === 'TRUE') return <CheckCircle className="w-12 h-12 text-green-500" />;
    if (result.label === 'FAKE') return <XCircle className="w-12 h-12 text-red-500" />;
    return <AlertCircle className="w-12 h-12 text-yellow-500" />;
  };

  const getResultColor = () => {
    if (!result) return '';
    if (result.label === 'TRUE') return 'border-green-500 bg-green-500/5';
    if (result.label === 'FAKE') return 'border-red-500 bg-red-500/5';
    return 'border-yellow-500 bg-yellow-500/5';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Text Analysis</h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Analyze News Text</CardTitle>
              <CardDescription>
                Paste the news article or text content you want to verify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter or paste news text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <Button 
                onClick={analyzeText} 
                className="w-full"
                disabled={analyzing || !text.trim()}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Text'
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className={`animate-scale-in border-2 ${getResultColor()}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {getResultIcon()}
                  <div>
                    <CardTitle className="text-2xl">
                      {result.label === 'TRUE' ? 'Likely Authentic' : 'Potentially Fake'}
                    </CardTitle>
                    <CardDescription>
                      Confidence: {result.confidence.toFixed(1)}%
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.details}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
