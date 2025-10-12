export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Dashboards SaaS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered analytics dashboard for small businesses and creators
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Get Started
            </button>
            <button className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
