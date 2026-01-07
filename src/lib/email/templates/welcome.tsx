import { Button, Heading, Text } from "@react-email/components";
import { BaseEmail } from "./base";

interface WelcomeProps {
    name: string;
    loginUrl: string;
}

export function Welcome({ name, loginUrl }: WelcomeProps) {
    return (
        <BaseEmail preview="Welcome to Starter!">
            <Heading style={heading}>Welcome to Starter!</Heading>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
                Thanks for joining us! Your account is now ready. You can start using
                all features right away.
            </Text>
            <Button style={button} href={loginUrl}>
                Go to Dashboard
            </Button>
            <Text style={paragraph}>
                If you have any questions, feel free to reach out to our support team.
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
