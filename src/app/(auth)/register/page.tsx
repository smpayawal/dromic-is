import Image from "next/image";
import RegisterForm from "./_components/register-form";

export default function RegisterPage() {
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
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-md">
            Join our community of disaster response professionals. Together, we can make a difference when every second counts.
          </p>
        </div>

        {/* Right side register form area (White Background) */}
        {/* Ensure correct rounding on different screen sizes */}
        <div className="flex items-center justify-center md:w-1/2 w-full bg-white p-4 sm:p-6 md:p-8 lg:p-12 order-2 md:order-none rounded-b-xl md:rounded-r-xl md:rounded-bl-none overflow-y-auto max-h-[90vh] md:max-h-[95vh]">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
