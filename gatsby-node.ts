import path from "path";
import { GatsbyNode } from "gatsby";
import { extractRelatedPosts, defaultConfig } from "./gatsby-related-post";
import { LatestPost, Post } from "./src/types/Post";
import BlogPostTemplate from "./src/templates/blog-post/";

// interface CreatePagesQuery {
//   allMarkdownRemark: {
//     edges: Post[];
//   };
// }

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions;
  const blogPost = path.resolve(`./src/templates/blog-post/index.tsx`);
  const tagPage = path.resolve(`./src/templates/tag-page/index.tsx`);
  const result = await graphql<Queries.CreatePagesQuery>(
    `query CreatePages
      {
        allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 1000) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                date(formatString: "YYYY-MM-DD")
                tags
                slug
                keywords
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }
  if (result.data === undefined) {
    throw new Error("No blog posts");
  }
  // 記事個別ページ //
  const posts = result.data.allMarkdownRemark.edges;
  posts.forEach((post, index) => {
    // 次の記事と前の記事 //
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    // 最新記事 //
    const latestPosts_temp: LatestPost[] = [];
    posts.map((e) => {
      // 自分を除外 //
      if (e.node.frontmatter?.slug !== post.node.frontmatter?.slug) {
        const frontmatter = e.node.frontmatter;
        const temp: LatestPost = {
          title: frontmatter?.title || '',
          slug: frontmatter?.slug || '',
          date: frontmatter?.date || '',
        };
        latestPosts_temp.push(temp);
      }
    });
    const latestPosts: LatestPost[] = latestPosts_temp.slice(0, 5);
    // 関連記事 //
    const relatedPosts = extractRelatedPosts(posts, post, defaultConfig);
    // 記事ページ生成 //
    createPage({
      path: `/${post.node.frontmatter.slug}/`,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        relatedPosts,
        latestPosts,
        previous,
        next,
      },
    });
  });

  // tagページ //
  const tagListTemp: string[] = [];
  posts.forEach((post) => {
    const tags = post.node.frontmatter.tags;
    tags.forEach((tag) => {
      tagListTemp.push(tag);
    });
  });
  // 被ってるタグを削除して配列に再変換 //
  const tagSet = new Set(tagListTemp);
  const tagList = Array.from(tagSet);
  // タグページ生成 //
  if (tagList.length !== 0) {
    tagList.forEach((tag) => {
      createPage({
        path: `/tags/${tag}/`,
        component: tagPage,
        context: {
          slug: tag,
        },
      });
    });
  }
};
