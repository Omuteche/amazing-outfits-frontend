import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from './AdminLayout';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  isPublished?: boolean;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', content: '', coverImage: '', isPublished: false });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.getBlogPosts({});
      setPosts(data.posts || data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', excerpt: '', content: '', coverImage: '', isPublished: false });
    setEditing(null);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage || '',
      isPublished: post.isPublished ?? false,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      coverImage: formData.coverImage || null,
      isPublished: formData.isPublished,
    };

    try {
      if (editing) {
        await api.updateBlogPost(editing._id, postData);
        toast.success('Post updated');
      } else {
        await api.createBlogPost(postData);
        toast.success('Post created');
      }
      setDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.deleteBlogPost(id);
      toast.success('Post deleted');
      fetchPosts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <Helmet><title>Blog | Admin | AmazingOutfits</title></Helmet>
      <AdminLayout title="Blog Posts">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{posts.length} posts</p>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild><Button className="btn-neon"><Plus className="h-4 w-4 mr-2" /> Add Post</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Post</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Title *</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
                <div><Label>Slug</Label><Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
                <div><Label>Cover Image</Label><ImageUpload value={formData.coverImage} onChange={(url) => setFormData({...formData, coverImage: url})} folder="blog" /></div>
                <div><Label>Excerpt</Label><Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows={2} /></div>
                <div><Label>Content</Label><Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={8} /></div>
                <div className="flex items-center gap-2"><Switch checked={formData.isPublished} onCheckedChange={v => setFormData({...formData, isPublished: v})} /><Label>Published</Label></div>
                <Button type="submit" className="w-full btn-neon">{editing ? 'Update' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post._id} className="glass-card rounded-lg p-4 flex gap-4 items-center">
                {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-24 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${post.isPublished ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(post)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(post._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
