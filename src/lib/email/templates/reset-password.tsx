import { Button, Heading, Text } from "@react-email/components";
import { BaseEmail } from "./base";

interface ResetPasswordProps {
    name: string;
    resetUrl: string;
}

export function ResetPassword({ name, resetUrl }: ResetPasswordProps) {
    return (
        <BaseEmail preview="Reset your password">
            <Heading style={heading}>Reset your password</Heading>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
                We received a request to reset your password. Click the button below to
                choose a new password.
            </Text>
            <Button style={button} href={resetUrl}>
                Reset Password
            </Button>
            <Text style={paragraph}>
                This link will expire in 1 hour. If you didn&apos;t request a password
                reset, you can safely ignore this email.
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
