'use client'

import React from 'react'
import { Wallet, PiggyBank, Heart } from 'lucide-react'
import { JarType } from '@/lib/supabase/types'

interface JarProps {
  type: JarType
  balance: number
  maxAmount?: number
}

const jarConfig = {
  spend: {
    label: 'Spend',
    icon: Wallet,
    color: 'bg-jar-spend',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-blue-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
    fillColor: 'bg-blue-400',
  },
  save: {
    label: 'Save',
    icon: PiggyBank,
    color: 'bg-jar-save',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-green-600',
    borderColor: 'border-green-500',
    textColor: 'text-green-600',
    fillColor: 'bg-green-400',
  },
  give: {
    label: 'Give',
    icon: Heart,
    color: 'bg-jar-give',
    gradientFrom: 'from-red-400',
    gradientTo: 'to-red-600',
    borderColor: 'border-red-500',
    textColor: 'text-red-600',
    fillColor: 'bg-red-400',
  },
}

export function Jar({ type, balance, maxAmount = 1000 }: JarProps) {
  const config = jarConfig[type]
  const Icon = config.icon
  const fillPercentage = Math.min((balance / maxAmount) * 100, 100)

  return (
    <div className="group relative flex flex-col items-center">
      {/* Icon and Label */}
      <div className="mb-4 flex flex-col items-center">
        <div className={`rounded-full bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} p-4 shadow-lg transition-transform group-hover:scale-110`}>
          <Icon className="h-10 w-10 text-white" />
        </div>
        <h3 className={`mt-2 text-2xl font-bold ${config.textColor}`}>
          {config.label}
        </h3>
      </div>

      {/* Jar Container */}
      <div className="relative">
        {/* Jar Shape */}
        <div className={`relative h-64 w-48 rounded-3xl border-4 ${config.borderColor} bg-white/90 shadow-xl transition-all group-hover:shadow-2xl`}>
          {/* Jar Neck */}
          <div className={`absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rounded-t-2xl border-4 border-b-0 ${config.borderColor} bg-white/90`} />
          
          {/* Jar Lid */}
          <div className={`absolute -top-8 left-1/2 h-4 w-28 -translate-x-1/2 rounded-full border-4 ${config.borderColor} bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`} />
          
          {/* Liquid Fill */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-2xl">
            <div
              className={`${config.fillColor} opacity-60 transition-all duration-1000 ease-out`}
              style={{
                height: `${fillPercentage * 2.56}px`,
                animation: 'wave 3s ease-in-out infinite',
              }}
            >
              {/* Wave Effect */}
              <div className="absolute inset-x-0 top-0 h-4">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path
                    d="M0 5 Q 25 0 50 5 T 100 5 L 100 10 L 0 10 Z"
                    fill="currentColor"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="d"
                      values="M0 5 Q 25 0 50 5 T 100 5 L 100 10 L 0 10 Z;
                              M0 5 Q 25 10 50 5 T 100 5 L 100 10 L 0 10 Z;
                              M0 5 Q 25 0 50 5 T 100 5 L 100 10 L 0 10 Z"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
            </div>
          </div>

          {/* Balance Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/95 px-4 py-2 shadow-lg">
              <p className={`text-3xl font-bold ${config.textColor}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Percentage Label */}
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-gray-600">
            {fillPercentage.toFixed(0)}% Full
          </p>
        </div>
      </div>
    </div>
  )
}