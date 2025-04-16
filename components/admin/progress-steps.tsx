import React from "react"
import { cn } from "@/lib/utils"

interface ProgressStepsProps {
  currentStep: number
  steps: {
    number: number
    title: string
    description: string
  }[]
}

export default function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-medium",
                  currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600",
                )}
              >
                {step.number}
              </div>
              <div className="ml-2">
                <div className="font-medium">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-24 h-1 bg-gray-200 mx-4">
                <div className="h-full bg-blue-600" style={{ width: currentStep > step.number ? "100%" : "0%" }}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
