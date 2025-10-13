import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Upload, Loader2, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

export default function ImageAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ label: string; confidence: number; details: string } | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }

    setAnalyzing(true);
    
    // Simulating API call - In production, this would call your ML backend
    setTimeout(() => {
      const isFake = Math.random() > 0.6;
      setResult({
        label: isFake ? 'FAKE' : 'TRUE',
        confidence: Math.random() * 25 + 75,
        details: isFake 
          ? 'Image analysis detected potential manipulation. EXIF data inconsistencies and pixel-level artifacts suggest possible editing.'
          : 'Image appears authentic. Metadata is consistent, no signs of manipulation detected in the analyzed regions.'
      });
      setAnalyzing(false);
    }, 2500);
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
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
            <h1 className="text-xl font-bold">Image Analysis</h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Analyze News Image</CardTitle>
              <CardDescription>
                Upload an image from a news article to verify its authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!image ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-auto rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {image && (
                <Button 
                  onClick={analyzeImage} 
                  className="w-full"
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card className={`animate-scale-in border-2 ${getResultColor()}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {getResultIcon()}
                  <div>
                    <CardTitle className="text-2xl">
                      {result.label === 'TRUE' ? 'Likely Authentic' : 'Potentially Manipulated'}
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
