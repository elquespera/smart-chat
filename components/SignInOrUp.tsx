import { SignIn, SignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";

const signInUrl = "/sign-in";
const signUpUrl = "/sign-up";

export default function SignInOrUp() {
  const { pathname } = useRouter();

  return (
    <div className="h-[100dvh] flex items-center justify-center">
      {pathname === signUpUrl ? (
        <SignUp signInUrl={signInUrl} />
      ) : (
        <SignIn signUpUrl={signUpUrl} />
      )}
    </div>
  );
}
