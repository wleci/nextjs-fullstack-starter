import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/features/actions";
import { FEATURE_KEYS } from "@/lib/features";
import RegisterClient from "./register-client";

export default async function RegisterPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    // Check if registration is enabled
    const registrationEnabled = await isFeatureEnabled(FEATURE_KEYS.REGISTRATION);

    if (!registrationEnabled) {
        redirect(`/${lang}/auth/login`);
    }

    return <RegisterClient />;
}
