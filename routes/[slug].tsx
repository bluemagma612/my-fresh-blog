import { Handlers, PageProps } from "$fresh/server.ts";
import { getPost } from "@/utils/posts.ts";
import type { Post } from "@/models/Post.interface.ts";
import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const post = await getPost(ctx.params.slug);
    if (post === null) return ctx.renderNotFound();
    return ctx.render(post);
  },
};


export default function PostPage(props: PageProps<Post>) {
  const post = props.data;
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      // ...
      <div
        class="mt-8 markdown-body"
        dangerouslySetInnerHTML={{ __html: render(post.content) }}
      />
    </>
  );
}