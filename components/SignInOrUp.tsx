import { SignIn, SignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Header from "./Header";

const singUpUrl = "/sign-up";

export default function SignInOrUp() {
  const { pathname } = useRouter();

  return (
    <div className="h-[100dvh] flex items-center justify-center">
      {pathname === singUpUrl ? (
        <SignUp signInUrl="/" />
      ) : (
        <SignIn signUpUrl={singUpUrl} />
      )}
    </div>
  );
}
