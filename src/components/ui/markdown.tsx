'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  children: string;
}

export function Markdown({ children }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');

          if (!inline && match) {
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          }

          return (
            <code
              className="rounded bg-muted px-1 py-0.5"
              {...props}
            >
              {children}
            </code>
          );
        },

        h1: ({ children }) => (
          <h1 className="mb-4 text-3xl font-bold">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="mb-3 mt-6 text-2xl font-semibold">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="mb-2 mt-5 text-xl font-semibold">
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className="mb-3 leading-7">
            {children}
          </p>
        ),

        ul: ({ children }) => (
          <ul className="mb-4 list-disc pl-6">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="mb-4 list-decimal pl-6">
            {children}
          </ol>
        ),

        table: ({ children }) => (
          <table className="mb-4 w-full border-collapse border">
            {children}
          </table>
        ),

        th: ({ children }) => (
          <th className="border bg-muted p-2 text-left">
            {children}
          </th>
        ),

        td: ({ children }) => (
          <td className="border p-2">
            {children}
          </td>
        ),

        blockquote: ({ children }) => (
          <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}