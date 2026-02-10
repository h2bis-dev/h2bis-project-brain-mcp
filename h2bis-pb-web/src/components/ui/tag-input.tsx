"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    className?: string;
    maxTags?: number;
}

/**
 * Tag Input Component
 * Multi-select tag input with suggestions and custom tag support
 */
export function TagInput({
    value = [],
    onChange,
    suggestions = [],
    placeholder = "Type and press Enter...",
    className,
    maxTags,
}: TagInputProps) {
    const [inputValue, setInputValue] = React.useState("");
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Filter suggestions based on input and exclude already selected tags
    const filteredSuggestions = React.useMemo(() => {
        if (!inputValue.trim()) return suggestions;
        return suggestions.filter(
            (suggestion) =>
                suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
                !value.includes(suggestion)
        );
    }, [inputValue, suggestions, value]);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return;
        if (value.includes(trimmedTag)) return;
        if (maxTags && value.length >= maxTags) return;

        onChange([...value, trimmedTag]);
        setInputValue("");
        setShowSuggestions(false);
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (inputValue.trim()) {
                addTag(inputValue);
            }
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        addTag(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className={cn("w-full", className)}>
            {/* Tag display and input */}
            <div
                className={cn(
                    "flex min-h-[2.5rem] w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                )}
                onClick={() => inputRef.current?.focus()}
            >
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 pr-1"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTag(tag);
                            }}
                            className="ml-1 rounded-full hover:bg-muted-foreground/20"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <Input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[120px]"
                    disabled={maxTags ? value.length >= maxTags : false}
                />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="relative">
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
                        {filteredSuggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
