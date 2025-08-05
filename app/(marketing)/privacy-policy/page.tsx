import Link from 'next/link'
import React from 'react'

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen pt-30 bg-white dark:bg-[#1F1F1F] text-gray-800 dark:text-zinc-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for VidMark</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Who We Are</h2>
          <p>
            VidMark is a student-built project for educational purposes. It is accessible at:
            <a
              href="https://vid-mark.vercel.app"
              className="text-blue-600 dark:text-blue-400 underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://vid-mark.vercel.app
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-6">
            <li><strong>Authentication Data:</strong> Google email and user ID for login via Clerk.</li>
            <li><strong>Bookmarks and Notes:</strong> Stored data to enhance your personal experience.</li>
          </ul>
          <p className="mt-2">We do <strong>not</strong> collect or access private YouTube data like playlists or history.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. How We Use the Information</h2>
          <p>The data is used only to:</p>
          <ul className="list-disc pl-6">
            <li>Log you into the app</li>
            <li>Store bookmarks and notes</li>
            <li>Support AI features for video summaries and questions</li>
          </ul>
          <p className="mt-2">We do not sell or share your data.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Third-Party Services</h2>
          <ul className="list-disc pl-6">
            <li><strong>Clerk.dev:</strong> Authentication</li>
            <li><strong>Convex.dev:</strong> Database</li>
            <li><strong>YouTube Data API v3:</strong> Public video data</li>
            <li><strong>Google Gemini:</strong> AI assistance</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. YouTube API Compliance</h2>
          <p>
            By using VidMark, you agree to the
            <Link
              href="https://www.youtube.com/t/terms"
              className="text-blue-600 dark:text-blue-400 underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube Terms of Service
            </Link>
            and
            <Link
              href="https://policies.google.com/privacy"
              className="text-blue-600 dark:text-blue-400 underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </Link>.
          </p>
          <p className="mt-2">
            We follow the
            <Link
              href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
              className="text-blue-600 dark:text-blue-400 underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube API Services Terms of Service
            </Link>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Data Storage and Security</h2>
          <p>
            Your data is stored securely and only accessible to you. As a student project, security measures are in place but not enterprise-level.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this policy in the future. Continued use of the app means you accept the latest version.
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
