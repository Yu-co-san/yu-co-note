import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Yu-co note`,
    author: `Yu-co`,
    description: `London生活・ショップ・料理・ダイエットのブログ`,
    image: "/icons/icon-512x512.png",
    siteUrl: `https://yuco-note.net`,
    social: { twitter: `#TODO`, github: `#TODO` },
    siteRecaptchaKey: "6LcDhqoZAAAAAITsw5yKmHo_iLzSJCcGluefKYFT",
    adsense: { clientKey: "ca-pub-7416328580394075", slot1: "4572443902" },
  },
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: { path: `${__dirname}/blog`, name: `blog` },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { path: `${__dirname}/src/images`, name: `images` },
    },
    `gatsby-plugin-styled-components`,
    { resolve: `gatsby-plugin-sitemap`, options: { excludes: ["/tags/*"] } },
    `gatsby-plugin-slug`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: { siteUrl: `https://yuco-note.net` },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: { offsetY: 80, icon: false, maintainCase: false },
          },
          { resolve: `gatsby-remark-images`, options: { maxWidth: 800 } },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: { wrapperStyle: `margin-bottom: 1.0725rem` },
          },
          {
            resolve: `gatsby-remark-emojis`,
            options: {
              active: true,
              class: "emoji-icon",
              size: 64,
              styles: {
                display: "inline",
                margin: "0",
                "margin-top": "0px",
                "margin-right": "3px",
                "margin-left": "3px",
                position: "relative",
                top: "5px",
                width: "20px",
              },
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: { target: "_blank", rel: "noopener" },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: "gatsby-remark-katex",
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-transformer-sharp`,
      options: {
        // The option defaults to true
        checkSupportedExtensions: false,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: { trackingIds: ["G-JE34EXKM6J", "GT-5D4TCC3"] },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({
              query: { site, allMarkdownRemark },
            }: {
              query: {
                site: Queries.Site
                allMarkdownRemark: Queries.Query["allMarkdownRemark"]
              }
            }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url:
                    site.siteMetadata.siteUrl +
                    `/${edge.node.frontmatter.slug}/`,
                  guid:
                    site.siteMetadata.siteUrl +
                    `/${edge.node.frontmatter.slug}/`,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `{
              allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
                edges {
                  node {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                      slug
                    }
                  }
                }
              }
            }`,
            output: "/rss.xml",
            title: "Yuco-note RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Yu-co note`,
        short_name: `Yu-co note`,
        start_url: `/`,
        background_color: `#fcf8fb`,
        theme_color: `#B6666F`,
        display: `minimal-ui`,
        icon: `${__dirname}/src/images/dinosaur-icon.png`,
      },
    },
    `gatsby-plugin-twitter`,
    `gatsby-plugin-offline`,
  ],
}

export default config
