import Link from "next/link";
import Button from "./Button";

interface SignInOrUpButtonProps {
  signIn?: boolean;
}

export default function SignInOrUpButton({ signIn }: SignInOrUpButtonProps) {
  return (
    <Button href={signIn ? "/sign-in" : "/sign-up"}>
      {signIn ? "Sign in" : "Sign up"}
    </Button>
  );
}
