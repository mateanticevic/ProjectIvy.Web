import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
    content?: string | null;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
    const value = (content ?? '').trim();

    if (!value) {
        return <div className="text-muted">No description preview</div>;
    }

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
                a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            }}
        >
            {value}
        </ReactMarkdown>
    );
};

export default MarkdownPreview;