import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  lines?: number;
  initialExpanded?: boolean;
  className?: string;
}

export const ExpandableText = ({
  text,
  lines = 3,
  initialExpanded = false,
  className = "",
}: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const shouldShowToggle = text?.length > 200;

  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      <div
        className={`transition-all duration-300 ease-in-out ${
          expanded ? "" : `line-clamp-${lines}`
        }`}
      >
        {text}
      </div>
      {shouldShowToggle && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-blue-500 hover:underline"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};
