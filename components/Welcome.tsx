import SignInOrUpButton from "./SignInOrUpButton";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center gap-8 justify-center min-h-full min-w-full p-4">
      <p className="text-center">You need to be authorized to use SmartChat.</p>
      <SignInOrUpButton signIn />
      <p className="text-center">
        Don&apos;t have an account yet? Create one here or log in using Google,
        Github and others.
      </p>
      <SignInOrUpButton />
    </div>
  );
}
