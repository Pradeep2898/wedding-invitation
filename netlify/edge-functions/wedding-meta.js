export default async (request, context) => {

  const url = new URL(request.url);

  const side =
    url.searchParams.get("side") === "bride"
      ? "bride"
      : "groom";


  /*
   * Get the normal index.html response
   */
  const response = await context.next();


  /*
   * Only modify HTML responses
   */
  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }


  /*
   * Read the HTML
   */
  let html = await response.text();


  /*
   * Side-specific content
   */

  const title =
    side === "bride"
      ? "Niveditha & Pradeep | Wedding Invitation"
      : "Pradeep & Niveditha | Wedding Invitation";


  const description =
    side === "bride"
      ? "Niveditha and Pradeep warmly invite you to join them as they celebrate their wedding."
      : "Pradeep and Niveditha warmly invite you to join them as they celebrate their wedding.";


  /*
   * Replace OG title
   */

  html = html.replace(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${title}">`
  );


  /*
   * Replace OG description
   */

  html = html.replace(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${description}">`
  );


  /*
   * Also update Twitter/X metadata if present
   */

  html = html.replace(
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${title}">`
  );


  html = html.replace(
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${description}">`
  );


  /*
   * Return modified HTML
   */

  return new Response(html, {
    status: response.status,
    headers: response.headers
  });

};


export const config = {
  path: "/*"
};