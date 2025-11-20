import { User, Phone, Mail, FileText, Shield } from "lucide-react";

interface InfoProps {
  firstName: string;
  lastName: string;
  bio?: string;
  contactPhone?: string;
  email: string;
  role?: string;
}

export const ProfileInfoDisplay = ({
  firstName,
  lastName,
  bio,
  contactPhone,
  email,
  role,
}: InfoProps) => {
  const infoItems = [
    {
      icon: User,
      label: "Full Name",
      value: `${firstName} ${lastName}`,
      required: true,
    },
    {
      icon: Mail,
      label: "Email Address",
      value: email,
      required: true,
    },
    {
      icon: Phone,
      label: "Contact Phone",
      value: contactPhone || "Not provided",
      isEmpty: !contactPhone,
      required: false,
    },
    {
      icon: Shield,
      label: "Role",
      value: role || "User",
      required: false,
    },
    {
      icon: FileText,
      label: "Bio",
      value: bio || "No bio available",
      isEmpty: !bio,
      required: false,
      fullWidth: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Grid Layout for main info */}
      <div className="grid md:grid-cols-2 gap-6">
        {infoItems
          .filter(item => !item.fullWidth)
          .map((item, index) => (
            <div key={index} className="group">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.label}
                    {item.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className={`text-sm ${
                    item.isEmpty 
                      ? "text-gray-400 italic" 
                      : "text-gray-900 font-medium"
                  } break-words`}>
                    {item.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Full Width Bio Section */}
      {infoItems
        .filter(item => item.fullWidth)
        .map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <item.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {item.label}
                </label>
                <div className={`text-sm leading-relaxed ${
                  item.isEmpty 
                    ? "text-gray-400 italic" 
                    : "text-gray-900"
                } p-4 bg-gray-50 rounded-lg border border-gray-200`}>
                  {item.value}
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Status Indicators */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Profile Complete
          </div>
          {contactPhone && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              <Phone className="w-3 h-3 mr-1" />
              Phone Verified
            </div>
          )}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
            <Mail className="w-3 h-3 mr-1" />
            Email Verified
          </div>
        </div>
      </div>
    </div>
  );
};