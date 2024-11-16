import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Phone,
  Brain,
  Activity,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-950">
      <header className=" relative px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="#">
          <Shield className="h-6 w-6 text-red-500" />
          <span
            style={{ fontFamily: "ProductSans, sans-serif" }}
            className="ml-2 text-xl font-bold text-white"
          >
            UrgentAI
          </span>
        </Link>
        <div className="mr-10 flex gap-3 sm:gap-6">
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 h-8 text-sm transition-colors">
            AI-Powered Emergency Response
          </Badge>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative bg-gradient-to-b from-black via-gray-900 to-red-950 w-full flex space-x-5  md:py-24 lg:py-32 xl:py-48">
          <div className="content flex space-x-5 mt-10">
            <div className="container w-2/3 px-5 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1
                    style={{
                      position: "absolute",
                      top: "110px",
                      left: "300px",
                      fontSize: "100px",
                      fontFamily: "sans-serif",
                      fontWeight: "700",
                      background:
                        "linear-gradient(90deg, #ff0000, #ff6b6b, #4d94ff, #0000ff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      margin: 0,
                      padding: 0,
                      letterSpacing: "-2px",
                      textShadow:
                        "0 0 10px rgba(255, 0, 0, 0.3), 0 0 20px rgba(0, 0, 255, 0.3)",
                    }}
                  >
                    UrgentAI
                  </h1>

                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-white via-red-200 to-red-400 text-transparent bg-clip-text">
                    Next-Generation Emergency Response System
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                    Revolutionizing emergency services with AI-driven response
                    management. Faster dispatch, smarter decisions, better
                    outcomes.
                  </p>
                </div>
                <div className="space-x-4 pt-6">
                  <Link href="client">
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600 h-14"
                      size="lg"
                    >
                      Victim People
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="dashboard">
                    <Button variant="outline" size="lg" className="h-14">
                      Police Officers
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "250px",
                height: "200px",
                scale: "2.1",
                display: "flex",
                overflow: "visible",
                perspective: "1000px",
                marginLeft: "60px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  transform: "rotateY(-24deg)", // Adjust the degree for the desired tilt
                  transition: "transform 0.3s ease",
                  overflow: "hidden",
                }}
              >
                <Image

                  src="/img/bg-image.webp"
                  alt="Police siren"
                  layout="fill"
                  objectFit="cover"
                  className="border-2 border-slate-300"
                  style={{
                    borderRadius: "5px",
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card className="flex flex-col items-center space-y-4 p-6 bg-black/60 border-red-500/20">
                <div className="p-2 bg-red-500/10 rounded-full">
                  <Brain className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Emotion Analysis
                </h3>
                <p className="text-gray-400 text-center">
                  Advanced AI algorithms analyze caller emotions in real-time to
                  assess emergency severity and prioritize response.
                </p>
              </Card>
              <Card className="flex flex-col items-center space-y-4 p-6 bg-black/60 border-red-500/20">
                <div className="p-2 bg-red-500/10 rounded-full">
                  <Activity className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Smart Dispatch</h3>
                <p className="text-gray-400 text-center">
                  Automated dispatch system coordinates emergency services based
                  on situation analysis and resource availability.
                </p>
              </Card>
              <Card className="flex flex-col items-center space-y-4 p-6 bg-black/60 border-red-500/20">
                <div className="p-2 bg-red-500/10 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Real-time Response
                </h3>
                <p className="text-gray-400 text-center">
                  Instant AI-generated guidance for callers while emergency
                  services are en route to the scene.
                </p>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-red-500/10 px-3 py-1 text-sm text-red-500">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Advanced Emergency Response Technology
                </h2>
                <p className="text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI system processes emergency calls in real-time,
                  analyzing voice patterns, emotions, and keywords to determine
                  urgency and dispatch appropriate resources instantly.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row lg:justify-end">
                <div className="w-full lg:w-[450px] h-[300px] rounded-xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 p-6 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Phone className="h-12 w-12 text-red-500 mx-auto" />
                    <div className="space-y-2">
                      <p className="text-sm text-red-400">
                        Emergency Call Processing
                      </p>
                      <div className="flex justify-center gap-2">
                        <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-red-500" />
                        <span
                          className="animate-pulse inline-block h-2 w-2 rounded-full bg-red-500"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="animate-pulse inline-block h-2 w-2 rounded-full bg-red-500"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Ready to Transform Emergency Response?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Join the future of emergency services with our AI-powered
                  solution.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button
                  className="w-full bg-red-500 text-white hover:bg-red-600"
                  size="lg"
                >
                  Request Demo
                </Button>
                <p className="text-xs text-gray-400">
                  Available 24/7 for emergency services providers
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2024 UrgentAI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div >
  );
}