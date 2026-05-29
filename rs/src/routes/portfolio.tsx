/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portfolio")({
    component: PortfolioPage,
});

export function PortfolioPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <h1 className="text-5xl font-bold">Portfolio Page</h1>
        </div>
    );
}