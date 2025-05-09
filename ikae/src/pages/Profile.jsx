import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  ArrowPathIcon,
  LockClosedIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  SwatchIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../components/Auth/useAuth";

const RECENT_ACTIVITY = [
  {
    id: 1,
    action: "Modified design",
    design: "Modern Living Room",
    timestamp: "2025-04-08T14:30:00Z",
  },
  {
    id: 2,
    action: "Created design",
    design: "Kitchen Renovation",
    timestamp: "2025-04-05T09:45:00Z",
  },
  {
    id: 3,
    action: "Shared design",
    design: "Office Layout",
    recipient: "roseyray@gmail.com",
    timestamp: "2025-04-03T11:20:00Z",
  },
  {
    id: 4,
    action: "Login from new device",
    device: "MacBook Pro",
    location: "Mount Lavinia, Sri Lanka",
    timestamp: "2025-04-01T08:15:00Z",
  },
  {
    id: 5,
    action: "Password changed",
    timestamp: "2025-03-28T16:40:00Z",
  },
];

// Reusable UI Components
const FormInput = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  error = null,
  placeholder = "",
  optional = false,
  icon = null,
  rightElement = null,
  autoComplete = "",
}) => (
  <div>
    <div className="flex justify-between">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}{" "}
        {optional && <span className="text-gray-400 text-xs">(optional)</span>}
      </label>
      {error && (
        <span className="text-xs text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-3 w-3 mr-1" /> {error}
        </span>
      )}
    </div>
    <div
      className={`mt-1 relative rounded-md shadow-sm ${
        icon ? "flex items-center" : ""
      }`}
    >
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          ${icon ? "pl-10" : ""}
          ${rightElement ? "pr-10" : ""}
          shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full 
          border-gray-300 rounded-md transition-colors duration-150 ease-in-out
          py-3 px-4 h-12 text-base
          ${disabled ? "bg-gray-50 text-gray-500" : ""}
          ${error ? "border-red-300 text-red-900 placeholder-red-300" : ""}
        `}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  icon = null,
  className = "",
  ariaLabel = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out";

  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = {
    primary:
      "border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400",
    secondary:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500",
    danger:
      "border border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400",
    success:
      "border border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Card = ({
  children,
  title = null,
  description = null,
  actions = null,
  noPadding = false,
  className = "",
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 ${className}`}
  >
    {(title || description || actions) && (
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
        <div>
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    )}
    <div className={noPadding ? "" : "p-6"}>{children}</div>
  </div>
);

const Switch = ({
  enabled,
  onChange,
  size = "md",
  label = null,
  description = null,
}) => {
  const sizes = {
    sm: "h-4 w-7",
    md: "h-6 w-11",
    lg: "h-7 w-14",
  };

  const thumbSizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onChange}
        className={`${
          sizes[size]
        } relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          enabled ? "bg-indigo-600" : "bg-gray-200"
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-4" : "translate-x-0"} ${
            thumbSizes[size]
          } bg-white rounded-full shadow-sm transform ring-0 transition ease-in-out duration-200`}
        />
      </button>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span className="text-sm font-medium text-gray-900">{label}</span>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

const Badge = ({ children, variant = "gray", size = "md" }) => {
  const variants = {
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    indigo: "bg-indigo-100 text-indigo-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
  };

  const sizes = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};

// Main Profile Settings Component
const UserProfileSettingsPage = () => {
  const { currentUser, updateUser, logout } = useAuth(); // Get currentUser, updateUser, and logout

  // State initialization
  const [activeSection, setActiveSection] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState({
    personalInfo: false,
    password: false,
    email: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newEmail: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: { projectUpdates: false, teamActivity: false, newsAndTips: false, marketing: false },
    app: { projectUpdates: false, teamActivity: false, newsAndTips: false },
  });
  const [preferences, setPreferences] = useState({
    theme: "light", defaultMeasurementUnit: "metric", autosaveInterval: 5, defaultView: "3d",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [avatarLoadError, setAvatarLoadError] = useState(false); // State to track avatar loading errors

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        company: currentUser.company || "",
        role: currentUser.role || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        newEmail: currentUser.email || "",
      });
      setNotifications(currentUser.notifications || {
        email: { projectUpdates: true, teamActivity: false, newsAndTips: true, marketing: false },
        app: { projectUpdates: true, teamActivity: true, newsAndTips: false },
      });
      setPreferences(currentUser.preferences || {
        theme: "light", defaultMeasurementUnit: "metric", autosaveInterval: 5, defaultView: "3d",
      });
      setTwoFactorEnabled(currentUser.twoFactorEnabled || false);
      setAvatarLoadError(false); // Reset avatar error when user data changes
    }
  }, [currentUser]);


  // Data validation methods
  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    // Add other validations as needed (e.g., phone format)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) { // Example: min 8 chars
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = () => {
    const newErrors = {};
    if (!formData.newEmail.trim()) {
      newErrors.newEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.newEmail)) {
      newErrors.newEmail = "Email address is invalid";
    }
    if (!formData.currentPassword) { // Assuming current password is required to change email
      newErrors.emailCurrentPassword = "Current password is required to change email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Form submission handlers
  const handlePersonalInfoSubmit = async () => {
    if (validatePersonalInfo() && currentUser) {
      try {
        await updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          company: formData.company,
          role: formData.role,
        });
        setIsEditing({ ...isEditing, personalInfo: false });
        showSuccess("Personal information updated successfully");
      } catch (error) {
        console.error("Failed to update personal info:", error);
        setErrors({ form: "Failed to update personal information." });
      }
    }
  };

  const handlePasswordSubmit = async () => {
    if (validatePassword() && currentUser) {
      // IMPORTANT: Password hashing should happen on the backend or in a secure client-side manner.
      // The current AuthContext.updateUser does not re-hash passwords.
      // This is a simplified example. For actual password changes, you'd typically send
      // currentPassword and newPassword to an API endpoint that handles verification and hashing.
      try {
        // Simulate password change - in a real app, call an API
        // For now, we'll just clear the fields and show success.
        // If you were to update the password directly in localStorage (not recommended for plaintext):
        // const newHashedPassword = await bcrypt.hash(formData.newPassword, 10);
        // await updateUser({ hashedPassword: newHashedPassword }); // This would require AuthContext to handle it

        console.warn("Password change simulation. Actual hashing and update via API needed.");
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsEditing({ ...isEditing, password: false });
        showSuccess("Password changed successfully (simulated)");
      } catch (error) {
        console.error("Failed to change password:", error);
        setErrors({ form: "Failed to change password." });
      }
    }
  };

  const handleEmailSubmit = async () => {
    if (validateEmail() && currentUser) {
      // Similar to password, email change might require backend verification (e.g., send confirmation to new email)
      try {
        await updateUser({
          email: formData.newEmail,
          // emailVerified: formData.newEmail === currentUser.email ? currentUser.emailVerified : false, // Reset verification status
        });
        setFormData({
          ...formData,
          currentPassword: "", // Clear password field
        });
        setIsEditing({ ...isEditing, email: false });
        showSuccess(
          "Email update request submitted. Verification might be required."
        );
      } catch (error) {
        console.error("Failed to update email:", error);
        setErrors({ form: "Failed to update email." });
      }
    }
  };

  // File upload handlers
  const handleAvatarUpload = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && currentUser) {
      setIsUploading(true);
      setErrors({}); // Clear previous form errors
      setAvatarLoadError(false); // Reset error before attempting to load new avatar

      // Basic file type validation
      const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!acceptedImageTypes.includes(file.type)) {
        setErrors({ form: "Invalid file type. Please select a JPG, PNG, or GIF." });
        setIsUploading(false);
        return;
      }

      // Basic file size validation (e.g., 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ form: "File is too large. Maximum size is 2MB." });
        setIsUploading(false);
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          // reader.result contains the data as a URL representing the file's data (base64)
          try {
            await updateUser({ avatar: reader.result });
            // The profileData state will update automatically because it depends on currentUser,
            // which is updated by the AuthContext after updateUser completes.
            showSuccess("Avatar updated successfully!");
          } catch (updateError) {
            console.error("Failed to update user avatar:", updateError);
            setErrors({ form: "Failed to update avatar. Please try again." });
          } finally {
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          console.error("Error reading file for avatar.");
          setErrors({ form: "Could not process the selected file." });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        // This catch is unlikely to be hit if FileReader errors are handled by reader.onerror
        console.error("Avatar upload process failed:", error);
        setErrors({ form: "Avatar upload failed. Please try again." });
        setIsUploading(false);
      }
    }
  };

  // Setting handlers
  const handleNotificationChange = async (channel, type, value) => {
    if (currentUser) {
      const newNotifications = {
        ...notifications,
        [channel]: {
          ...notifications[channel],
          [type]: value,
        },
      };
      try {
        await updateUser({ notifications: newNotifications });
        // setNotifications(newNotifications); // Optimistic update, or rely on useEffect
        showSuccess("Notification settings updated");
      } catch (error) {
        console.error("Failed to update notifications:", error);
      }
    }
  };

  const handlePreferenceChange = async (preference, value) => {
    if (currentUser) {
      const newPreferences = {
        ...preferences,
        [preference]: value,
      };
      try {
        await updateUser({ preferences: newPreferences });
        // setPreferences(newPreferences); // Optimistic update, or rely on useEffect
        showSuccess("Preference settings updated");
      } catch (error) {
        console.error("Failed to update preferences:", error);
      }
    }
  };

  const handleTwoFactorToggle = async () => {
    if (currentUser) {
      if (twoFactorEnabled) { // If currently enabled, attempt to disable
        try {
          await updateUser({ twoFactorEnabled: false });
          setTwoFactorEnabled(false);
          setShowTwoFactorSetup(false);
          showSuccess("Two-factor authentication disabled.");
        } catch (error) {
          console.error("Failed to disable 2FA:", error);
        }
      } else { // If currently disabled, show setup
        setShowTwoFactorSetup(true);
      }
    }
  };

  const handleTwoFactorSetup = async () => {
    if (currentUser) {
      // Simulate verification - in real app, verify code against a server
      if (verificationCode === "123456") { // Mock verification code
        try {
          await updateUser({ twoFactorEnabled: true });
          setTwoFactorEnabled(true);
          setShowTwoFactorSetup(false);
          setVerificationCode("");
          setErrors({});
          showSuccess("Two-factor authentication enabled successfully.");
        } catch (error) {
          console.error("Failed to enable 2FA:", error);
          setErrors({ verificationCode: "Failed to enable 2FA. Please try again." });
        }
      } else {
        setErrors({ verificationCode: "Invalid verification code." });
      }
    }
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  // UI feedback functions
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays < 7) {
      return `${date.toLocaleDateString([], {
        weekday: "long",
      })} at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `${date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      })} at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  // Reset state on cancel
  const cancelEdit = (section) => {
    setIsEditing({
      ...isEditing,
      [section]: false,
    });

    // Reset form data to current profile data from state (which should be from currentUser)
    if (profileData) {
      setFormData({
        ...formData, // Keep current password fields as they are not part of profileData
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        company: profileData.company,
        role: profileData.role,
        // currentPassword: "", // Resetting these might be desired on cancel
        // newPassword: "",
        // confirmPassword: "",
        newEmail: profileData.email,
      });
    }
    setErrors({});
  };

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  if (!currentUser || !profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  // UI Section Rendering Functions
  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card title="Profile Picture" description="Update your profile photo">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="relative group">
            <div className="h-24 w-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
              {profileData && profileData.avatar && !avatarLoadError ? (
                <img
                  src={profileData.avatar}
                  alt={`${profileData.firstName || ''} ${profileData.lastName || ''}`}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarLoadError(true)}
                />
              ) : (
                <UserCircleIcon className="h-20 w-20 text-gray-400" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl">
                <ArrowPathIcon className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-0 sm:ml-6">
            <div className="flex flex-col items-start">
              <Button
                variant="secondary"
                size="md"
                onClick={handleAvatarUpload}
                disabled={isUploading}
                icon={<PhotoIcon className="h-4 w-4" />}
              >
                Change photo
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG or GIF, max 2MB
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Personal Information"
        description="Update your personal details"
        actions={
          !isEditing.personalInfo ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing({ ...isEditing, personalInfo: true })}
              icon={<PencilIcon className="h-4 w-4" />}
            >
              Edit
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => cancelEdit("personalInfo")}
                icon={<XMarkIcon className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePersonalInfoSubmit}
                icon={<CheckIcon className="h-4 w-4" />}
              >
                Save
              </Button>
            </div>
          )
        }
      >
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <FormInput
            label="First name"
            id="firstName"
            name="firstName"
            value={
              isEditing.personalInfo
                ? formData.firstName
                : profileData.firstName
            }
            onChange={handleInputChange}
            disabled={!isEditing.personalInfo}
            error={errors.firstName}
            placeholder="Your first name"
          />

          <FormInput
            label="Last name"
            id="lastName"
            name="lastName"
            value={
              isEditing.personalInfo
                ? formData.lastName
                : profileData.lastName
            }
            onChange={handleInputChange}
            disabled={!isEditing.personalInfo}
            error={errors.lastName}
            placeholder="Your last name"
          />

          <FormInput
            label="Phone number"
            id="phone"
            name="phone"
            type="tel"
            value={isEditing.personalInfo ? formData.phone : profileData.phone}
            onChange={handleInputChange}
            disabled={!isEditing.personalInfo}
            error={errors.phone}
            placeholder="+1 (555) 123-4567"
            optional={true}
            icon={<span className="text-gray-400">+</span>}
          />

          <FormInput
            label="Company"
            id="company"
            name="company"
            value={
              isEditing.personalInfo ? formData.company : profileData.company
            }
            onChange={handleInputChange}
            disabled={!isEditing.personalInfo}
            placeholder="Your company name"
            optional={true}
            icon={<BuildingStorefrontIcon className="h-4 w-4 text-gray-400" />}
          />

          <div className="sm:col-span-2">
            <FormInput
              label="Role"
              id="role"
              name="role"
              value={isEditing.personalInfo ? formData.role : profileData.role}
              onChange={handleInputChange}
              disabled={!isEditing.personalInfo}
              placeholder="Your job title"
              optional={true}
            />
          </div>
        </div>
      </Card>

      <Card
        title="Email Address"
        description="Update your email. You'll need to verify any new email address."
        actions={
          !isEditing.email ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing({ ...isEditing, email: true })}
              icon={<PencilIcon className="h-4 w-4" />}
            >
              Change
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => cancelEdit("email")}
                icon={<XMarkIcon className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleEmailSubmit}
                icon={<CheckIcon className="h-4 w-4" />}
              >
                Save
              </Button>
            </div>
          )
        }
      >
        {!isEditing.email ? (
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium">
                {profileData.email}
              </p>
              <p className="mt-1 text-xs">
                {profileData.emailVerified ? (
                  <span className="inline-flex items-center text-green-700">
                    <CheckCircleIcon className="mr-1 h-4 w-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-yellow-600">
                    <InformationCircleIcon className="mr-1 h-4 w-4" />
                    Not verified - check your inbox for verification email
                  </span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <FormInput
              label="New Email Address"
              id="newEmail"
              name="newEmail"
              type="email"
              value={formData.newEmail}
              onChange={handleInputChange}
              error={errors.newEmail}
              placeholder="your.email@example.com"
              autoComplete="email"
            />

            <FormInput
              label="Current Password"
              id="currentPassword"
              name="currentPassword"
              type={passwordVisibility.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleInputChange}
              error={errors.emailCurrentPassword}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label={
                    passwordVisibility.current
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {passwordVisibility.current ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              }
            />

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    We'll send a verification link to your new email address.
                    You'll need to verify before the change takes effect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <Card
        title="Password"
        description="Update your password regularly to keep your account secure."
        actions={
          !isEditing.password ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing({ ...isEditing, password: true })}
              icon={<KeyIcon className="h-4 w-4" />}
            >
              Change
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => cancelEdit("password")}
                icon={<XMarkIcon className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePasswordSubmit}
                icon={<CheckIcon className="h-4 w-4" />}
              >
                Save
              </Button>
            </div>
          )
        }
      >
        {isEditing.password ? (
          <div className="space-y-4">
            <FormInput
              label="Current Password"
              id="currentPassword"
              name="currentPassword"
              type={passwordVisibility.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleInputChange}
              error={errors.currentPassword}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {passwordVisibility.current ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              }
            />

            <FormInput
              label="New Password"
              id="newPassword"
              name="newPassword"
              type={passwordVisibility.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleInputChange}
              error={errors.newPassword}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {passwordVisibility.new ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              }
            />
            <p className="text-xs text-gray-500 -mt-3">
              Password should be at least 8 characters long and include a mix of
              letters, numbers, and symbols.
            </p>

            <FormInput
              label="Confirm New Password"
              id="confirmPassword"
              name="confirmPassword"
              type={passwordVisibility.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {passwordVisibility.confirm ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              <LockClosedIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">
                Password last changed on March 28, 2025
              </span>
            </div>
          </div>
        )}
      </Card>

      <Card
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account by requiring a verification code."
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {twoFactorEnabled && !showTwoFactorSetup && (
              <div className="mb-4">
                <Badge variant="green" size="md">
                  <span className="flex items-center">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Enabled
                  </span>
                </Badge>
                <p className="mt-2 text-sm text-gray-500">
                  You will be asked for a verification code when signing in from
                  a new device or browser.
                </p>
              </div>
            )}

            <Switch
              enabled={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
            />
          </div>
        </div>

        {/* 2FA Setup Dialog */}
        {showTwoFactorSetup && (
          <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Set up Two-Factor Authentication
            </h4>

            <div className="space-y-4">
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <span>
                    Download an authenticator app like Google Authenticator or
                    Authy.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <span>Scan this QR code with your authenticator app.</span>
                </li>
              </ol>

              {/* QR Code Placeholder */}
              <div className="mx-auto w-48 h-48 bg-white flex items-center justify-center rounded-md border border-gray-300 shadow-sm">
                <p className="text-sm text-gray-500">
                  QR Code would appear here
                </p>
              </div>

              <ol className="space-y-2 text-sm text-gray-600" start="3">
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <span>
                    Enter the 6-digit verification code from your authenticator
                    app.
                  </span>
                </li>
              </ol>

              <div>
                <label htmlFor="verificationCode" className="sr-only">
                  Verification Code
                </label>
                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    name="verificationCode"
                    id="verificationCode"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => {
                      // Only allow digits
                      const value = e.target.value.replace(/\D/g, "");
                      setVerificationCode(value);

                      // Clear error when user types
                      if (errors.verificationCode) {
                        setErrors({
                          ...errors,
                          verificationCode: "",
                        });
                      }
                    }}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-md text-center tracking-widest py-3 px-4 h-12 ${
                      errors.verificationCode ? "border-red-300" : ""
                    }`}
                    placeholder="000000"
                  />
                  {errors.verificationCode && (
                    <p className="mt-1 text-sm text-red-600 text-center">
                      {errors.verificationCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowTwoFactorSetup(false);
                    setVerificationCode("");
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleTwoFactorSetup}
                >
                  Verify and Enable
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card
        title="Active Sessions"
        description="Manage your active login sessions across devices."
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <LockClosedIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Current Session
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  <span>Chrome on MacBook Pro</span> •
                  <span className="ml-1">NSBM, Homagama</span> •
                  <span className="ml-1">
                    Started {formatDate(new Date().toISOString())}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <Badge variant="green">Current</Badge>
            </div>
          </div>

          {/* Other Sessions (Simulated) */}
          <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                <GlobeAltIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Safari on iPhone
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  <span>Plymouth, UK</span> •
                  <span className="ml-1">Last active 2 days ago</span>
                </p>
              </div>
            </div>
            <div>
              <Button variant="ghost" size="sm" className="text-red-600">
                Sign out
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                <GlobeAltIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Firefox on Windows PC
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  <span>Dehiwala, Colombo</span> •
                  <span className="ml-1">Last active 5 days ago</span>
                </p>
              </div>
            </div>
            <div>
              <Button variant="ghost" size="sm" className="text-red-600">
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Account Data"
        description="Manage your personal data and account information."
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Export Your Data
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Download a copy of your personal data, including your profile
              information and design history.
            </p>
            <Button
              variant="secondary"
              size="md"
              icon={<ArrowDownTrayIcon className="h-4 w-4" />}
            >
              Export Data
            </Button>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <h3 className="text-sm font-medium text-red-600 mb-1">
              Danger Zone
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Actions here cannot be easily undone. Please proceed with caution.
            </p>
            <Button variant="danger" size="md">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <Card
        title="Email Notifications"
        description="Manage what emails you receive from us."
      >
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email-project-updates"
                name="email-project-updates"
                type="checkbox"
                checked={notifications.email.projectUpdates}
                onChange={(e) =>
                  handleNotificationChange(
                    "email",
                    "projectUpdates",
                    e.target.checked
                  )
                }
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="email-project-updates"
                className="font-medium text-gray-700"
              >
                Design updates
              </label>
              <p className="text-gray-500">
                Receive emails when your designs are updated or shared.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email-team-activity"
                name="email-team-activity"
                type="checkbox"
                checked={notifications.email.teamActivity}
                onChange={(e) =>
                  handleNotificationChange(
                    "email",
                    "teamActivity",
                    e.target.checked
                  )
                }
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="email-team-activity"
                className="font-medium text-gray-700"
              >
                Team activity
              </label>
              <p className="text-gray-500">
                Receive emails about team members' actions on shared designs.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email-news"
                name="email-news"
                type="checkbox"
                checked={notifications.email.newsAndTips}
                onChange={(e) =>
                  handleNotificationChange(
                    "email",
                    "newsAndTips",
                    e.target.checked
                  )
                }
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="email-news" className="font-medium text-gray-700">
                News and tips
              </label>
              <p className="text-gray-500">
                Receive emails about new features, tips, and best practices.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email-marketing"
                name="email-marketing"
                type="checkbox"
                checked={notifications.email.marketing}
                onChange={(e) =>
                  handleNotificationChange(
                    "email",
                    "marketing",
                    e.target.checked
                  )
                }
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="email-marketing"
                className="font-medium text-gray-700"
              >
                Marketing communications
              </label>
              <p className="text-gray-500">
                Receive emails about promotions, events, and special offers.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="In-App Notifications"
        description="Control what notifications you see inside the app."
      >
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="app-project-updates"
                name="app-project-updates"
                type="checkbox"
                checked={notifications.app.projectUpdates}
                onChange={(e) =>
                  handleNotificationChange(
                    "app",
                    "projectUpdates",
                    e.target.checked
                  )
                }
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="app-project-updates"
                className="font-medium text-gray-700"
              >
                Design updates
              </label>
              <p className="text-gray-500">
                Receive notifications when your designs are updated or shared.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="app-team-activity"
                name="app-team-activity"
                type="checkbox"
                checked={notifications.app.teamActivity}
                onChange={(e) =>
                  handleNotificationChange(
                    "app",
                    "teamActivity",
                    e.target.checked
                  )
                }
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="app-team-activity"
                className="font-medium text-gray-700"
              >
                Team activity
              </label>
              <p className="text-gray-500">
                Receive notifications about team members' actions on shared
                designs.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="app-news"
                name="app-news"
                type="checkbox"
                checked={notifications.app.newsAndTips}
                onChange={(e) =>
                  handleNotificationChange(
                    "app",
                    "newsAndTips",
                    e.target.checked
                  )
                }
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="app-news" className="font-medium text-gray-700">
                News and tips
              </label>
              <p className="text-gray-500">
                Receive notifications about new features, tips, and best
                practices.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <Card
        title="Display Preferences"
        description="Customize how the application looks and behaves."
      >
        <div className="space-y-6">
          {/* Theme Preference */}
          <div>
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              className="mt-1 block w-full pl-4 pr-10 py-3 h-12 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={preferences.theme}
              onChange={(e) => handlePreferenceChange("theme", e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose how the application appears.
            </p>
          </div>

          {/* Measurement Units */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Measurement Units
                </h3>
                <p className="text-sm text-gray-500">
                  Default unit system for dimensions
                </p>
              </div>
              <div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                      preferences.defaultMeasurementUnit === "metric"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-300 z-10"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      handlePreferenceChange("defaultMeasurementUnit", "metric")
                    }
                  >
                    Metric (cm)
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 text-sm font-medium rounded-r-md border-t border-b border-r ${
                      preferences.defaultMeasurementUnit === "imperial"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-300 z-10"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      handlePreferenceChange(
                        "defaultMeasurementUnit",
                        "imperial"
                      )
                    }
                  >
                    Imperial (in)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Default View */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Default View
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Select your preferred view mode when opening designs
            </p>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="view-2d"
                  name="default-view"
                  type="radio"
                  checked={preferences.defaultView === "2d"}
                  onChange={() => handlePreferenceChange("defaultView", "2d")}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label
                  htmlFor="view-2d"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  2D View
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="view-3d"
                  name="default-view"
                  type="radio"
                  checked={preferences.defaultView === "3d"}
                  onChange={() => handlePreferenceChange("defaultView", "3d")}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label
                  htmlFor="view-3d"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  3D View
                </label>
              </div>
            </div>
          </div>

          {/* Autosave Interval */}
          <div className="pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Autosave Interval
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                How often your work is automatically saved (in minutes)
              </p>

              <select
                id="autosaveInterval"
                name="autosaveInterval"
                className="block w-full pl-4 pr-10 py-3 h-12 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                value={preferences.autosaveInterval}
                onChange={(e) =>
                  handlePreferenceChange(
                    "autosaveInterval",
                    parseInt(e.target.value)
                  )
                }
              >
                <option value="1">1 minute</option>
                <option value="3">3 minutes</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Language and Region"
        description="Set your preferred language and timezone."
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Language
            </label>
            <select
              id="language"
              name="language"
              className="mt-1 block w-full pl-4 pr-10 py-3 h-12 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={profileData.language}
              onChange={(e) => {
                setProfileData({
                  ...profileData,
                  language: e.target.value,
                });
                showSuccess("Language updated successfully");
              }}
            >
              <option value="English">English</option>
              <option value="Spanish">Sinhala</option>
              <option value="French">Tamil</option>
              <option value="German">Arabic</option>
              <option value="Portuguese">French</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              className="mt-1 block w-full pl-4 pr-10 py-3 h-12 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={profileData.timezone}
              onChange={(e) => {
                setProfileData({
                  ...profileData,
                  timezone: e.target.value,
                });
                showSuccess("Timezone updated successfully");
              }}
            >
              <option value="America/New_York">Western Time (Sri Lanka)</option>
              <option value="America/Chicago">
                Central Time (US & Canada)
              </option>
              <option value="America/Denver">
                Mountain Time (US & Canada)
              </option>
              <option value="America/Los_Angeles">
                Pacific Time (US & Canada)
              </option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Australia/Sydney">Sydney</option>
            </select>
          </div>
        </div>
      </Card>

      <Card
        title="Integrations & Add-ons"
        description="Connect external services and customize your experience."
      >
        <ul className="divide-y divide-gray-100">
          <li className="py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                <BuildingStorefrontIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Furniture Catalogs
                </p>
                <p className="text-sm text-gray-500">
                  Access furniture catalogs from partners
                </p>
              </div>
            </div>
            <div>
              <Button
                variant="secondary"
                size="sm"
                icon={<PlusIcon className="h-4 w-4" />}
              >
                Connect
              </Button>
            </div>
          </li>

          <li className="py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-blue-600"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Social Media Sharing
                </p>
                <p className="text-sm text-gray-500">
                  Connect social media accounts for easy sharing
                </p>
              </div>
            </div>
            <div>
              <Button
                variant="secondary"
                size="sm"
                icon={<PlusIcon className="h-4 w-4" />}
              >
                Connect
              </Button>
            </div>
          </li>

          <li className="py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                <SwatchIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Color Palettes Plugin
                </p>
                <p className="text-sm text-gray-500">
                  Access professional color palette collections
                </p>
              </div>
            </div>
            <div>
              <Badge variant="green">
                <span className="flex items-center">
                  <CheckIcon className="mr-1 h-3 w-3" />
                  Connected
                </span>
              </Badge>
            </div>
          </li>
        </ul>
      </Card>
    </div>
  );

  const renderActivitySection = () => (
    <div className="space-y-6">
      <Card
        title="Recent Activity"
        description="Track your recent actions and account activity."
      >
        <ul className="divide-y divide-gray-100">
          {RECENT_ACTIVITY.map((activity) => (
            <li key={activity.id} className="py-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {activity.action.includes("design") ? (
                    <SwatchIcon className="h-5 w-5 text-indigo-500" />
                  ) : activity.action.includes("Login") ? (
                    <GlobeAltIcon className="h-5 w-5 text-blue-500" />
                  ) : activity.action.includes("Password") ? (
                    <KeyIcon className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {activity.design && (
                      <p>
                        Design:{" "}
                        <span className="font-medium text-gray-900">
                          {activity.design}
                        </span>
                      </p>
                    )}
                    {activity.recipient && (
                      <p>
                        Shared with:{" "}
                        <span className="font-medium text-gray-900">
                          {activity.recipient}
                        </span>
                      </p>
                    )}
                    {activity.device && (
                      <p>
                        Device:{" "}
                        <span className="font-medium text-gray-900">
                          {activity.device}
                        </span>
                        {activity.location && (
                          <span>
                            {" "}
                            from{" "}
                            <span className="font-medium text-gray-900">
                              {activity.location}
                            </span>
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-center">
          <Button variant="secondary" size="md" className="group">
            View All Activity
            <ChevronRightIcon className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </Card>

      <Card
        title="Account Data"
        description="Manage your personal data and account information."
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Export Your Data
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Download a copy of your personal data, including your profile
              information and design history.
            </p>
            <Button
              variant="secondary"
              size="md"
              icon={<ArrowDownTrayIcon className="h-4 w-4" />}
            >
              Export Data
            </Button>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <h3 className="text-sm font-medium text-red-600 mb-1">
              Danger Zone
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Actions here cannot be easily undone. Please proceed with caution.
            </p>
            <Button variant="danger" size="md">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-150 ease-in-out"
                aria-label="Back to dashboard"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Profile & Settings
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()} // Use logout from useAuth
                icon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Success Message Alert */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-100 p-4 rounded-lg flex items-start animate-fadeIn">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
            <button
              className="text-green-500 hover:text-green-700 transition-colors duration-150"
              onClick={() => setSuccessMessage("")}
              aria-label="Close message"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings Navigation */}
          <aside className="lg:col-span-3">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-4 flex items-center">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-indigo-100 border border-indigo-200">
                      <img
                        src={profileData.avatar}
                        alt={`${profileData.firstName} ${profileData.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-gray-900">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {profileData.role}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                    activeSection === "profile"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } transition-colors duration-150 ease-in-out`}
                >
                  <UserCircleIcon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      activeSection === "profile"
                        ? "text-indigo-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span>Profile Information</span>
                </button>

                <button
                  onClick={() => setActiveSection("security")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                    activeSection === "security"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } transition-colors duration-150 ease-in-out`}
                >
                  <ShieldCheckIcon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      activeSection === "security"
                        ? "text-indigo-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span>Security</span>
                </button>

                <button
                  onClick={() => setActiveSection("notifications")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                    activeSection === "notifications"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } transition-colors duration-150 ease-in-out`}
                >
                  <BellIcon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      activeSection === "notifications"
                        ? "text-indigo-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span>Notifications</span>
                </button>

                <button
                  onClick={() => setActiveSection("preferences")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                    activeSection === "preferences"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } transition-colors duration-150 ease-in-out`}
                >
                  <Cog6ToothIcon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      activeSection === "preferences"
                        ? "text-indigo-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span>Preferences</span>
                </button>

                <button
                  onClick={() => setActiveSection("activity")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                    activeSection === "activity"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } transition-colors duration-150 ease-in-out`}
                >
                  <ClockIcon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      activeSection === "activity"
                        ? "text-indigo-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span>Recent Activity</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {activeSection === "profile" && renderProfileSection()}
            {activeSection === "security" && renderSecuritySection()}
            {activeSection === "notifications" && renderNotificationsSection()}
            {activeSection === "preferences" && renderPreferencesSection()}
            {activeSection === "activity" && renderActivitySection()}
          </div>
        </div>
      </main>

      {/* Global styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserProfileSettingsPage;
