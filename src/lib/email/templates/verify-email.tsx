import { Button, Heading, Text } from "@react-email/components";
import { BaseEmail } from "./base";

interface VerifyEmailProps {
    name: string;
    verifyUrl: string;
}

export function VerifyEmail({ name, verifyUrl }: VerifyEmailProps) {
    return (
        <BaseEmail preview="Verify your email address">
            <Heading style={heading}>Verify your email</Heading>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
                Thanks for signing up! Please verify your email address by clicking the
                button below.
            </Text>
            <Button style={button} href={verifyUrl}>
                Verify Email
            </Button>
            <Text style={paragraph}>
                If you didn&apos;t create an account, you can safely ignore this email.
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

const button = {
    backgroundColor: "#000",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 24px",
    margin: "24px 0",
};
