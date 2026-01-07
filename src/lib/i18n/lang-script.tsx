export function LangScript() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
          (function() {
            var lang = document.cookie.match('(^|;)\\\\s*lang\\\\s*=\\\\s*([^;]+)');
            if (lang) {
              document.documentElement.lang = lang.pop();
            }
          })();
        `,
            }}
        />
    );
}
