export interface Post {
  id: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
}

export const posts: Post[] = [
  {
    id: 'blog-post-1',
    title: 'Placeholder',
    date: '2024-01-15',
    excerpt: 'Placeholder',
    content: `
Placeholder
    `,
    tags: ['Placeholder']
  },
  {
    id: 'blog-post-2',
    title: 'Placeholder2',
    date: '2024-01-15',
    excerpt: 'Placeholder2',
    content: `
Placeholder2
    `,
    tags: ['Placeholder2']
  },
]

export const getAllPosts = () => posts

export const getPostById = (id: string) => posts.find(post => post.id === id)

export const getPostsByTag = (tag: string) => 
  posts.filter(post => post.tags.includes(tag))

export const getAllTags = () => {
  const tags = new Set<string>()
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
} 