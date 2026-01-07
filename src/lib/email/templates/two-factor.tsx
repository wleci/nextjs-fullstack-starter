import { Heading, Text } from "@react-email/components";
import { BaseEmail } from "./base";

interface TwoFactorProps {
    name: string;
    code: string;
}

export function TwoFactor({ name, code }: TwoFactorProps) {
    return (
        <BaseEmail preview="Your verification code">
            <Heading style={heading}>Your verification code</Heading>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
                Use the following code to complete your sign-in:
            </Text>
            <Text style={codeStyle}>{code}</Text>
            <Text style={paragraph}>
                This code will expire in 10 minutes. If you didn&apos;t request this
                code, please secure your account immediately.
            </Text>
        </BaseEmail>
    );
}

const heading = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "24px",
};

const paragraph = {
    fontSize: "14px",
    lineHeight: "24px",
    color: "#525f7f",
};

const codeStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    letterSpacing: "8px",
    textAlign: "center" as const,
    margin: "32px 0",
    padding: "16px",
    backgroundColor: "#f4f4f5",
    borderRadius: "8px",
};
