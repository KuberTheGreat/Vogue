"use client"

export default function Architecture() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Platform
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Architecture{" "}
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built on Story Protocol for robust IP management with integrated DeFi mechanisms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Architecture Diagram */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="space-y-6">
                {/* Layer 1 */}
                <div className="flex items-center space-x-4 p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Story Protocol Layer</span>
                </div>

                {/* Layer 2 */}
                <div className="flex items-center space-x-4 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30 ml-8">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">IP Registration & Licensing</span>
                </div>

                {/* Layer 3 */}
                <div className="flex items-center space-x-4 p-4 bg-green-500/20 rounded-xl border border-green-500/30 ml-16">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">DeFi Integration Layer</span>
                </div>

                {/* Layer 4 */}
                <div className="flex items-center space-x-4 p-4 bg-pink-500/20 rounded-xl border border-pink-500/30 ml-8">
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Frontend Application</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Key Benefits */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">🔒 Immutable IP Rights</h3>
              <p className="text-gray-300">
                Every design is registered on-chain with cryptographic proof of ownership, creation timestamp, and
                licensing terms that cannot be altered.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">⚡ Automated Royalties</h3>
              <p className="text-gray-300">
                Smart contracts automatically distribute royalties to all contributors in the creation chain, ensuring
                fair compensation for derivative works.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">🌐 Global Marketplace</h3>
              <p className="text-gray-300">
                Connect with fashion brands worldwide through our integrated licensing marketplace with transparent
                pricing and instant settlements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
