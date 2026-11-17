# Rory Jenkins portfolio — final corrections, 16 November 2026

The editable website is in this directory. No build step or paid editor is required.
Open `index.html` to review it, or serve the folder with `python -m http.server 8080`.

## Client requirements and status

| Requirement | Status |
| --- | --- |
| Use only three clear, readable fonts | Complete: Montserrat for main headings/navigation, Poppins for body/controls, Playfair Display for section headings/editorial accents. Font files and SIL Open Font Licenses are included. Artwork and the supplied logo can contain their own lettering. |
| Correct wording | Complete in local source using the supplied portrait, Culture Magazine, publication and Daybrave copy. Corrected the Veronica heading punctuation and the obvious “Te” typo. |
| Add two illustrations and their thumbnails | Complete. Added Veronica’s acrylic portrait and Rory painting the Whimsical Man, with matching WebP thumbnails, original-image viewers and supplied descriptions. |
| Balance the layout | Complete in local code: consistent illustration columns, centred artwork, uncropped images, improved mobile sizing, readable paragraph widths and natural word spacing. Client revision: headings, paragraphs, cards, captions, contact text and footer are now centre aligned. Body text scales from 18 to 20 px, introductory text from 20 to 24 px, home headings up to 80 px and inner-page headings up to 76 px. Responsive sizing preserves readability on phones. |
| Provide a complete ZIP | `artifacts/rory-jenkins-final-corrections.zip` contains the updated HTML, CSS, JavaScript, all supplied images, resume PDF, local fonts, Bootstrap and their licenses. `artifacts/rory-jenkins-original.zip` preserves the original supplied files. |
| Hosting, Wix domain and administrative access | Pending account access and chosen hosting destination. No live deployment or DNS changes have been made. |

## Editing artwork and text

Edit page text in its corresponding `.html` file. Shared typography, responsive layout and final corrections are in `css/style.css`. Font faces are in `css/fonts.css` and image-viewer behaviour is in `js/main.js`.

The illustration page uses `.illustration-opening` and `.artwork-story` for its gallery and image-description rows. The two new works use `-thumb.webp` images for the page and their full originals for `data-lightbox`. Keep image dimensions, alt text, captions and viewer targets consistent when editing artwork.

## Final correction decisions

The orange-headwrap illustration is retained beneath the two new artwork stories. The supplied Culture sample is implemented with the cover-and-contents image, the supplied descriptions and the four-stage process composite. Crossed-out article and beret-portrait panels are removed. The alternate beret replacement has no destination in that final sample.

Publication Design uses the existing `poster-design.html` route and includes the wrestling poster, automotive advertisement and Unseen Hands book with their supplied descriptions. The other existing poster projects and the separate Book Cover category remain available. The duplicate book-cover hero and its empty section are removed.

The Daybrave logo and slogan section use the supplied replacements. Rory’s portrait and the header logo are larger. The Osiris packaging row uses two columns to fill the marked gap. Stylesheet URLs include the final correction version so uploads refresh cached styles.

## Contact behaviour

The form validates required name, email and message fields, then opens an email draft addressed to `jenkins_rory@yahoo.com`. Visitors must send that draft in their own email app. It has no server-side delivery service or inbox integration. Direct email and phone links remain available. End-to-end email delivery has not been tested.

## Hosting handover

1. Use a hosting account owned by the client and upload the ZIP contents with `index.html` at the website root. Keep the relative asset paths intact. No database or application runtime is needed.
2. Review the temporary hosting URL before changing the domain. Check every project, full-size artwork, menu, mobile layout, resume and email draft behaviour.
3. Obtain the exact domain records from the chosen host. If the domain is registered at Wix, it can point to external hosting using the host's required A/CNAME records. See [Wix's official external-site connection guide](https://support.wix.com/en/article/connecting-a-wix-domain-to-an-external-site). Preserve existing mail-related DNS records.
4. Enable HTTPS and verify the bare and `www` domains. Keep the old hosting available until the new site has been checked.
5. Give the client ownership/admin access to hosting, domain/DNS, billing and source backups, with the next maintainer invited through the provider's normal account controls. This ZIP cannot grant access to those accounts.

This is a static HTML website. Connecting its domain does not make these files editable in the Wix visual editor. Asset ownership and transfer permission for the supplied artwork, logo and resume remain with their respective owners; no new artwork has been generated or substituted.

## Validation

See `artifacts/final-corrections-verification.txt` for source and local HTTP checks. All 13 pages and 105 referenced HTTP resources passed. New artwork and copy are implemented. Browser verification is incomplete because Computer Use could not establish Chrome’s current URL. Live hosting verification remains pending.

## Visible typography revision ? 15 November 2026

The latest client revision increases text sizes and centres text across all 13 pages. Constrained paragraphs, header accents, project metadata, filters, statistics and CTA text are also centred within their sections or columns. The stylesheet URL has a new version suffix so browsers request this revision after upload. Upload all HTML files and css/style.css together, or use the refreshed complete ZIP.
