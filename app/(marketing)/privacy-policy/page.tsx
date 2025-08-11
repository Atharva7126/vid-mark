import Link from 'next/link'
import React from 'react'

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen py-25 bg-white dark:bg-[#1F1F1F] text-gray-800 dark:text-zinc-100 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for VidMark</h1>
        <p className="mb-6"><strong>Effective Date:</strong> August 6, 2025</p>

        {/* 1. Who We Are */}
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

        {/* 2. Information We Collect */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p>We collect the following information to provide our services:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Authentication Data:</strong> Google email and user ID for login via Clerk.</li>
            <li><strong>Bookmarks and Notes:</strong> Video IDs, metadata, and personal notes you add.</li>
            <li><strong>YouTube API Data:</strong> Public video metadata (title, ID, thumbnail) and playlist metadata if accessed.</li>
          </ul>
          <p className="mt-2">We do <strong>not</strong> collect or access your private YouTube data (such as watch history, subscriptions, or private playlists) without your explicit permission.</p>
        </section>

        {/* 3. How We Use and Share Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. How We Use and Share Information</h2>
          <p>Your information is used solely to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Log you into the app securely</li>
            <li>Save and display your bookmarks and notes</li>
            <li>Provide search, viewing, and AI-assisted annotation features</li>
          </ul>
          <p className="mt-2">We do <strong>not</strong> sell, rent, or share your personal data with any third parties. Data processing occurs only within the app and trusted third-party services listed below.</p>
        </section>

        {/* 4. Cookies and Device Data */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Cookies and Device Data</h2>
          <p>
            We use session cookies to maintain your login status via Clerk. These cookies are used only for authentication purposes and are not used for tracking or advertising.
            We do not place or access any additional cookies or device storage beyond what is necessary for app functionality.
          </p>
        </section>

        {/* 5. Third-Party Services */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
          <ul className="list-disc pl-6">
            <li><strong>Clerk.dev:</strong> Authentication</li>
            <li><strong>Convex.dev:</strong> Database</li>
            <li><strong>YouTube Data API v3:</strong> Public video data</li>
            <li><strong>Google Gemini:</strong> AI assistance</li>
          </ul>
        </section>

        {/* 6. YouTube API Compliance */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. YouTube API Compliance</h2>
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

        {/* 7. Authorization Token Storage */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. YouTube Authorization Tokens</h2>
          <p>
            If YouTube authorization tokens are used, they are stored securely for a maximum of 3 months.
            These tokens are used only for the features you explicitly interact with and are never shared with third parties.
            Tokens are not refreshed automatically unless required for active user requests, in accordance with applicable laws and user consent.
          </p>
        </section>

        {/* 8. Data Storage and Security */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Data Storage and Security</h2>
          <p>
            Your data is stored securely and only accessible to you.
            As a student project, security measures are in place but are not enterprise-grade.
          </p>
        </section>

        {/* 9. Changes to This Policy */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Changes to This Policy</h2>
          <p>
            We may update this policy in the future. Continued use of the app means you accept the latest version.
          </p>
        </section>

        {/* 10. Contact */}
        <section>
          <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
          <p>
            If you have questions, contact: <strong>atharvaraut7126@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
