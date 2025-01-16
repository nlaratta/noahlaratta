import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import { Post, getAllPosts, getAllTags } from '../lib/posts'

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const posts = getAllPosts()
  const tags = getAllTags()

  const filteredPosts = selectedTags.length > 0
    ? posts.filter(post => 
        selectedTags.some(tag => post.tags.includes(tag))
      )
    : posts

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Layout title="Blog | Noah Laratta">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Technical <span className="text-sage">Blog</span>
        </h1>

        {/* Tag filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter by Topic:</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-sage text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-sage/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Posts list */}
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4">
            {filteredPosts.map(post => (
              <motion.div
                key={post.id}
                layoutId={`post-${post.id}`}
                onClick={() => setSelectedPost(post)}
                className={`p-6 rounded-lg shadow-md cursor-pointer transition-colors duration-300 ${
                  selectedPost?.id === post.id
                    ? 'bg-sage text-white'
                    : 'bg-white hover:bg-sage/5'
                }`}
              >
                <h3 className={`text-xl font-semibold mb-2 ${
                  selectedPost?.id === post.id ? 'text-white' : 'text-sage'
                }`}>
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(post.date)}
                </p>
                <p className={`mb-4 ${
                  selectedPost?.id === post.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-sm px-2 py-1 rounded ${
                        selectedPost?.id === post.id
                          ? 'bg-white/20 text-white'
                          : 'bg-sage/10 text-sage'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Post content */}
          <div className="lg:sticky lg:top-4 h-fit">
            <AnimatePresence mode="wait">
              {selectedPost ? (
                <motion.div
                  key={selectedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 rounded-lg shadow-lg"
                >
                  <h2 className="text-3xl font-bold text-sage mb-2">{selectedPost.title}</h2>
                  <p className="text-gray-500 mb-6">{formatDate(selectedPost.date)}</p>
                  <div className="prose prose-lg max-w-none">
                    <div className="markdown-content">
                      {selectedPost.content}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-2">
                    {selectedPost.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-sage/10 text-sage px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-8 rounded-lg shadow-lg text-center"
                >
                  <p className="text-gray-600">Select a post to start reading</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
} 