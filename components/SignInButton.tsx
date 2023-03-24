import Link from "next/link";

export default function SignInButton() {
  return (
    <Link href="/sign-in" className="p-3 rounded-lg text-contrast bg-primary">
      Sign in
    </Link>
  );
}
