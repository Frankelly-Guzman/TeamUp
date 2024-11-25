import React from 'react';

const UserPolicy = () => {
  return (
    <div className="privacy-policy max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Policy</h1>

      <p className="text-gray-700 mb-4">
        This User Policy explains how we collect, use, and protect your personal information when you use our services. Your privacy is important to us, and we are committed to safeguarding your data.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">1. Information We Collect</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>
          <strong>Personal Information:</strong> When you sign up, we collect your name, email address, and any other details you provide.
        </li>
        <li>
          <strong>Usage Data:</strong> We gather information about how you interact with our platform, such as pages visited, time spent, and other analytics.
        </li>
        <li>
          <strong>Optional Information:</strong> You may provide additional details such as a profile photo, links to social media accounts, or other information to enhance your experience.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>To provide and improve our services.</li>
        <li>To personalize your experience on the platform.</li>
        <li>To communicate updates, notifications, and promotional offers (if you opt-in).</li>
        <li>To analyze usage trends and improve platform performance.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">3. How We Protect Your Information</h2>
      <p className="text-gray-700 mb-4">
        We use industry-standard security measures to protect your personal data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">4. Sharing of Information</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>We do not sell or rent your personal information to third parties.</li>
        <li>We may share data with service providers who assist in platform operations (e.g., analytics tools), under strict confidentiality agreements.</li>
        <li>We may disclose information if required by law or to protect the safety of our users and services.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">5. Your Choices and Rights</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>
          <strong>Access and Update:</strong> You can access and update your profile information through your account settings.
        </li>
        <li>
          <strong>Delete Your Account:</strong> You can request the deletion of your account and associated data at any time.
        </li>
        <li>
          <strong>Opt-Out:</strong> You can unsubscribe from promotional emails by following the instructions in those communications.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">6. Changes to This Privacy Policy</h2>
      <p className="text-gray-700 mb-4">
        We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this page periodically for the latest information.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">7. Contact Us</h2>
      <p className="text-gray-700">
        If you have any questions or concerns about this Privacy Policy, please contact us at <strong>FrankellyRGuzman@gmail.com</strong>.
      </p>
    </div>
  );
};

export default UserPolicy;