# How to deploy dimolaw.com

The site deploys itself through Vercel whenever GitHub receives a push. You never run a deploy command.

## Normal change

1. **Make a branch:** `git checkout -b my-change`
2. **Edit, then run the scripts that apply** (see the README): sitemap dates always; FAQ schema if `/faq` changed.
3. **Commit and push the branch:** `git push -u origin my-change`
4. **Check the preview.** Vercel builds a private preview URL in about a minute. Find it on the branch's latest commit in GitHub (the Vercel check) or in the Vercel dashboard under project `dimopoulos` → Deployments. You must be logged in to Vercel to open it.
5. **Merge to `main`** when the preview looks right. The push to `main` deploys to https://www.dimolaw.com within a couple of minutes.

## After a deploy that changes pages

- New page added: resubmit `sitemap.xml` in Google Search Console (Indexing → Sitemaps).
- Important page rewritten: optionally use URL Inspection → Request indexing in Search Console.

## If something breaks

In the Vercel dashboard, open project `dimopoulos` → Deployments, find the last good production deployment, and use **Promote** (or **Instant Rollback**) to put it back while you fix the problem on a branch.
