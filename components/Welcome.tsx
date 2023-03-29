import { lng } from "assets/translations";
import useTranslation from "hooks/useTranslation";
import CenteredBox from "./CenteredBox";
import SignInOrUpButton from "./SignInOrUpButton";

export default function Welcome() {
  const t = useTranslation();
  return (
    <CenteredBox className="gap-8">
      <p className="text-center">{t(lng.welcomeAuthorized)}</p>
      <SignInOrUpButton signIn />
      <p className="text-center">{t(lng.welcomeNoAccount)}</p>
      <SignInOrUpButton />
    </CenteredBox>
  );
}
