'use client'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

/**
 * Renders question/solution markdown with $...$ / $$...$$ LaTeX.
 * Trusted content only (admin-authored solutions); user content must never pass here.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`prose-question break-words text-[15px] leading-relaxed ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false, output: 'html' }]]}
        components={{
          img: () => null, // no raw images in markdown; diagrams come via QuestionDiagram
          a: (props) => <a {...props} target="_blank" rel="noreferrer" className="text-gold underline underline-offset-2" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
