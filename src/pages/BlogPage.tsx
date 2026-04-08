import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.getBlogPosts({ published: 'true' });
      setPosts(data.posts || data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Blog | AmazingOutfits</title>
        <meta name="description" content="Read the latest fashion tips, style guides, and news from AmazingOutfits." />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-display tracking-wider text-center mb-12">OUR <span className="text-primary">BLOG</span></h1>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden bg-card border-border">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-6"><Skeleton className="h-6 w-3/4 mb-3" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" /></CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16"><p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post._id} to={`/blog/${post.slug}`}>
                <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 group h-full">
                  {post.coverImage ? (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center"><span className="text-muted-foreground">No image</span></div>
                  )}
                  <CardContent className="p-6">
                    <p className="text-xs text-muted-foreground mb-2">{format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}</p>
                    <h2 className="text-xl font-display tracking-wide mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                    {post.excerpt && <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
