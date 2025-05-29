import React from 'react';

import { ContainerScroll } from '../ui/container-scroll-animation';


import { Button } from '../ui/button';
// import Link from 'next/link';

import { motion } from "framer-motion"
import {

  ArrowRight,

} from "lucide-react"


import { Badge } from "@/components/ui/badge"
import Image from 'next/image';

const HeroSection = () => {

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
        <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
 <div className=" flex items-center justify-center">
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-7xl">
          {"AI-Powered Legal Assistance".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
         Meet Obie — your AI co-counsel, powered by BearisterAI. From defense strategy to civil litigation to 1L prep, Obie helps you research, draft, strategize, and stay five steps ahead.
        </motion.p>

        {/* <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="flex justify-center mt-8"
        >
        <Link href={'/dashboard'} >
            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-amber-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Get Started
          </button>
        </Link>
        </motion.div> */}
      </div>
    </div>
            </div>
          </>
        }
      >
          <motion.section
                className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="max-w-6xl mx-auto">
               
        
                  <motion.div
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                          <Image
                            src="https://i.ibb.co/cKpJxnsT/A55-C04-B3-FD56-4367-93-C6-DF68-E80-C9-FC4-1-removebg-preview.png"
                            alt="BearisterAI Logo"
                            width={32}
                            height={25}
                            className="w-6 h-6"
                          />
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

        
      </ContainerScroll>
    </div>
    );
}

export default HeroSection;



