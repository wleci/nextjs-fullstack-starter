import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/database";
import { user } from "@/lib/auth/schema";
import { getTranslations } from "@/lib/i18n/server";
import { UnsubscribeClient } from "./client";

interface Props {
    params: Promise<{ lang: string; id: string }>;
}

export default async function UnsubscribePage({ params }: Props) {
    const { lang, id } = await params;
    const translations = await getTranslations(lang) as {
        newsletter: {
            unsubscribe: {
                title: string;
                description: string;
                button: string;
                successTitle: string;
                successDescription: string;
            };
        };
        common: { home: string };
    };

    // Find user by newsletter ID
    const [foundUser] = await db
        .select({ id: user.id, email: user.email, newsletterSubscribed: user.newsletterSubscribed })
        .from(user)
        .where(eq(user.newsletterId, id))
        .limit(1);

    if (!foundUser) {
        redirect(`/${lang}`);
    }

    // If already unsubscribed, show message
    if (!foundUser.newsletterSubscribed) {
        return (
            <UnsubscribeClient
                translations={translations}
                lang={lang}
                alreadyUnsubscribed={true}
                newsletterId={id}
            />
        );
    }

    return (
        <UnsubscribeClient
            translations={translations}
            lang={lang}
            alreadyUnsubscribed={false}
            newsletterId={id}
        />
    );
}
