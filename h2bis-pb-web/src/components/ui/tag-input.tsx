"use client";

import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
 * Enhanced Tag Input Component with Checkboxes
 * Multi-select tag input with checkbox selection and improved dropdown UX
 */
export function TagInput({
    value = [],
    onChange,
    suggestions = [],
    placeholder = "Select items...",
    className,
    maxTags,
}: TagInputProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Filter suggestions based on search input
    const filteredSuggestions = React.useMemo(() => {
        if (!searchInput.trim()) return suggestions;
        return suggestions.filter((suggestion) =>
            suggestion.toLowerCase().includes(searchInput.toLowerCase())
        );
    }, [searchInput, suggestions]);

    // Handle click outside to close dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchInput("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTag = (tag: string) => {
        if (value.includes(tag)) {
            onChange(value.filter((t) => t !== tag));
        } else {
            if (maxTags && value.length >= maxTags) return;
            onChange([...value, tag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleContainerClick = () => {
        setIsOpen(true);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            setSearchInput("");
        } else if (e.key === "Backspace" && !searchInput && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            {/* Tag display */}
            <div
                className={cn(
                    "flex min-h-[2.5rem] w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer",
                    "hover:border-ring transition-colors",
                    isOpen && "ring-2 ring-ring ring-offset-2"
                )}
                onClick={handleContainerClick}
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
                <div className="flex flex-1 items-center justify-between min-w-[120px]">
                    <span className={cn(
                        "text-sm",
                        value.length === 0 ? "text-muted-foreground" : "text-transparent"
                    )}>
                        {value.length === 0 ? placeholder : ""}
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            isOpen && "transform rotate-180"
                        )}
                    />
                </div>
            </div>

            {/* Dropdown with custom input and checkboxes */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                    {/* Custom tag input at top */}
                    <div className="p-2 border-b">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (searchInput.trim()) {
                                            // Check if it matches a suggestion
                                            const matchingSuggestion = suggestions.find(
                                                s => s.toLowerCase() === searchInput.toLowerCase()
                                            );
                                            if (matchingSuggestion) {
                                                toggleTag(matchingSuggestion);
                                            } else {
                                                // Add as custom tag
                                                toggleTag(searchInput.trim());
                                            }
                                            setSearchInput("");
                                        }
                                    } else if (e.key === "Escape") {
                                        setIsOpen(false);
                                        setSearchInput("");
                                    }
                                }}
                                placeholder="Type to search or add custom..."
                                className="flex-1 px-3 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (searchInput.trim()) {
                                        // Check if it matches a suggestion
                                        const matchingSuggestion = suggestions.find(
                                            s => s.toLowerCase() === searchInput.toLowerCase()
                                        );
                                        if (matchingSuggestion) {
                                            toggleTag(matchingSuggestion);
                                        } else {
                                            // Add as custom tag
                                            toggleTag(searchInput.trim());
                                        }
                                        setSearchInput("");
                                        inputRef.current?.focus();
                                    }
                                }}
                                disabled={!searchInput.trim()}
                                className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Suggestions list */}
                    {filteredSuggestions.length > 0 ? (
                        <div className="max-h-48 overflow-auto p-1">
                            {filteredSuggestions.map((suggestion) => {
                                const isSelected = value.includes(suggestion);
                                return (
                                    <div
                                        key={suggestion}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleTag(suggestion);
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            isSelected && "bg-accent/50"
                                        )}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleTag(suggestion)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="flex-1">{suggestion}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : suggestions.length > 0 && searchInput ? (
                        <div className="p-3 text-sm text-muted-foreground text-center">
                            No matches found. Press "Add" or Enter to add as custom tag.
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
