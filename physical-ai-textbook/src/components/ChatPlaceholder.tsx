import React from 'react';

export interface ChatPlaceholderProps {
  message?: string;
}

export default function ChatPlaceholder({ message = 'Coming Soon' }: ChatPlaceholderProps): React.JSX.Element {
  return (
    <div className="tw-my-6 tw-p-6 tw-bg-gray-800 tw-rounded-lg tw-border tw-border-gray-700">
      <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
        <span className="tw-text-2xl">💬</span>
        <h3 className="tw-text-xl tw-font-semibold tw-text-cyber-cyan tw-m-0">Chat with AI Assistant</h3>
      </div>

      <div className="tw-bg-gray-900 tw-rounded tw-p-4 tw-mb-4 tw-min-h-[120px] tw-flex tw-items-center tw-justify-center">
        <p className="tw-text-gray-400 tw-text-center tw-m-0">
          <span className="tw-text-lg tw-font-semibold tw-block tw-mb-2">{message}</span>
          <span className="tw-text-sm">Interactive RAG chatbot will be available in a future release</span>
        </p>
      </div>

      <div className="tw-flex tw-gap-2">
        <input
          type="text"
          placeholder="Ask a question about this chapter..."
          disabled
          className="tw-flex-1 tw-px-4 tw-py-2 tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded tw-text-gray-500 tw-cursor-not-allowed"
        />
        <button
          disabled
          className="tw-px-6 tw-py-2 tw-bg-gray-700 tw-text-gray-500 tw-rounded tw-cursor-not-allowed">
          Send
        </button>
      </div>
    </div>
  );
}
