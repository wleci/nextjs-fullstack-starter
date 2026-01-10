import { Heading, Text } from "@react-email/components";
import { BaseEmail } from "./base";

interface LoginNotificationProps {
    name: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
}

export function LoginNotification({ name, ipAddress, userAgent, timestamp }: LoginNotificationProps) {
    return (
        <BaseEmail preview="New login to your account">
            <Heading style={heading}>New login detected</Heading>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
                We detected a new login to your account. If this was you, no action is needed.
            </Text>
            <div style={detailsBox}>
                <Text style={detailsTitle}>Login details:</Text>
                <Text style={detailsText}>Time: {timestamp}</Text>
                {ipAddress && <Text style={detailsText}>IP Address: {ipAddress}</Text>}
                {userAgent && <Text style={detailsText}>Device: {userAgent}</Text>}
            </div>
            <Text style={paragraph}>
                If you didn&apos;t log in, please secure your account immediately by changing your password.
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

const detailsBox = {
    backgroundColor: "#f4f4f5",
    borderRadius: "6px",
    padding: "16px",
    margin: "24px 0",
};

const detailsTitle = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#18181b",
    margin: "0 0 8px 0",
};

const detailsText = {
    fontSize: "13px",
    lineHeight: "20px",
    color: "#525f7f",
    margin: "4px 0",
};
