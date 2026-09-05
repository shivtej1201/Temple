import Link from "next/link";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  async function registerUser(formData: FormData) {
    "use server";
    // For demo purposes, we will just redirect to login
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-orange-600 tracking-tighter mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
          </svg>
          DARSHAN
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-stone-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Or{' '}
          <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-stone-200">
          <form action={registerUser} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
