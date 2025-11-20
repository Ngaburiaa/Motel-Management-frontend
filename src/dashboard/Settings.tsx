import { useState } from "react";
import {
  MailCheck,
  MailX,
  Trash2,
  Shield,
  User,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export const Settings = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [subscribed, setSubscribed] = useState(true);
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  // const handleVerifyEmail = () => {
  //   setEmailVerified(true);
  //   toast.success("Verification email sent");
  // };

  const handleNewsletterToggle = () => {
    setSubscribed((prev) => !prev);
    toast(
      subscribed ? "Unsubscribed from newsletter" : "Subscribed to newsletter"
    );
  };

  const handlePasswordReset = () => {
    // Replace this with your actual logout and redirect logic
    toast("Redirecting to password reset page...");
    setTimeout(() => {
      // Example: redirect to /reset-password
      window.location.href = "/reset-password";
    }, 1000);
  };

  const handleDeleteAccount = () => {
    toast.error("Your account is being processed for deletion.");
    // Add actual deletion logic here
  };

  const TabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-8">
            {/* Change Email */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MailCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Change Email
                  </h3>
                  <p className="text-sm text-gray-500">
                    Update your email address
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter new email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <button
                  onClick={() => {
                    if (!email) return;
                    toast.success("Email updated successfully");
                    setEmail("");
                  }}
                  disabled={!email}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Update Email
                </button>
              </div>
            </div>

            {/* Verify Email */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Verify Email
                  </h3>
                  <p className="text-sm text-gray-500">
                    Check if your email is verified
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      emailVerified ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Email Status: {emailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                {!emailVerified && (
                  <button
                    onClick={() => {
                      setEmailVerified(true);
                      toast.success("Verification email sent");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Send Verification
                  </button>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Newsletter
                  </h3>
                  <p className="text-sm text-gray-500">
                    Stay updated with product news and promotions
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      subscribed ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {subscribed
                      ? "You are subscribed"
                      : "You are not subscribed"}
                  </span>
                </div>
                <button
                  onClick={handleNewsletterToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    subscribed
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {subscribed ? (
                    <>
                      <MailX className="w-4 h-4" />
                      Unsubscribe
                    </>
                  ) : (
                    <>
                      <MailCheck className="w-4 h-4" />
                      Subscribe
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-8">
            {/* Password Reset */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reset Password
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click below to reset your password
                  </p>
                </div>
              </div>

              <button
                onClick={handlePasswordReset}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Reset Password
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-red-700">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-red-700 mb-4">
                Permanently delete your account and all associated data.
              </p>

              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-gray-200 rounded-xl mb-8 shadow-sm">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <TabContent />
      </div>
    </div>
  );
};
