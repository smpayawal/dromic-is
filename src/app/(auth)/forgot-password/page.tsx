import Image from "next/image";
import ForgotPasswordForm from "./_components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    // Center the card vertically and horizontally on the page
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* The Card Element */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-xl shadow-custom overflow-hidden bg-white animate-fadeIn">
        {/* Left side content section (Red Background) */}
        {/* Ensure correct rounding on different screen sizes */}
        <div className="bg-main-red flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-10 md:w-1/2 w-full order-1 md:order-none rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <Image
            src="/AGAPP.png"
            alt="DROMIC IS Logo"
            width={100}
            height={100}
            className="w-20 sm:w-24 md:w-28 h-auto mb-4 sm:mb-6 drop-shadow-lg"
            priority
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-header text-white font-bold leading-tight mb-3 sm:mb-4">
            DROMIC INTEGRATED SYSTEM
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg">
            Disaster Response Operations Monitoring and Information Center
          </p>
        </div>

        {/* Right side content section */}
        <div className="md:w-1/2 w-full p-6 sm:p-8 md:p-10 order-2 flex items-center">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
