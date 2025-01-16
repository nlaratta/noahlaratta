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
    id: 'debugging-multithreading',
    title: 'Advanced Debugging Techniques for Multithreaded Applications',
    date: '2024-01-15',
    excerpt: 'Learn effective strategies for debugging complex multithreaded applications and avoiding common pitfalls.',
    content: `
# Advanced Debugging Techniques for Multithreaded Applications

Debugging multithreaded applications can be challenging due to race conditions, deadlocks, and timing-dependent issues. In this post, we'll explore effective strategies for identifying and resolving these problems.

## Common Challenges

1. Race Conditions
   - Multiple threads accessing shared resources
   - Non-deterministic behavior
   - Difficult to reproduce issues

2. Deadlocks
   - Circular dependencies between threads
   - Resource contention
   - System hangs

## Debugging Strategies

### 1. Logging and Tracing

\`\`\`python
import logging
import threading

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def worker():
    thread_id = threading.get_ident()
    logger.debug(f"Thread {thread_id} starting...")
    # Your code here
    logger.debug(f"Thread {thread_id} finished.")
\`\`\`

### 2. Thread Sanitizers

Modern compilers often include thread sanitizers that can help detect race conditions and other threading issues.

### 3. Deadlock Detection

\`\`\`python
import threading
import time

def detect_deadlock():
    while True:
        time.sleep(1)
        if threading.main_thread().is_alive():
            for thread in threading.enumerate():
                if thread.daemon:
                    continue
                print(f"Thread {thread.name} is {'alive' if thread.is_alive() else 'dead'}")
\`\`\`

## Best Practices

1. Use thread-safe data structures
2. Implement proper synchronization
3. Avoid nested locks
4. Keep critical sections small
5. Use higher-level abstractions when possible

Remember: The key to successful debugging is reproducibility. Always try to create a minimal test case that demonstrates the issue.
    `,
    tags: ['debugging', 'multithreading', 'python', 'tips']
  },
  {
    id: 'aws-lambda-optimization',
    title: 'Optimizing AWS Lambda Functions for Performance',
    date: '2024-02-01',
    excerpt: 'Tips and tricks for improving the performance and cost-efficiency of your AWS Lambda functions.',
    content: `
# Optimizing AWS Lambda Functions for Performance

AWS Lambda is a powerful serverless compute service, but optimizing its performance requires understanding several key concepts and best practices.

## Key Optimization Areas

### 1. Cold Start Optimization

Cold starts can significantly impact performance. Here are some strategies to minimize their impact:

\`\`\`javascript
// Bad: Loading dependencies inside handler
exports.handler = async (event) => {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    // ...
}

// Good: Loading dependencies outside handler
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    // ...
}
\`\`\`

### 2. Memory Configuration

Choose the right memory configuration for your function:

- More memory = More CPU power
- Find the sweet spot between cost and performance
- Use AWS Lambda Power Tuning tool

### 3. Code Optimization

\`\`\`javascript
// Bad: Creating new connections for each invocation
exports.handler = async (event) => {
    const connection = await createConnection();
    // ...
    await connection.close();
}

// Good: Reuse connections
let connection;

exports.handler = async (event) => {
    if (!connection) {
        connection = await createConnection();
    }
    // ...
}
\`\`\`

## Monitoring and Metrics

1. CloudWatch Metrics to monitor:
   - Duration
   - Memory usage
   - Error rates
   - Concurrent executions

2. X-Ray for tracing:
   - Identify bottlenecks
   - Analyze dependencies
   - Track external calls

## Cost Optimization

1. Right-size memory allocation
2. Implement proper timeouts
3. Use provisioned concurrency when needed
4. Clean up resources properly

Remember: Always test your optimizations under real-world conditions and load patterns.
    `,
    tags: ['aws', 'lambda', 'performance', 'serverless']
  }
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