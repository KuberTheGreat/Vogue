"use client"

export default function VogueLogo({ size = "medium", className = "" }) {
  const sizes = {
    small: "w-32 h-12",
    medium: "w-48 h-18",
    large: "w-64 h-24",
    xl: "w-80 h-30",
  }

  return (
    <div className={`${sizes[size]} ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 320 96" className="w-full h-full">
        {/* Background Gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F3E8FF" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* Logo Icon - Stylized V */}
        <g transform="translate(10, 10)">
          <path d="M0 10 L20 60 L40 10 L30 10 L20 40 L10 10 Z" fill="url(#logoGradient)" className="drop-shadow-lg" />
          <circle cx="20" cy="25" r="3" fill="white" opacity="0.8" />
        </g>

        {/* Text "VOGUE" */}
        <g transform="translate(70, 20)">
          <text
            x="0"
            y="40"
            fontSize="36"
            fontWeight="bold"
            fontFamily="Inter, sans-serif"
            fill="url(#textGradient)"
            className="drop-shadow-sm"
          >
            VOGUE
          </text>
          <text
            x="0"
            y="60"
            fontSize="12"
            fontWeight="300"
            fontFamily="Inter, sans-serif"
            fill="white"
            opacity="0.7"
            letterSpacing="2px"
          >
            FASHION IP PLATFORM
          </text>
        </g>

        {/* Decorative Elements */}
        <circle cx="280" cy="20" r="2" fill="url(#logoGradient)" opacity="0.6" />
        <circle cx="290" cy="30" r="1.5" fill="url(#logoGradient)" opacity="0.4" />
        <circle cx="300" cy="25" r="1" fill="url(#logoGradient)" opacity="0.8" />
      </svg>
    </div>
  )
}
