"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import Toast, { type ToastData } from "./etrike-toast"

interface ToastContextType {
  showToast: (toast: Omit<ToastData, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const generateId = useCallback(() => {
    // Fallback for environments where crypto.randomUUID is not available
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    // Fallback ID generation
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }, [])

  const showToast = useCallback(
    (toastData: Omit<ToastData, "id">) => {
      if (!mounted) return // Don't show toasts during SSR

      const id = generateId()
      const newToast: ToastData = {
        ...toastData,
        id,
        duration: toastData.duration ?? 5000,
      }

      setToasts((prev) => [...prev, newToast])
    },
    [mounted, generateId],
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {mounted && (
        <div className="fixed bottom-4 right-4 z-[9999] space-y-3 pointer-events-none">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto max-w-sm w-full">
              <Toast toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

// Custom hook for easier toast usage with SSR safety
export const useETrikeToast = () => {
  const { showToast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return no-op functions during SSR
  const safeShowToast = useCallback(
    (toastData: Omit<ToastData, "id">) => {
      if (mounted) {
        showToast(toastData)
      }
    },
    [mounted, showToast],
  )

  return {
    success: (title: string, message?: string, action?: ToastData["action"]) =>
      safeShowToast({ type: "success", title, message, action }),

    error: (title: string, message?: string, action?: ToastData["action"]) =>
      safeShowToast({ type: "error", title, message, action }),

    warning: (title: string, message?: string, action?: ToastData["action"]) =>
      safeShowToast({ type: "warning", title, message, action }),

    info: (title: string, message?: string, action?: ToastData["action"]) =>
      safeShowToast({ type: "info", title, message, action }),

    cartAdded: (productName: string, action?: ToastData["action"]) =>
      safeShowToast({
        type: "success",
        title: "⚡ Added to Cart!",
        message: `${productName} has been added to your cart`,
        action: action ?? {
          label: "View Cart",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/cart"
            }
          },
        },
      }),

    cartUpdated: (message = "Cart updated successfully") =>
      safeShowToast({
        type: "success",
        title: "🔄 Cart Updated",
        message,
      }),

    orderPlaced: (orderNumber: string) =>
      safeShowToast({
        type: "success",
        title: "🎉 Order Placed!",
        message: `Your order #${orderNumber} has been confirmed`,
        duration: 7000,
        action: {
          label: "Track Order",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/orders"
            }
          },
        },
      }),

    authSuccess: (message: string) =>
      safeShowToast({
        type: "success",
        title: "🔐 Welcome!",
        message,
      }),

    powerUp: (title: string, message?: string) =>
      safeShowToast({
        type: "info",
        title: `⚡ ${title}`,
        message,
      }),
  }
}
