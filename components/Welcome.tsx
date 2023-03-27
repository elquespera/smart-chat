import CenteredBox from "./CenteredBox";
import SignInOrUpButton from "./SignInOrUpButton";

export default function Welcome() {
  return (
    <CenteredBox className="gap-8">
      <p className="text-center">You need to be authorized to use SmartChat.</p>
      <SignInOrUpButton signIn />
      <p className="text-center">
        Don&apos;t have an account yet? Create one here or log in using Google,
        Github and others.
      </p>
      <SignInOrUpButton />
    </CenteredBox>
  );
}
