import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Activity,
  Video,
  Brain,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Video,
      title: "Real-Time Video Analysis",
      description: "Process CCTV footage in real-time with advanced deep learning models",
    },
    {
      icon: Brain,
      title: "Hybrid AI System",
      description: "Combines classical deep learning with quantum computing for enhanced detection",
    },
    {
      icon: AlertTriangle,
      title: "13 Crime Types Detected",
      description: "Identifies Fighting, Robbery, Assault, Shoplifting, and 9 more anomaly types",
    },
    {
      icon: Activity,
      title: "Instant Alerts",
      description: "Get immediate notifications when suspicious activities are detected",
    },
    {
      icon: Zap,
      title: "Quantum Enhancement",
      description: "Simulated quantum layer improves feature recognition accuracy",
    },
    {
      icon: Shield,
      title: "UCF-Crime Dataset",
      description: "Trained on real-world CCTV surveillance data for reliable performance",
    },
  ];

  const crimeTypes = [
    "Abuse",
    "Arrest",
    "Arson",
    "Assault",
    "Burglary",
    "Explosion",
    "Fighting",
    "Road Accidents",
    "Robbery",
    "Shooting",
    "Shoplifting",
    "Stealing",
    "Vandalism",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CCTV Anomaly Detection</span>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Real-Time CCTV
            <span className="text-primary"> Anomaly Detection</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Advanced hybrid classical-quantum AI system for detecting suspicious
            activities in surveillance footage.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/90 text-lg px-8"
            >
              Start Detection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">14</div>
            <div className="text-muted-foreground">Activity Classes</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">13</div>
            <div className="text-muted-foreground">Crime Types Detected</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">Real-Time</div>
            <div className="text-muted-foreground">Live Processing</div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">1</div>
            <h3 className="font-semibold mb-2">Video Input</h3>
            <p className="text-sm text-muted-foreground">
              Upload CCTV footage or connect live camera feed
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">2</div>
            <h3 className="font-semibold mb-2">Feature Extraction</h3>
            <p className="text-sm text-muted-foreground">
              CNN extracts spatial features, LSTM learns temporal patterns
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">3</div>
            <h3 className="font-semibold mb-2">Quantum Enhancement</h3>
            <p className="text-sm text-muted-foreground">
              Simulated quantum layer enhances complex feature relationships
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">4</div>
            <h3 className="font-semibold mb-2">Classification</h3>
            <p className="text-sm text-muted-foreground">
              Hybrid features classified into Normal or 13 crime types
            </p>
          </Card>
        </div>
      </section>

      {/* Crime Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-8">
          Detected Crime Types
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {crimeTypes.map((crime, index) => (
            <Card key={index} className="p-4 text-center">
              <CheckCircle2 className="h-5 w-5 text-primary mx-auto mb-2" />
              <span className="font-medium">{crime}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <h2 className="text-3xl font-bold text-center mb-12">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="font-semibold mb-2">Frontend</div>
            <div className="text-sm text-muted-foreground">
              React, TypeScript, Tailwind CSS, shadcn/ui
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="font-semibold mb-2">Backend</div>
            <div className="text-sm text-muted-foreground">Flask, Python</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="font-semibold mb-2">ML Framework</div>
            <div className="text-sm text-muted-foreground">
              TensorFlow, Keras, OpenCV
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="font-semibold mb-2">Quantum</div>
            <div className="text-sm text-muted-foreground">PennyLane</div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="p-12 text-center bg-primary/5 border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your CCTV footage or connect a live camera feed to start
            detecting anomalies in real-time.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="bg-primary hover:bg-primary/90 text-lg px-8"
          >
            Launch Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              CCTV Anomaly Detection System - Hybrid Classical-Quantum AI
            </p>
            <p className="text-sm">
              Built with React, TensorFlow, and PennyLane | UCF-Crime Dataset
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
