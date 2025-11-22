// In app/dashboard/components/views/PlanView.tsx
"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PlanViewProps {
    data: any
}

export function PlanView({ data }: PlanViewProps) {
    // Mock action plan items - will be AI-generated in future
    const planItems = [
        {
            id: 1,
            title: "Understand Core Concepts",
            description: "Review the fundamental concepts from the document",
            completed: true
        },
        {
            id: 2,
            title: "Create Practice Questions",
            description: "Generate and solve practice questions based on key topics",
            completed: false
        },
        {
            id: 3,
            title: "Review Mind Map",
            description: "Study the connections between different concepts",
            completed: false
        },
        {
            id: 4,
            title: "Test Knowledge",
            description: "Take the quiz to assess understanding",
            completed: false
        }
    ]

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Upload a document to generate an action plan.
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full p-6 overflow-auto"
        >
            <div className="max-w-3xl mx-auto space-y-4">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Learning Action Plan</h2>
                    <p className="text-muted-foreground">
                        Follow this structured plan to master the content
                    </p>
                </div>

                {planItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={item.completed ? "border-primary/50 bg-primary/5" : ""}>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    {item.completed ? (
                                        <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
                                    ) : (
                                        <Circle className="h-6 w-6 text-muted-foreground mt-1" />
                                    )}
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{item.title}</CardTitle>
                                        <CardDescription className="mt-2">
                                            {item.description}
                                        </CardDescription>
                                    </div>
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Step {index + 1}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
