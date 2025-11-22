import { Card, CardContent } from "@/components/ui/card";

export function TimelineView({ data }: { data: any }) {
    return (
        <div className="h-full p-4 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Timeline View</h3>
            <div className="space-y-4">
                {data?.nodes?.map((node: any, index: number) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span className="font-medium">{node.label}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
