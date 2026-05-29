/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
    component: ContactPage,
});

export function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <h1 className="text-5xl font-bold">Contact Page</h1>
        </div>
    );
}