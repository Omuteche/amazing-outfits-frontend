import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const data = await api.getBlogPost(slug!);
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" /><Skeleton className="aspect-video w-full mb-8" /><Skeleton className="h-12 w-3/4 mb-4" /><Skeleton className="h-4 w-48 mb-8" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-display mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | AmazingOutfits Blog</title>
        <meta name="description" content={post.excerpt || `Read ${post.title} on AmazingOutfits blog.`} />
      </Helmet>
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/blog"><Button variant="ghost" className="mb-8"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Button></Link>
        {post.coverImage && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-wide mb-4">{post.title}</h1>
        <p className="text-muted-foreground mb-8">{format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}</p>
        <div className="prose prose-invert max-w-none">
          {post.content ? (
            <div className="text-foreground leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="text-muted-foreground">No content available.</p>
          )}
        </div>
      </article>
    </Layout>
  );
}
