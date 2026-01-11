"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NewsletterTranslations {
    unsubscribe: {
        title: string;
        description: string;
        button: string;
        successTitle: string;
        successDescription: string;
    };
}

interface CommonTranslations {
    home: string;
}

interface Props {
    translations: {
        newsletter: NewsletterTranslations;
        common: CommonTranslations;
    };
    lang: string;
    alreadyUnsubscribed: boolean;
    newsletterId: string;
}

export function UnsubscribeClient({ translations, lang, alreadyUnsubscribed, newsletterId }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(alreadyUnsubscribed);

    const t = translations.newsletter.unsubscribe;

    const handleUnsubscribe = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/newsletter/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newsletterId }),
            });

            if (response.ok) {
                setSuccess(true);
            }
        } catch {
            // Ignore errors
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            {success ? (
                                <Check className="h-6 w-6 text-primary" />
                            ) : (
                                <Mail className="h-6 w-6 text-primary" />
                            )}
                        </div>
                        <CardTitle>
                            {success ? t.successTitle : t.title}
                        </CardTitle>
                        <CardDescription>
                            {success ? t.successDescription : t.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!success && (
                            <Button
                                onClick={handleUnsubscribe}
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                {t.button}
                            </Button>
                        )}
                        <Button variant="outline" className="w-full" asChild>
                            <Link href={`/${lang}`}>
                                {translations.common.home}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
