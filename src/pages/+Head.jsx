export default function HeadDefault() {
  const favicon = "/images/skyup_logo1.svg"
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="icon" href={favicon} />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
    </>
  );
}