/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState, useEffect, useRef, createContext, useContext, type ReactNode } from "react"
import { Plus, User, Menu, X, Trash2, MoreVertical, Home, Zap } from "lucide-react"
import Image from "next/image"
import { div } from "motion/react-client"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

// Types
type Plan = "free" | "starter" | "professional" | "enterprise"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: string
  isCode?: boolean
}

interface Chat {
  id: string
  title: string
  messages: Message[]
}

interface FlowiseResponse {
  text?: string
  [key: string]: unknown
}

interface FlowiseRequest {
  question: string
  overrideConfig: {
    systemMessage: string
    maxIterations: number
    enableDetailedStreaming: boolean
    sessionId: string
    history: string
  }
}

interface MessageLimitContextType {
  messageCount: number
  incrementMessageCount: () => void
  resetMessageCount: () => void
  currentPlan: Plan
  upgradePlan: (plan: Plan) => void
  isLimitExceeded: boolean
  showUpgradeModal: boolean
  setShowUpgradeModal: (show: boolean) => void
  messageLimit: number
}

// Context
const MessageLimitContext = createContext<MessageLimitContextType | undefined>(undefined)

function MessageLimitProvider({ children }: { children: ReactNode }) {
  const [messageCount, setMessageCount] = useState(0)
  const [currentPlan, setCurrentPlan] = useState<Plan>("free")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Load message count and plan from localStorage on component mount
  useEffect(() => {
    const savedMessageCount = localStorage.getItem("messageCount")
    const savedPlan = localStorage.getItem("currentPlan") as Plan | null

    if (savedMessageCount) {
      setMessageCount(Number.parseInt(savedMessageCount))
    }

    if (savedPlan) {
      setCurrentPlan(savedPlan)
    }
  }, [])

  // Save message count and plan to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("messageCount", messageCount.toString())
    localStorage.setItem("currentPlan", currentPlan)
  }, [messageCount, currentPlan])

  const getPlanLimit = (plan: Plan): number => {
    switch (plan) {
      case "free":
        return 20
      case "starter":
        return 100
      case "professional":
        return 500
      case "enterprise":
        return Number.POSITIVE_INFINITY
      default:
        return 20
    }
  }

  const messageLimit = getPlanLimit(currentPlan)
  const isLimitExceeded = messageCount >= messageLimit

  const incrementMessageCount = () => {
    const newCount = messageCount + 1
    setMessageCount(newCount)

    if (newCount >= messageLimit && currentPlan === "free") {
      setShowUpgradeModal(true)
    }
  }

  const resetMessageCount = () => {
    setMessageCount(0)
  }

  const upgradePlan = (plan: Plan) => {
    setCurrentPlan(plan)
    setShowUpgradeModal(false)
  }

  return (
    <MessageLimitContext.Provider
      value={{
        messageCount,
        incrementMessageCount,
        resetMessageCount,
        currentPlan,
        upgradePlan,
        isLimitExceeded,
        showUpgradeModal,
        setShowUpgradeModal,
        messageLimit,
      }}
    >
      {children}
    </MessageLimitContext.Provider>
  )
}

function useMessageLimit() {
  const context = useContext(MessageLimitContext)
  if (context === undefined) {
    throw new Error("useMessageLimit must be used within a MessageLimitProvider")
  }
  return context
}

// Components
function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, messageLimit } = useMessageLimit()

  return (
    <>
      {showUpgradeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            style={{
              backgroundColor: "#1a1a2e",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "400px",
              width: "100%",
              border: "1px solid #374151",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "50%",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap style={{ width: "20px", height: "20px", color: "#f59e0b" }} />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "white",
                  margin: 0,
                }}
              >
                Message Limit Reached
              </h3>
            </div>

            <p
              style={{
                color: "#d1d5db",
                marginBottom: "20px",
                lineHeight: "1.5",
                margin: "0 0 20px 0",
              }}
            >
              You&#39;ve reached your free plan limit of {messageLimit} messages. Upgrade your plan to continue the
              conversation.
            </p>

            <div
              style={{
                backgroundColor: "#374151",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ color: "white", marginBottom: "12px", fontSize: "14px", fontWeight: "500" }}>
                Benefits of upgrading:
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px" }}>
                <li style={{ display: "flex", alignItems: "start", gap: "8px", marginBottom: "8px" }}>
                  <span
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.2)",
                      color: "#22c55e",
                      borderRadius: "50%",
                      padding: "2px",
                      fontSize: "10px",
                      minWidth: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ color: "#d1d5db" }}>More messages per month</span>
                </li>
                <li style={{ display: "flex", alignItems: "start", gap: "8px", marginBottom: "8px" }}>
                  <span
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.2)",
                      color: "#22c55e",
                      borderRadius: "50%",
                      padding: "2px",
                      fontSize: "10px",
                      minWidth: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ color: "#d1d5db" }}>Advanced legal research capabilities</span>
                </li>
                <li style={{ display: "flex", alignItems: "start", gap: "8px" }}>
                  <span
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.2)",
                      color: "#22c55e",
                      borderRadius: "50%",
                      padding: "2px",
                      fontSize: "10px",
                      minWidth: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ color: "#d1d5db" }}>Priority support</span>
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #4b5563",
                  backgroundColor: "transparent",
                  color: "#d1d5db",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false)
                  window.location.href = "/pricing"
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "linear-gradient(to right, #9333ea, #f97316)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(to right, #7c3aed, #ea580c)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(to right, #9333ea, #f97316)"
                }}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PlanBadge() {
  const { currentPlan, messageCount, messageLimit } = useMessageLimit()

  const getPlanColor = () => {
    switch (currentPlan) {
      case "free":
        return "#64748b"
      case "starter":
        return "#9333ea"
      case "professional":
        return "#f59e0b"
      case "enterprise":
        return "#10b981"
      default:
        return "#64748b"
    }
  }

  const getPlanName = () => {
    return currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "end", gap: "4px" }}>
      <div
        style={{
          backgroundColor: getPlanColor(),
          color: "white",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Zap style={{ width: "12px", height: "12px" }} />
        {getPlanName()} Plan
      </div>
      <span style={{ fontSize: "10px", color: "#9ca3af" }}>
        {messageCount}/{messageLimit === Number.POSITIVE_INFINITY ? "∞" : messageLimit} messages
      </span>
    </div>
  )
}

function UpgradeButton() {
  const { currentPlan } = useMessageLimit()

  // Don't show upgrade button for enterprise plan
  if (currentPlan === "enterprise") {
    return null
  }

  const handleUpgradeClick = () => {
    window.location.href = "/pricing"
  }

  return (
    <button
      onClick={handleUpgradeClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid rgba(147, 51, 234, 0.3)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        color: "#a855f7",
        cursor: "pointer",
        fontSize: "12px",
        transition: "all 0.2s ease",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(147, 51, 234, 0.2)"
        e.currentTarget.style.color = "#c084fc"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(147, 51, 234, 0.1)"
        e.currentTarget.style.color = "#a855f7"
      }}
    >
      <Zap style={{ width: "14px", height: "14px" }} />
      Upgrade Plan
    </button>
  )
}

// Main Component
export default function ChatInterface() {
  return (
    <MessageLimitProvider>
      <div style={{ minHeight: "100vh", backgroundColor: "#0c0c1d" }}>
        <ChatView />
        <UpgradeModal />
      </div>
    </MessageLimitProvider>
  )
}

function ChatView() {
  // Message limit context
  const { incrementMessageCount, isLimitExceeded, setShowUpgradeModal } = useMessageLimit()

  // State for managing chats and sessions
  const [sessionId, setSessionId] = useState<string>("")
  const [chats, setChats] = useState<Chat[]>([{ id: "1", title: "Chat Title", messages: [] }])
  const [activeChat, setActiveChat] = useState<string>("1")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [chatMenuOpen, setChatMenuOpen] = useState<string | null>(null)

  // Ref for auto-scrolling to the bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Generate a unique session ID on component mount
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setSessionId(newSessionId)
      console.log("New session created:", newSessionId)
    }
  }, [sessionId])

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_${activeChat}`)
    if (savedMessages) {
      try {
        const parsedMessages: Message[] = JSON.parse(savedMessages)
        setMessages(parsedMessages)
      } catch (error) {
        console.error("Error parsing saved messages:", error)
        setMessages([])
      }
    }
  }, [activeChat])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${activeChat}`, JSON.stringify(messages))
    }
  }, [messages, activeChat])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  /**
   * Scrolls the chat container to the bottom
   */
  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  /**
   * Formats timestamp for display
   */
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) {
      return "Just now"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  /**
   * Generates a chat title based on the user's first message
   */
  const generateChatTitle = (userMessage: string): string => {
    const cleanMessage = userMessage.trim()
    if (cleanMessage.length <= 30) {
      return cleanMessage
    }

    const words = cleanMessage.split(" ")
    let title = ""

    for (const word of words) {
      if (title.length + word.length + 1 <= 30) {
        title += (title ? " " : "") + word
      } else {
        break
      }
    }

    if (title.length < cleanMessage.length) {
      title += "..."
    }

    return title || "New Chat"
  }

  /**
   * Updates the chat title based on the first user message
   */
  const updateChatTitle = (chatId: string, userMessage: string): void => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === chatId ? { ...chat, title: generateChatTitle(userMessage) } : chat)),
    )
  }

  /**
   * Flowise API query function
   */
  async function query(data: FlowiseRequest): Promise<FlowiseResponse> {
    const response = await fetch(
      "https://flowise-v9f3.onrender.com/api/v1/prediction/2e6124c2-94cc-400e-b870-8412f0c78868",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    )
    const result: FlowiseResponse = await response.json()
    return result
  }

  /**
   * Handles sending a message to the AI
   */
  const handleSendMessage = async (): Promise<void> => {
    if (input.trim()) {
      // Check if message limit is exceeded
      if (isLimitExceeded) {
        window.location.href = "/pricing"
        return
      }

      const userMessageText = input.trim()
      const userMessage: Message = {
        role: "user",
        content: userMessageText,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      const currentChat = chats.find((chat) => chat.id === activeChat)
      if (currentChat && (currentChat.title === "New Chat" || currentChat.title === "Chat Title")) {
        updateChatTitle(activeChat, userMessageText)
      }

      setInput("")
      setIsLoading(true)

      try {
        const recentMessages = messages.slice(-10).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

        const conversationHistory = recentMessages
          .map((msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`)
          .join("\n")

        const response = await query({
          question: userMessageText,
          overrideConfig: {
            systemMessage: "You are BearisterAI, a helpful legal assistant. Provide accurate and helpful information.",
            maxIterations: 1,
            enableDetailedStreaming: true,
            sessionId: sessionId,
            history: conversationHistory,
          },
        })

        if (response && response.text) {
          const isCode =
            response.text.includes("```") ||
            response.text.includes("def ") ||
            response.text.includes("function ") ||
            response.text.includes("class ")

          const aiMessage: Message = {
            role: "assistant",
            content: response.text,
            isCode: isCode,
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, aiMessage])

          // Increment message count after successful response
          incrementMessageCount()
        } else {
          const errorMessage: Message = {
            role: "assistant",
            content: "I'm sorry, I couldn't process that request.",
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, errorMessage])
        }
      } catch (error) {
        console.error("Error calling Flowise API:", error)
        const errorMessage: Message = {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  /**
   * Creates a new chat
   */
  const handleNewChat = (): void => {
    const newChatId = Date.now().toString()
    const newChat: Chat = { id: newChatId, title: "New Chat", messages: [] }
    setChats((prev) => [newChat, ...prev])
    setActiveChat(newChatId)
    const welcomeMessage: Message = {
      role: "assistant",
      content: `**The Lighthouse Keeper's Discovery**

Every night for thirty years, Eleanor had climbed the spiral stairs to light the beacon at Gull's Rest Lighthouse. The routine never varied—until the night she found the bottle.

It had washed up on the rocky shore below, glinting in the moonlight like a fallen star. Inside was a letter written in a child's careful handwriting:

*"My name is Sam. I'm 8 years old. My dad says you can see your lighthouse from our boat. He's a fisherman but he's been sick and can't work. I'm putting this letter in the ocean hoping you might see it. Do you ever feel lonely up there? I do sometimes."*

Eleanor's weathered hands trembled as she read. She'd spent decades guiding ships safely home, but had never thought about the families aboard them.

That very night, she wrote back: *"Dear Sam, I do see your father's boat sometimes. And yes, I do get lonely. Would you like to be pen pals?"*

She sealed her letter in the same bottle and cast it out with the morning tide.

For months, letters traveled back and forth with the currents. Sam wrote about school, his father's recovery, and his dreams of becoming a lighthouse keeper himself. Eleanor shared stories of storms weathered and ships guided home.

One evening, a small fishing boat approached the lighthouse. A man waved from the deck, and beside him stood a boy holding a bottle up to catch the light.

Eleanor smiled and flashed the beacon three times—their secret signal.

Sometimes the most important ships you guide home carry friendship aboard.`,
      timestamp: new Date().toISOString(),
    }
    setMessages([welcomeMessage])

    const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSessionId(newSessionId)
    console.log("New chat created with session:", newSessionId)

    setIsMobileMenuOpen(false)
  }

  /**
   * Switches to a different chat
   */
  const handleChatSwitch = (chatId: string): void => {
    setActiveChat(chatId)
    const savedMessages = localStorage.getItem(`chat_${chatId}`)
    if (savedMessages) {
      try {
        const parsedMessages: Message[] = JSON.parse(savedMessages)
        setMessages(parsedMessages)
      } catch (error) {
        console.error("Error parsing saved messages:", error)
        const welcomeMessage: Message = {
          role: "assistant",
          content: `**The Lighthouse Keeper's Discovery**

Every night for thirty years, Eleanor had climbed the spiral stairs to light the beacon at Gull's Rest Lighthouse. The routine never varied—until the night she found the bottle.

It had washed up on the rocky shore below, glinting in the moonlight like a fallen star. Inside was a letter written in a child's careful handwriting:

*"My name is Sam. I'm 8 years old. My dad says you can see your lighthouse from our boat. He's a fisherman but he's been sick and can't work. I'm putting this letter in the ocean hoping you might see it. Do you ever feel lonely up there? I do sometimes."*

Eleanor's weathered hands trembled as she read. She'd spent decades guiding ships safely home, but had never thought about the families aboard them.

That very night, she wrote back: *"Dear Sam, I do see your father's boat sometimes. And yes, I do get lonely. Would you like to be pen pals?"*

She sealed her letter in the same bottle and cast it out with the morning tide.

For months, letters traveled back and forth with the currents. Sam wrote about school, his father's recovery, and his dreams of becoming a lighthouse keeper himself. Eleanor shared stories of storms weathered and ships guided home.

One evening, a small fishing boat approached the lighthouse. A man waved from the deck, and beside him stood a boy holding a bottle up to catch the light.

Eleanor smiled and flashed the beacon three times—their secret signal.

Sometimes the most important ships you guide home carry friendship aboard.`,
          timestamp: new Date().toISOString(),
        }
        setMessages([welcomeMessage])
      }
    } else {
      const welcomeMessage: Message = {
        role: "assistant",
        content: `**The Lighthouse Keeper's Discovery**

Every night for thirty years, Eleanor had climbed the spiral stairs to light the beacon at Gull's Rest Lighthouse. The routine never varied—until the night she found the bottle.

It had washed up on the rocky shore below, glinting in the moonlight like a fallen star. Inside was a letter written in a child's careful handwriting:

*"My name is Sam. I'm 8 years old. My dad says you can see your lighthouse from our boat. He's a fisherman but he's been sick and can't work. I'm putting this letter in the ocean hoping you might see it. Do you ever feel lonely up there? I do sometimes."*

Eleanor's weathered hands trembled as she read. She'd spent decades guiding ships safely home, but had never thought about the families aboard them.

That very night, she wrote back: *"Dear Sam, I do see your father's boat sometimes. And yes, I do get lonely. Would you like to be pen pals?"*

She sealed her letter in the same bottle and cast it out with the morning tide.

For months, letters traveled back and forth with the currents. Sam wrote about school, his father's recovery, and his dreams of becoming a lighthouse keeper himself. Eleanor shared stories of storms weathered and ships guided home.

One evening, a small fishing boat approached the lighthouse. A man waved from the deck, and beside him stood a boy holding a bottle up to catch the light.

Eleanor smiled and flashed the beacon three times—their secret signal.

Sometimes the most important ships you guide home carry friendship aboard.`,
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }
    setIsMobileMenuOpen(false)
  }

  /**
   * Handles keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  /**
   * Toggles mobile menu
   */
  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  /**
   * Handles deleting a chat with confirmation
   */
  const handleDeleteChat = (chatId: string): void => {
    // Don't allow deleting if it's the only chat
    if (chats.length <= 1) {
      return
    }

    // Remove the chat from the list
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId))

    // Remove chat data from localStorage
    localStorage.removeItem(`chat_${chatId}`)

    // If we're deleting the active chat, switch to another one
    if (chatId === activeChat) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId)
      if (remainingChats.length > 0) {
        handleChatSwitch(remainingChats[0].id)
      }
    }

    // Close confirmation dialog and menu
    setShowDeleteConfirm(null)
    setChatMenuOpen(null)
  }

  /**
   * Shows delete confirmation dialog
   */
  const showDeleteConfirmation = (chatId: string): void => {
    setShowDeleteConfirm(chatId)
    setChatMenuOpen(null)
  }

  /**
   * Toggles chat menu
   */
  const toggleChatMenu = (chatId: string, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    setChatMenuOpen(chatMenuOpen === chatId ? null : chatId)
  }

  // Responsive values based on screen size
  const getResponsiveValues = () => {
    if (windowWidth <= 480) {
      // Extra small mobile
      return {
        containerPadding: "8px",
        borderRadius: "8px",
        sidebarWidth: "260px",
        headerPadding: "8px 12px",
        chatPadding: "60px 8px 8px 8px",
        inputPadding: "8px",
        fontSize: {
          title: "16px",
          message: "13px",
          input: "14px",
          button: "12px",
          timestamp: "10px",
        },
        iconSize: {
          logo: "28px",
          logoInner: "18px",
          button: "18px",
          thinkingLogo: "32px",
        },
        spacing: {
          messageGap: "12px",
          messagePadding: "10px",
          buttonPadding: "6px 12px",
        },
      }
    } else if (windowWidth <= 768) {
      // Mobile
      return {
        containerPadding: "10px",
        borderRadius: "12px",
        sidebarWidth: "270px",
        headerPadding: "10px 14px",
        chatPadding: "68px 10px 10px 10px",
        inputPadding: "10px",
        fontSize: {
          title: "18px",
          message: "14px",
          input: "14px",
          button: "13px",
          timestamp: "11px",
        },
        iconSize: {
          logo: "32px",
          logoInner: "20px",
          button: "20px",
          thinkingLogo: "36px",
        },
        spacing: {
          messageGap: "14px",
          messagePadding: "12px",
          buttonPadding: "8px 14px",
        },
      }
    } else if (windowWidth <= 1024) {
      // Tablet
      return {
        containerPadding: "16px",
        borderRadius: "16px",
        sidebarWidth: "240px",
        headerPadding: "12px 16px",
        chatPadding: "76px 14px 14px 14px",
        inputPadding: "14px",
        fontSize: {
          title: "20px",
          message: "15px",
          input: "14px",
          button: "14px",
          timestamp: "12px",
        },
        iconSize: {
          logo: "36px",
          logoInner: "22px",
          button: "20px",
          thinkingLogo: "40px",
        },
        spacing: {
          messageGap: "16px",
          messagePadding: "14px",
          buttonPadding: "8px 16px",
        },
      }
    } else if (windowWidth <= 1440) {
      // Desktop
      return {
        containerPadding: "20px",
        borderRadius: "20px",
        sidebarWidth: "250px",
        headerPadding: "14px 18px",
        chatPadding: "84px 16px 16px 16px",
        inputPadding: "16px",
        fontSize: {
          title: "22px",
          message: "16px",
          input: "14px",
          button: "14px",
          timestamp: "12px",
        },
        iconSize: {
          logo: "40px",
          logoInner: "24px",
          button: "20px",
          thinkingLogo: "44px",
        },
        spacing: {
          messageGap: "18px",
          messagePadding: "16px",
          buttonPadding: "8px 16px",
        },
      }
    } else {
      // Large desktop
      return {
        containerPadding: "24px",
        borderRadius: "24px",
        sidebarWidth: "280px",
        headerPadding: "16px 20px",
        chatPadding: "92px 20px 20px 20px",
        inputPadding: "18px",
        fontSize: {
          title: "24px",
          message: "16px",
          input: "15px",
          button: "14px",
          timestamp: "12px",
        },
        iconSize: {
          logo: "44px",
          logoInner: "26px",
          button: "22px",
          thinkingLogo: "48px",
        },
        spacing: {
          messageGap: "20px",
          messagePadding: "18px",
          buttonPadding: "10px 18px",
        },
      }
    }
  }

  const responsive = getResponsiveValues()
  const isMobile = windowWidth < 1024

  // Close chat menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (): void => {
      setChatMenuOpen(null)
    }

    if (chatMenuOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [chatMenuOpen])

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background-color: #0c0c1d;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          overflow-x: hidden;
        }
        
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chat-container {
          scroll-behavior: smooth;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 20;
        }

        /* Responsive text scaling */
        @media (max-width: 480px) {
          html {
            font-size: 14px;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          html {
            font-size: 15px;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          html {
            font-size: 16px;
          }
        }

        @media (min-width: 1025px) {
          html {
            font-size: 16px;
          }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
          background: "linear-gradient(135deg, #1a103c 0%, #0c0c1d 50%, #3d1a1a 100%)",
          justifyContent: "center",
          alignItems: "center",
          padding: responsive.containerPadding,
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth:
              windowWidth <= 480 ? "100%" : windowWidth <= 768 ? "100%" : windowWidth <= 1024 ? "100%" : "1200px",
            height: isMobile ? "100%" : "90vh",
            minHeight: isMobile ? "100vh" : "600px",
            borderRadius: responsive.borderRadius,
            overflow: "hidden",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
            position: "relative",
          }}
        >
          {/* Mobile Overlay */}
          {isMobileMenuOpen && isMobile && (
            <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          )}

          {/* Left Sidebar */}
          <div
            style={{
              width: responsive.sidebarWidth,
              backgroundColor: "#0D101A",
              display: "flex",
              flexDirection: "column",
              padding: "16px",
              position: isMobile ? "fixed" : "relative",
              top: 0,
              left: 0,
              height: "100%",
              zIndex: 30,
              transform: isMobile ? (isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)") : "none",
              transition: "transform 0.3s ease",
            }}
          >
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X style={{ width: responsive.iconSize.button, height: responsive.iconSize.button }} />
              </button>
            )}

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: responsive.spacing.buttonPadding,
                borderRadius: "9999px",
                backgroundColor: "transparent",
                color: "#c084fc",
                border: "1px solid #4b5563",
                cursor: "pointer",
                fontSize: responsive.fontSize.button,
                width: "100%",
                marginBottom: "16px",
                marginTop: isMobile ? "40px" : "0",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(192, 132, 252, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <Plus style={{ width: "16px", height: "16px" }} />
              New Chat
            </button>

            {/* Upgrade Plan Button */}
            <div style={{ marginBottom: "16px" }}>
              <UpgradeButton />
            </div>

            {/* Chat History */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", flex: 1 }}>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={() => handleChatSwitch(chat.id)}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      paddingRight: "40px",
                      borderRadius: "6px",
                      backgroundColor: chat.id === activeChat ? "#1a1a2e" : "transparent",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: responsive.fontSize.button,
                      width: "100%",
                      transition: "all 0.2s ease",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (chat.id !== activeChat) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (chat.id !== activeChat) {
                        e.currentTarget.style.backgroundColor = "transparent"
                      }
                    }}
                  >
                    {chat.title}
                  </button>

                  {/* Chat Menu Button */}
                  <button
                    onClick={(e) => toggleChatMenu(chat.id, e)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#9ca3af",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "4px",
                      opacity: chatMenuOpen === chat.id || chat.id === activeChat ? 1 : 0,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                      e.currentTarget.style.opacity = "1"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      if (chatMenuOpen !== chat.id && chat.id !== activeChat) {
                        e.currentTarget.style.opacity = "0"
                      }
                    }}
                  >
                    <MoreVertical style={{ width: "14px", height: "14px" }} />
                  </button>

                  {/* Chat Menu Dropdown */}
                  {chatMenuOpen === chat.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "100%",
                        zIndex: 50,
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #374151",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        minWidth: "120px",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => showDeleteConfirmation(chat.id)}
                        disabled={chats.length <= 1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "8px 12px",
                          backgroundColor: "transparent",
                          color: chats.length <= 1 ? "#6b7280" : "#ef4444",
                          border: "none",
                          cursor: chats.length <= 1 ? "not-allowed" : "pointer",
                          fontSize: "13px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (chats.length > 1) {
                            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <Trash2 style={{ width: "14px", height: "14px" }} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#050D16",
              position: "relative",
              width: isMobile ? "100%" : "auto",
            }}
          >
            {/* Top Header Bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: responsive.headerPadding,
                zIndex: 10,
                backgroundColor: "#121826",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={toggleMobileMenu}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <Menu style={{ width: responsive.iconSize.button, height: responsive.iconSize.button }} />
                </button>
              )}

              {/* Empty space for desktop - removed to allow left alignment */}
              {!isMobile && <div></div>}

              {/* Logo and Title */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-start" }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: responsive.iconSize.logo,
                      height: responsive.iconSize.logo,
                      borderRadius: "50%",
                      backgroundColor: "#1a1a2e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src="https://i.ibb.co/cKpJxnsT/A55-C04-B3-FD56-4367-93-C6-DF68-E80-C9-FC4-1-removebg-preview.png"
                      alt="BearisterAI Logo"
                      width={30}
                      height={30}
                      style={{ borderRadius: "50%" }}
                    />

                  </div>
                </div>
                <h1
                  style={{
                    fontSize: responsive.fontSize.title,
                    fontWeight: "bold",
                    background: "linear-gradient(to right, #a855f7, #f97316)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  BearisterAI
                </h1>
              </div>

              {/* Plan Badge and User Icon */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Plan Badge */}
                <PlanBadge />

                {/* Home Button */}
                <button
                  style={{
                    borderRadius: "50%",
                    padding: "8px",
                    backgroundColor: "#1a1a2e",
                    color: "#9ca3af",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#252540"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1a1a2e"
                  }}
                >
                 <Link href={'/'} > <Home style={{ width: responsive.iconSize.button, height: responsive.iconSize.button }} /></Link>
                </button>

                <button
                  style={{
                    borderRadius: "50%",
                    padding: "8px",
                    backgroundColor: "#1a1a2e",
                    color: "#9ca3af",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#252540"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1a1a2e"
                  }}
                >
                  <UserButton />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="chat-container"
              style={{
                flex: 1,
                overflow: "auto",
                padding: responsive.chatPadding,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: responsive.spacing.messageGap }}>
                {messages.map((message, i) => (
                  <div
                    key={i}
                    style={{
                      maxWidth: windowWidth <= 480 ? "95%" : windowWidth <= 768 ? "90%" : "85%",
                      marginLeft: message.role === "user" ? "auto" : "0",
                      marginRight: message.role === "assistant" ? "auto" : "0",
                      animation: "fadeIn 0.3s ease-in",
                    }}
                  >
                    {/* Message Content */}
                    <div
                      style={{
                        padding: responsive.spacing.messagePadding,
                        backgroundColor: message.role === "user" ? "#e67928" : "#252540",
                        color: "white",
                        borderRadius: "16px",
                        borderBottomRightRadius: message.role === "user" ? "4px" : "16px",
                        borderBottomLeftRadius: message.role === "assistant" ? "4px" : "16px",
                        fontSize: responsive.fontSize.message,
                        lineHeight: "1.5",
                        wordBreak: "break-word",
                      }}
                    >
                      {message.isCode ? (
                        <pre
                          style={{
                            fontSize: windowWidth <= 480 ? "11px" : windowWidth <= 768 ? "12px" : "14px",
                            fontFamily: "monospace",
                            backgroundColor: "#1a1a2e",
                            padding: windowWidth <= 480 ? "6px" : windowWidth <= 768 ? "8px" : "12px",
                            borderRadius: "6px",
                            overflow: "auto",
                            margin: 0,
                          }}
                        >
                          <code style={{ color: "#d1d5db" }}>
                            {message.content.includes("def ") ? (
                              <>
                                <span style={{ color: "#9ca3af" }}>def</span>{" "}
                                <span style={{ color: "#a855f7" }}>example_function</span>
                                <span style={{ color: "white" }}>{"();"}</span>
                                <br />
                                <span style={{ color: "#9ca3af" }}>print</span>
                                <span style={{ color: "white" }}>{"("}</span>
                                <span style={{ color: "#f97316" }}>{'"Hello, world!"'}</span>
                                <span style={{ color: "white" }}>{")"}</span>
                              </>
                            ) : (
                              message.content
                            )}
                          </code>
                        </pre>
                      ) : (
                        <div style={{ margin: 0, lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                          {message.content.split("\n").map((line, index) => (
                            <span key={index}>
                              {line.startsWith("**") && line.endsWith("**") ? (
                                <strong style={{ fontSize: "1.1em", color: "#f97316" }}>{line.slice(2, -2)}</strong>
                              ) : line.startsWith("*") && line.endsWith("*") ? (
                                <em style={{ fontStyle: "italic", color: "#c084fc" }}>{line.slice(1, -1)}</em>
                              ) : (
                                line
                              )}
                              {index < message.content.split("\n").length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div
                      style={{
                        fontSize: responsive.fontSize.timestamp,
                        color: "#9ca3af",
                        marginTop: "4px",
                        textAlign: message.role === "user" ? "right" : "left",
                        opacity: 0.7,
                      }}
                    >
                      {message.timestamp ? formatTimestamp(message.timestamp) : ""}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="animate-bounce" >
                    <Image
                        src="https://i.ibb.co/cKpJxnsT/A55-C04-B3-FD56-4367-93-C6-DF68-E80-C9-FC4-1-removebg-preview.png"
                        alt="Thinking BearisterAI Logo"   
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%", marginRight: "8px" }}
                        />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div style={{ padding: responsive.inputPadding, backgroundColor: "#121826" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Input Field Container */}
                <div style={{ position: "relative", display: "flex", alignItems: "center", flex: 1 }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Brief your Bearister..."
                    disabled={isLoading || isLimitExceeded}
                    style={{
                      width: "100%",
                      paddingLeft: windowWidth <= 480 ? "16px" : windowWidth <= 768 ? "18px" : "20px",
                      paddingRight: windowWidth <= 480 ? "50px" : windowWidth <= 768 ? "55px" : "60px",
                      paddingTop: windowWidth <= 480 ? "12px" : windowWidth <= 768 ? "14px" : "16px",
                      paddingBottom: windowWidth <= 480 ? "12px" : windowWidth <= 768 ? "14px" : "16px",
                      backgroundColor: isLimitExceeded ? "#1a1a2e80" : "#1a1a2e",
                      border: "none",
                      color: "white",
                      borderRadius: "25px",
                      outline: "none",
                      fontSize: responsive.fontSize.input,
                      transition: "all 0.2s ease",
                    }}
                  />

                  {/* Attachment/Download Icon */}
                  <button
                    style={{
                      position: "absolute",
                      right: windowWidth <= 480 ? "12px" : windowWidth <= 768 ? "14px" : "16px",
                      background: "none",
                      border: "none",
                      color: "#9ca3af",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: isLimitExceeded ? 0.5 : 1,
                      pointerEvents: isLimitExceeded ? "none" : "auto",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLimitExceeded) {
                        e.currentTarget.style.color = "#c084fc"
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#9ca3af"
                    }}
                  >
                    <svg
                      width={windowWidth <= 480 ? "16px" : windowWidth <= 768 ? "18px" : "20px"}
                      height={windowWidth <= 480 ? "16px" : windowWidth <= 768 ? "18px" : "20px"}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim() || isLimitExceeded}
                  style={{
                    borderRadius: "50%",
                    padding: windowWidth <= 480 ? "10px" : windowWidth <= 768 ? "12px" : "14px",
                    background: isLimitExceeded
                      ? "linear-gradient(135deg, #9333ea80, #f9731680)"
                      : "linear-gradient(135deg, #9333ea, #f97316)",
                    border: "none",
                    cursor: isLoading || !input.trim() || isLimitExceeded ? "default" : "pointer",
                    opacity: isLoading || !input.trim() || isLimitExceeded ? 0.5 : 1,
                    transition: "all 0.2s ease",
                    transform: "scale(1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim() && !isLimitExceeded) {
                      e.currentTarget.style.transform = "scale(1.05)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  <svg
                    width={windowWidth <= 480 ? "16px" : windowWidth <= 768 ? "18px" : "20px"}
                    height={windowWidth <= 480 ? "16px" : windowWidth <= 768 ? "18px" : "20px"}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="white" />
                  </svg>
                </button>
              </div>

              {/* Message Limit Indicator */}
              {isLimitExceeded && (
                <div
                  style={{
                    marginTop: "8px",
                    textAlign: "center",
                    color: "#f97316",
                    fontSize: responsive.fontSize.timestamp,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <Zap size={12} />
                  <span>
                    Message limit reached.{" "}
                    <button
                      onClick={() => (window.location.href = "/pricing")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#c084fc",
                        cursor: "pointer",
                        padding: "0",
                        fontSize: "inherit",
                        textDecoration: "underline",
                      }}
                    >
                      Upgrade your plan
                    </button>{" "}
                    to continue.
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                padding: "20px",
              }}
              onClick={() => setShowDeleteConfirm(null)}
            >
              <div
                style={{
                  backgroundColor: "#1a1a2e",
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: "400px",
                  width: "100%",
                  border: "1px solid #374151",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      borderRadius: "50%",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 style={{ width: "20px", height: "20px", color: "#ef4444" }} />
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "white",
                      margin: 0,
                    }}
                  >
                    Delete Chat
                  </h3>
                </div>

                <p
                  style={{
                    color: "#d1d5db",
                    marginBottom: "20px",
                    lineHeight: "1.5",
                    margin: "0 0 20px 0",
                  }}
                >
                  Are you sure you want to delete this chat? This action cannot be undone and all messages will be
                  permanently removed.
                </p>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid #4b5563",
                      backgroundColor: "transparent",
                      color: "#d1d5db",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteChat(showDeleteConfirm)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#ef4444",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dc2626"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ef4444"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}
