"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";

export default function TwoFactorPage() {
    const { t } = useTranslation();
    const [useBackup, setUseBackup] = useState(false);

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.twoFactor.title")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.twoFactor.description")}
                        </p>
                    </div>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">
                            {useBackup ? t("auth.twoFactor.backupCode") : t("auth.twoFactor.code")}
                        </Label>
                        <Input
                            id="code"
                            type="text"
                            placeholder={useBackup ? "XXXX-XXXX-XXXX" : "000000"}
                            className="text-center text-lg tracking-widest"
                            maxLength={useBackup ? 14 : 6}
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        {t("auth.twoFactor.submit")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <button
                    type="button"
                    onClick={() => setUseBackup(!useBackup)}
                    className="w-full text-center text-sm text-muted-foreground hover:text-primary"
                >
                    {useBackup ? t("auth.twoFactor.code") : t("auth.twoFactor.useBackupCode")}
                </button>
            </div>
        </AuthLayout>
    );
}
