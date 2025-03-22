
import { join } from "$std/path/mod.ts";
import { Post } from "@/models/Post.interface.ts"
import { extract } from "@std/front-matter/any";


export async function getPost(slug: string): Promise<Post | null> {
  const text = await Deno.readTextFile(join("./posts", `${slug}.md`));
  const { attrs, body } = extract<Post>(text);
  return {
    slug,
    title: attrs.title as string,
    publishedAt: new Date(attrs.publishedAt),
    content: body,
    snippet: attrs.snippet as string,
  };
}

export async function getPosts(): Promise<Post[]> {
  const files = Deno.readDir("./posts");
  const promises = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getPost(slug));
  }
  const posts = await Promise.all(promises) as Post[];
  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return posts;
}