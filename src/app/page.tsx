import Image from 'next/image';
import { redirect } from 'next/navigation';

export default function Home() {
  // This redirect will execute immediately, so the visual elements won't be visible
  redirect('/login');
  
  // The code below won't actually run due to the redirect above
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <Image
          src="/AGAPP.png"
          alt="DROMIC INTEGRATED SYSTEM Logo"
          width={150}
          height={150}
          priority
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-foreground mb-8">
          DROMIC INTEGRATED SYSTEM
        </h1>
      </div>
    </main>
  );
}
