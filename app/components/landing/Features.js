"use client"

export default function Features() {
  const features = [
    {
      icon: "🎨",
      title: "IP Registration & Provenance",
      description:
        "Mint your original designs as IP-NFTs with immutable ownership and licensing terms. Establish clear provenance for all your creative work.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "🔄",
      title: "Creative Remix Engine",
      description:
        "Canva-style interface for modifying registered designs. AI-powered suggestions with automated royalty distribution to original creators.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "💰",
      title: "DeFi Integration",
      description:
        "Stake $THREAD tokens on promising designs, earn from fractional ownership, and participate in automated royalty distribution.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: "🏪",
      title: "Commercial Licensing",
      description:
        "Direct licensing marketplace for fashion brands. Smart contracts automate payments to all stakeholders in the creation chain.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: "📊",
      title: "Creator Economy",
      description:
        "Reputation scoring, seasonal competitions, and governance voting. Build your profile and unlock premium features.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: "🔗",
      title: "Multi-Generational Royalties",
      description:
        "Transparent attribution chains ensure all contributors receive fair compensation from derivative works and commercial usage.",
      gradient: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Revolutionizing Fashion
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> IP </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform combines cutting-edge blockchain technology with intuitive design tools to create the future of
            fashion intellectual property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              {/* Gradient Border Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              <div className="relative z-10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>

              {/* Hover Effect */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
