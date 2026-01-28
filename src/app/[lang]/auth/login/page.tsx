import { isFeatureEnabled } from "@/lib/features/actions";
import { FEATURE_KEYS } from "@/lib/features";
import LoginClient from "./login-client";

export default async function LoginPage() {
    const registrationEnabled = await isFeatureEnabled(FEATURE_KEYS.REGISTRATION);

    return <LoginClient registrationEnabled={registrationEnabled} />;
}
