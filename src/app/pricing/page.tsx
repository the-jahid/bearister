"use client"

import { Check, Scale, Zap, Crown, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { NavbarDemo } from "@/components/Navbar"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface UserData {
  id: string
  email: string
  oauthId: string
  username: string
  createdAt: string
  updatedAt: string
  subscriptioStartDate: string
  subscriptionEndDate: string
  subscriptionStatus: string
  planType: "BASIC" | "CORE" | "ADVANCED" | "PRO"
  messagesUsed: number
  documentsUsed: number
  messageLeft: number
  documentLeft: number
}

export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [fetchingUser, setFetchingUser] = useState(true)
  const router = useRouter()
  const { userId, isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded) return

      if (!userId || !isSignedIn) {
        setFetchingUser(false)
        return
      }

      try {
        const response = await fetch(`https://bearister-server.onrender.com/api/v1/users/${userId}`)
        const result = await response.json()

        if (result.status === "success") {
          setUserData(result.data)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setFetchingUser(false)
      }
    }

    fetchUserData()
  }, [userId, isSignedIn, isLoaded])

  const handleCheckout = async (priceId: string, planName: string, isFree = false) => {
    try {
      if (!isSignedIn) {
        router.push("/sign-in?redirect_url=" + encodeURIComponent("/pricing"))
        return
      }

      if (isFree) {
        // For free tier, redirect to dashboard
        router.push("/dashboard")
        return
      }

      setLoading(planName)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        console.error("Stripe checkout error:", error)
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const getCurrentPlanType = (planName: string): string => {
    const planMapping: Record<string, string> = {
      Basic: "BASIC",
      Core: "CORE",
      Advanced: "ADVANCED",
      Pro: "PRO",
    }
    return planMapping[planName] || ""
  }

  const isCurrentPlan = (planName: string): boolean => {
    if (!userData) return false
    return getCurrentPlanType(planName) === userData.planType
  }

  const plans = [
    {
      name: "Basic",
      price: "$0",
      priceId: "free",
      period: "/month",
      description: "Perfect for trying out our AI legal assistant",
      icon: Scale,
      features: [
        "20 messages per month",
        "Max 4,096 tokens per message",
        "3 document uploads per month",
        "Simple law student outlines",
        "Case law research",
        "Email support",
      ],
      buttonText: "Get Started Free",
      popular: false,
      delay: "delay-100",
      isFree: true,
    },
    {
      name: "Core",
      price: "$20",
      priceId: "price_core",
      period: "/month",
      description: "Ideal for law students and solo practitioners",
      icon: Zap,
      features: [
        "300 messages per month",
        "Max 4,096 tokens per message",
        "10 document uploads per month",
        "Detailed law student outlines",
        "Case law research",
        "Save past chats/research",
        "Simple motion drafting templates",
        "Priority email support",
      ],
      buttonText: "Get Started",
      popular: true,
      delay: "delay-200",
      isFree: false,
    },
    {
      name: "Advanced",
      price: "$40",
      priceId: "price_advanced",
      period: "/month",
      description: "For growing practices and mid-size firms",
      icon: Crown,
      features: [
        "700 messages per month",
        "Max 4,096 tokens per message",
        "50 document uploads per month",
        "Detailed exportable outlines",
        "Case law research",
        "Save past chats/research",
        "Police report analysis",
        "Cross-examination builder",
        "Voir dire question builder",
        "Juror profile creator",
        "Simple motion drafting templates",
        "Priority support",
      ],
      buttonText: "Get Started",
      popular: false,
      delay: "delay-300",
      isFree: false,
    },
    {
      name: "Pro",
      price: "$99",
      priceId: "price_pro",
      period: "/month",
      description: "For large firms requiring maximum capability",
      icon: Crown,
      features: [
        "1,500 messages per month",
        "Max 4,096 tokens per message",
        "Unlimited document uploads",
        "Detailed exportable outlines",
        "Case law research",
        "Save past chats/research",
        "Police report analysis",
        "Cross-examination builder",
        "Voir dire question builder",
        "Juror profile creator",
        "Simple motion drafting templates",
        "Detailed motion drafting (case-tailored)",
        "Batch upload / multi-file search",
        "24/7 priority support",
        "Dedicated account manager",
      ],
      buttonText: "Get Started",
      popular: false,
      delay: "delay-400",
      isFree: false,
    },
  ]

  const additionalFeatures = [
    "256-bit SSL encryption",
    "GDPR & HIPAA compliant",
    "Regular model updates",
    "Mobile app access",
  ]

  return (

 <div className="bg-gradient-to-b from-[#0C0C1C] to-black" >
    <NavbarDemo  >
     <div className="min-h-screen bg-gradient-to-b from-[#0C0C1C] to-black text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400/40 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-pink-400/30 rounded-full animate-float"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 animate-glow">
            <Sparkles className="w-5 h-5 text-violet-400 animate-spin-slow" />
            <span className="text-sm text-gray-300">AI-Powered Legal Solutions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-gradient-text">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-orange-400 bg-clip-text text-transparent bg-300% animate-gradient">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-90">
            Unlock the power of AI-driven legal assistance. From solo practitioners to enterprise firms, we have the
            perfect plan to elevate your legal practice.
          </p>

          {/* Current Plan Display */}
          {userData && !fetchingUser && isSignedIn && (
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">
                Current Plan: {userData.planType} • {userData.messageLeft} messages left • {userData.documentLeft}{" "}
                documents left
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-8xl mx-auto mb-20">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            const isActive = isCurrentPlan(plan.name)

            return (
              <Card
                key={plan.name}
                className={`group relative bg-white/5 backdrop-blur-xl border transition-all duration-500 hover:scale-105 hover:bg-white/10 ${
                  isActive
                    ? "border-green-500/50 bg-green-500/10 ring-1 ring-green-500/30"
                    : plan.popular
                      ? "ring-1 ring-violet-500/30 scale-105 bg-white/8 border-white/10 hover:border-white/20"
                      : "border-white/10 hover:border-white/20"
                } ${isVisible ? `opacity-100 translate-y-0 ${plan.delay}` : "opacity-0 translate-y-10"} animate-fade-in-up overflow-hidden`}
              >
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"></div>

                {/* Animated border gradient */}
                <div
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
                    isActive
                      ? "bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20"
                      : "bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-orange-500/20"
                  }`}
                ></div>

                {/* Current Plan Badge */}
                {isActive && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 animate-bounce-subtle">
                    Current Plan
                  </Badge>
                )}

                {/* Most Popular Badge */}
                {plan.popular && !isActive && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-500 to-orange-500 text-white border-0 animate-bounce-subtle">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8 relative z-10">
                  <div
                    className={`mx-auto mb-4 p-4 rounded-full w-fit backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20"
                        : "bg-gradient-to-r from-violet-500/20 to-orange-500/20"
                    }`}
                  >
                    <IconComponent
                      className={`h-8 w-8 transition-colors duration-300 ${
                        isActive
                          ? "text-green-400 group-hover:text-green-300"
                          : "text-orange-400 group-hover:text-orange-300"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-violet-200 transition-colors duration-300">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors duration-300">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-6">
                    <span
                      className={`text-5xl font-bold bg-clip-text text-transparent transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-green-400 to-emerald-400 group-hover:from-green-300 group-hover:to-emerald-300"
                          : "bg-gradient-to-r from-violet-400 to-orange-400 group-hover:from-violet-300 group-hover:to-orange-300"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors duration-300">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start space-x-3 group-hover:translate-x-1 transition-transform duration-300"
                      style={{ transitionDelay: `${featureIndex * 50}ms` }}
                    >
                      <Check
                        className={`h-5 w-5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                          isActive
                            ? "text-green-400 group-hover:text-green-300"
                            : "text-green-400 group-hover:text-green-300"
                        }`}
                      />
                      <span className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="pt-8 relative z-10">
                  <Button
                    onClick={() => handleCheckout(plan.priceId, plan.name, plan.isFree)}
                    disabled={loading === plan.name || isActive}
                    className={`w-full py-3 text-lg font-semibold transition-all duration-300 backdrop-blur-sm border hover:scale-105 ${
                      isActive
                        ? "bg-green-500/20 text-green-300 border-green-500/30 cursor-not-allowed"
                        : plan.popular
                          ? "bg-gradient-to-r from-violet-500/80 to-orange-500/80 hover:from-violet-500 hover:to-orange-500 text-white border-white/20 hover:border-white/30 shadow-lg hover:shadow-violet-500/25"
                          : plan.isFree
                            ? "bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-500 hover:to-emerald-500 text-white border-white/20 hover:border-white/30 shadow-lg hover:shadow-green-500/25"
                            : "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
                    }`}
                  >
                    {isActive ? "Current Plan" : loading === plan.name ? "Processing..." : plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Additional Features Section */}
        <div
          className={`text-center transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-orange-400 bg-clip-text text-transparent">
            All Plans Include
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 max-w-4xl mx-auto hover:bg-white/10 transition-all duration-500 group">
            <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-violet-200 transition-colors duration-300">
              Ready to transform your legal practice?
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto group-hover:text-gray-300 transition-colors duration-300">
              Join thousands of legal professionals who trust BearisterAI to enhance their practice with cutting-edge AI
              technology.
            </p>
            <Button
              onClick={() => handleCheckout(plans[0].priceId, plans[0].name, plans[0].isFree)}
              disabled={loading !== null}
              className="bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
            >
              {loading ? "Processing..." : "Start Your Free Trial"}
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.4); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-5px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 6s ease infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
   </NavbarDemo>
 </div>
  )
}
