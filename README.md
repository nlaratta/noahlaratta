# Noah Laratta's Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features include a projects showcase, technical blog, and contact form.

## Features

- 🎨 Modern, responsive design with sage green theme
- 🚀 Built with Next.js, TypeScript, and Tailwind CSS
- ✨ Smooth animations using Framer Motion
- 📱 Mobile-friendly navigation
- 📝 Technical blog with Markdown support
- 🔍 Project and blog post filtering
- 📬 Contact form with email integration
- 🌟 SEO optimized

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [MDX Remote](https://github.com/hashicorp/next-mdx-remote) - Markdown rendering
- [Nodemailer](https://nodemailer.com/) - Email sending

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   ```

4. Configure email settings:
   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Generate an App Password for the contact form
   - Update the `.env.local` file with your email and app password

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/components` - Reusable React components
- `/pages` - Next.js pages and API routes
- `/lib` - Data and utility functions
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configuration

## Deployment

### AWS Deployment

1. Set up an AWS account if you haven't already.

2. Install the AWS CLI and configure your credentials:
   ```bash
   aws configure
   ```

3. Create an S3 bucket for hosting:
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

4. Enable static website hosting:
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document 404.html
   ```

5. Build the project:
   ```bash
   npm run build
   ```

6. Deploy to S3:
   ```bash
   aws s3 sync out/ s3://your-bucket-name
   ```

7. Set up CloudFront for CDN (recommended).

### Alternative Deployment Options

- [Vercel](https://vercel.com/) - Easiest deployment option for Next.js
- [Netlify](https://www.netlify.com/) - Great for static sites
- [AWS Amplify](https://aws.amazon.com/amplify/) - Full-stack deployment on AWS

## Customization

1. Update personal information:
   - Edit social links in `components/Layout.tsx`
   - Modify project data in `lib/projects.ts`
   - Update blog posts in `lib/posts.ts`

2. Styling:
   - Modify the color scheme in `tailwind.config.ts`
   - Update global styles in `styles/globals.css`

3. Content:
   - Add your resume to `public/resume.pdf`
   - Update meta tags in `pages/_app.tsx`
   - Modify page content in respective page components

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Noah Laratta - [noahlaratta@gmail.com](mailto:noahlaratta@gmail.com)

Project Link: [https://github.com/yourusername/portfolio](https://github.com/yourusername/portfolio)
