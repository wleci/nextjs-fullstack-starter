import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    Link,
    Hr,
} from "@react-email/components";
import { env } from "@/lib/env";

interface NewsletterEmailProps {
    subject: string;
    content: string;
    unsubscribeUrl: string;
}

export function NewsletterEmail({ subject, content, unsubscribeUrl }: NewsletterEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>{subject}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logo}>{env.APP_NAME}</Text>
                    </Section>
                    <Section style={contentSection}>
                        <Text style={title}>{subject}</Text>
                        <div
                            style={bodyText}
                            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
                        />
                    </Section>
                    <Hr style={hr} />
                    <Section style={footerSection}>
                        <Text style={footerText}>
                            Otrzymujesz ten email, ponieważ zapisałeś się do naszego newslettera.
                        </Text>
                        <Link href={unsubscribeUrl} style={unsubscribeLink}>
                            Wypisz się z newslettera
                        </Link>
                        <Text style={copyright}>
                            © {new Date().getFullYear()} {env.APP_NAME}. Wszelkie prawa zastrzeżone.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "0",
    maxWidth: "600px",
    borderRadius: "8px",
    overflow: "hidden" as const,
};

const header = {
    backgroundColor: "#1a1a1a",
    padding: "24px 48px",
};

const logo = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold" as const,
    margin: "0",
};

const contentSection = {
    padding: "32px 48px",
};

const title = {
    fontSize: "24px",
    fontWeight: "bold" as const,
    color: "#1a1a1a",
    marginBottom: "24px",
};

const bodyText = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#4a4a4a",
};

const hr = {
    borderColor: "#e6e6e6",
    margin: "0",
};

const footerSection = {
    padding: "24px 48px",
    backgroundColor: "#fafafa",
};

const footerText = {
    fontSize: "12px",
    color: "#8898aa",
    margin: "0 0 8px 0",
};

const unsubscribeLink = {
    fontSize: "12px",
    color: "#3b82f6",
    textDecoration: "underline",
};

const copyright = {
    fontSize: "12px",
    color: "#8898aa",
    marginTop: "16px",
};
