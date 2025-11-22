// In app/dashboard/components/views/PlanView.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlanView({ data }: { data: any }) {
    return (
        <div className="h-full p-4 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Implementation Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">To Do</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data?.nodes?.slice(0, 2).map((node: any, i: number) => (
                            <div key={i} className="p-2 bg-muted rounded text-sm">{node.label}</div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data?.nodes?.slice(2, 4).map((node: any, i: number) => (
                            <div key={i} className="p-2 bg-muted rounded text-sm">{node.label}</div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Done</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data?.nodes?.slice(4).map((node: any, i: number) => (
                            <div key={i} className="p-2 bg-muted rounded text-sm">{node.label}</div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
