/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Scale,
  Brain,
  Shield,
  Users,
  FileText,
  Search,
  BarChart3,
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Legal Analysis",
      description: "Advanced machine learning algorithms trained on millions of legal documents and case precedents",
      details: [
        "Case law research and analysis",
        "Legal document review and summarization",
        "Precedent identification and matching",
        "Risk assessment and outcome prediction",
      ],
      color: "purple",
    },
    {
      icon: Users,
      title: "Jury Psychology Insights",
      description: "Understand jury behavior patterns and optimize your case strategy for maximum impact",
      details: [
        "Jury selection optimization",
        "Behavioral pattern analysis",
        "Persuasion strategy recommendations",
        "Demographic impact assessment",
      ],
      color: "orange",
    },
    {
      icon: FileText,
      title: "Document Intelligence",
      description: "Intelligent document processing and analysis for faster case preparation",
      details: [
        "Contract analysis and review",
        "Evidence categorization",
        "Key information extraction",
        "Document comparison and diff analysis",
      ],
      color: "purple",
    },
    {
      icon: Search,
      title: "Legal Research Engine",
      description: "Comprehensive legal database search with AI-enhanced relevance ranking",
      details: [
        "Multi-jurisdiction case law search",
        "Statute and regulation lookup",
        "Citation analysis and verification",
        "Trend analysis and legal insights",
      ],
      color: "orange",
    },
  ]

  const additionalFeatures = [
    {
      icon: MessageSquare,
      title: "Interactive Chat Interface",
      description: "Natural language conversations with your AI legal assistant",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access legal insights and analysis anytime, anywhere",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with legal industry standards",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track case progress and analyze performance metrics",
    },
    {
      icon: Target,
      title: "Strategy Optimization",
      description: "AI-driven recommendations for case strategy and tactics",
    },
    {
      icon: BookOpen,
      title: "Legal Knowledge Base",
      description: "Comprehensive database of legal precedents and regulations",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C0C1C] to-[#000000] text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

 
      {/* Hero Section */}
      <motion.section
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants}>
            <Badge className="mb-6 bg-gradient-to-r from-purple-600/20 to-orange-600/20 text-purple-300 border-purple-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Legal Technology
            </Badge>
          </motion.div>

          <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" variants={itemVariants}>
            Revolutionary Features for
            <span className="block bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              Modern Legal Practice
            </span>
          </motion.h1>

          <motion.p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto" variants={itemVariants}>
            Discover how BearisterAI transforms legal work with cutting-edge artificial intelligence, advanced
            analytics, and intuitive tools designed for legal professionals.
          </motion.p>

          {/* <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <Button className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white px-8 py-3 text-lg">
              Try Free Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
              Watch Video
            </Button>
          </motion.div> */}
        </div>
      </motion.section>

      {/* Main Features Section */}
      <motion.section
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful AI capabilities designed to enhance every aspect of your legal practice
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          feature.color === "purple"
                            ? "bg-gradient-to-br from-purple-500/20 to-purple-600/20"
                            : "bg-gradient-to-br from-orange-500/20 to-orange-600/20"
                        }`}
                      >
                        <feature.icon
                          className={`w-6 h-6 ${feature.color === "purple" ? "text-purple-400" : "text-orange-400"}`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-gray-300 text-base mt-4">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Additional Features Grid */}
      <motion.section
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white/5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Additional Capabilities</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive tools and features to support your entire legal workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-purple-400" />
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interactive Demo Section */}
      <motion.section
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">See BearisterAI in Action</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the power of AI-driven legal assistance through our interactive chat interface
            </p>
          </motion.div>

          <motion.div
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                  BearisterAI Chat
                </span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Online
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-start">
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
                  <p className="text-white">
                    Hello! I&apos;m your AI legal assistant. How can I help you with your case today?
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl rounded-tr-md px-4 py-3 max-w-md">
                  <p className="text-white">Can you help me analyze the strength of a contract dispute case?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
                  <p className="text-white">
                    I&apos;d be happy to help! Please share the contract details and I&apos;ll analyze potential breach claims,
                    damages, and success probability based on similar cases.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3">
                <span className="text-gray-400">Brief your Bearister...</span>
              </div>
              <Button
                size="icon"
                className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 rounded-full"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 className="text-3xl sm:text-4xl font-bold mb-6" variants={itemVariants}>
            Ready to Transform Your Legal Practice?
          </motion.h2>
          <motion.p className="text-xl text-gray-400 mb-8" variants={itemVariants}>
            Join thousands of legal professionals who trust BearisterAI for their most important cases
          </motion.p>
          {/* <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <Button className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white px-8 py-3 text-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
              Schedule Demo
            </Button>
          </motion.div> */}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                BearisterAI
              </span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2024 BearisterAI. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
