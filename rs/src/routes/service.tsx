/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/service")({
    component: ServicePage,
});

export function ServicePage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <h1 className="text-5xl font-bold">Service Page</h1>
        </div>
    );
}