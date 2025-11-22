'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NodeInfoBoxProps {
    node: {
        id: string;
        label: string;
        description?: string;
        source?: string;
    };
    position: { x: number; y: number };
    onClose: () => void;
    onChatClick: () => void;
}

export function NodeInfoBox({ node, position, onClose, onChatClick }: NodeInfoBoxProps) {
    const boxRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        // Add a small delay before attaching listener to prevent immediate close
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Calculate position to ensure box stays in viewport
    const calculatePosition = () => {
        const offset = 20; // Distance from node
        const boxWidth = 320; // Approximate box width
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = position.x + offset;
        let y = position.y;

        // If box would go off right edge, place it to the left of the node
        if (x + boxWidth > viewportWidth - 20) {
            x = position.x - boxWidth - offset;
        }

        // Ensure box doesn't go off top or bottom
        y = Math.max(20, Math.min(y, viewportHeight - 400));

        return { x, y };
    };

    const { x, y } = calculatePosition();

    return (
        <AnimatePresence>
            <motion.div
                ref={boxRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                    position: 'fixed',
                    left: `${x}px`,
                    top: `${y}px`,
                    zIndex: 1000,
                }}
                className="w-80"
            >
                <Card className="shadow-2xl border-2 backdrop-blur-sm bg-background/95">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{node.label}</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mt-1 -mr-2"
                                onClick={onClose}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pb-3">
                        {node.description && (
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Description</h4>
                                <p className="text-sm leading-relaxed">{node.description}</p>
                            </div>
                        )}

                        {node.source && (
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Source</h4>
                                <blockquote className="text-sm italic border-l-2 border-primary pl-3 py-1 bg-muted/50 rounded-r">
                                    "{node.source}"
                                </blockquote>
                            </div>
                        )}

                        {!node.description && !node.source && (
                            <p className="text-sm text-muted-foreground italic">
                                No additional information available for this concept.
                            </p>
                        )}
                    </CardContent>

                    <CardFooter>
                        <Button
                            onClick={onChatClick}
                            className="w-full"
                            size="sm"
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat About This
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
