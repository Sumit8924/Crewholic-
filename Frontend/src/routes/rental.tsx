/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";

export const Route = createFileRoute("/rental")({
    component: RentalPanel,
});

const ACCENT = "#4ECDC4";
const ACCENT2 = "#0097FF";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface RentalOrder {
    _id?: string;
    id?: string;
    name: string;
    mobile: string;
    email: string;
    productId: number;
    productName: string;
    categoryName: string;
    pricePerDay: number;
    rentalDays: number;
    totalPrice: number;
    requirements?: string;
    status?: "pending" | "confirmed" | "active" | "completed" | "cancelled"
    | "Pending" | "Confirmed" | "Active" | "Returned" | "Cancelled";
    createdAt?: string;
    updatedAt?: string;
    // Documents uploaded by admin
    productImages?: string[];       // URLs of product photos (min 5)
    customerAadhar?: string;        // URL of Aadhar photo
    agreementDoc?: string;          // URL of signed agreement
    documents?: DocumentEntry[];    // all docs with labels
}

interface DocumentEntry {
    label: string;
    url: string;
    uploadedAt: string;
    type: "product_image" | "aadhar" | "agreement" | "other";
}

interface ServiceInquiry {
    _id?: string;
    id?: string;
    name: string;
    mobile: string;
    email: string;
    service: string;
    timeline: string;
    requirements?: string;
    status?: "Pending" | "Contacted" | "Closed";
    createdAt?: string;
}

interface ProductAvailability {
    productId: number;
    productName: string;
    categoryName: string;
    isAvailable: boolean;
    unavailableReason?: string;
    updatedAt?: string;
}

// ─── RENTAL CATALOG ──────────────────────────────────────────────────────────
const RENTAL_CATALOG = [
    {
        category: "Cameras",
        items: [
            { id: 1, name: "Canon EOS 200d mark2", price: 700, originalPrice: 1200, specs: "24.1MP, 4K Video" },
            { id: 2, name: "Canon EOS 200d", price: 600, originalPrice: 1000, specs: "24.2MP, Full HD" },
            { id: 3, name: "Canon m50", price: 1500, originalPrice: 2500, specs: "24.1MP, 4K, Mirrorless" },
            { id: 4, name: "Sony alpha 7 mark 3", price: 2500, originalPrice: 4000, specs: "24.2MP, Full Frame, 4K" },
            { id: 5, name: "Sony alpha 7 mark 4", price: 3000, originalPrice: 5000, specs: "33MP, Full Frame, 4K 60fps" },
            { id: 6, name: "Sony zv e10", price: 2000, originalPrice: 3500, specs: "24.2MP, 4K, Vlogging" },
            { id: 7, name: "Sony fx3", price: 3500, originalPrice: 5500, specs: "10.2MP, 4K 120fps, Cinema" },
            { id: 8, name: "Sony nx100", price: 1500, originalPrice: 2800, specs: "Camcorder, 4K" },
            { id: 9, name: "Insta 360 x3", price: 1000, originalPrice: 1800, specs: "5.7K, 360° Camera" },
            { id: 10, name: "GoPro 12", price: 800, originalPrice: 1500, specs: "5.3K, Action Camera" },
        ],
    },
    {
        category: "Gimbals & Stabilizers",
        items: [
            { id: 11, name: "DJI RS Mini", price: 1000, originalPrice: 1800, specs: "Compact, Lightweight" },
            { id: 12, name: "DJI RS4", price: 1500, originalPrice: 2500, specs: "Professional, Payload 3kg" },
            { id: 13, name: "DJI Mobile Gimbal", price: 400, originalPrice: 800, specs: "For Smartphones" },
        ],
    },
    {
        category: "Drones",
        items: [
            { id: 14, name: "DJI Mini 4 Pro", price: 2500, originalPrice: 4500, specs: "4K HDR, 45min Flight" },
            { id: 15, name: "DJI Air 3S", price: 2500, originalPrice: 4200, specs: "Dual Camera, 4K" },
            { id: 16, name: "DJI Neo 2", price: 2000, originalPrice: 3500, specs: "Compact, 4K" },
        ],
    },
];

const ALL_ITEMS = RENTAL_CATALOG.flatMap(cat =>
    cat.items.map(item => ({ ...item, categoryName: cat.category }))
);

const AVAILABILITY_STORAGE_KEY = "crewholic_product_availability";

const readAvailabilityFromStorage = (): Record<number, { isAvailable: boolean; reason: string; updatedAt: string }> => {
    try {
        const raw = localStorage.getItem(AVAILABILITY_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const saveAvailabilityToStorage = (map: Record<number, { isAvailable: boolean; reason: string; updatedAt: string }>) => {
    try {
        localStorage.setItem(AVAILABILITY_STORAGE_KEY, JSON.stringify(map));
        window.dispatchEvent(new Event("crewholicAvailabilityUpdated"));
    } catch {
        // ignore localStorage errors
    }
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "orders", label: "Rental Orders", icon: "◈" },
    { id: "availability", label: "Availability", icon: "◎" },
    { id: "catalog", label: "Equipment Catalog", icon: "▦" },
    { id: "customers", label: "Customers", icon: "◑" },
    { id: "inquiries", label: "Service Inquiries", icon: "◉" },
    { id: "reports", label: "Reports", icon: "◆" },
];

// ─── STATUS COLORS ───────────────────────────────────────────────────────────
const statusColor: Record<string, { bg: string; text: string }> = {
    Pending: { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    Confirmed: { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
    Active: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    Returned: { bg: "rgba(136,136,170,0.12)", text: "#888899" },
    Cancelled: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    Contacted: { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
    Closed: { bg: "rgba(136,136,170,0.12)", text: "#888899" },
    pending: { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    confirmed: { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
    active: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    completed: { bg: "rgba(136,136,170,0.12)", text: "#888899" },
    cancelled: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatINR = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const formatINRShort = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return formatINR(n);
};
const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const formatDateTime = (d?: string) =>
    d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
const normalizeStatus = (s?: string) => {
    if (!s) return "Pending";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

// ─── AUTH HEADER ─────────────────────────────────────────────────────────────
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── API ─────────────────────────────────────────────────────────────────────
const Api = {
    async get<T>(path: string): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, { headers: { ...getAuthHeader() } });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
    },
    async patch<T>(path: string, data: any): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...getAuthHeader() },
            body: JSON.stringify(data),
        });
        if (!res.ok) { const t = await res.text(); throw new Error(`${res.status} ${t}`); }
        const text = await res.text();
        return text ? JSON.parse(text) : ({} as T);
    },
    async delete(path: string): Promise<void> {
        const res = await fetch(`${API_BASE}${path}`, { method: "DELETE", headers: { ...getAuthHeader() } });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    },
    async uploadFile(path: string, formData: FormData): Promise<any> {
        const res = await fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers: { ...getAuthHeader() },
            body: formData,
        });
        if (!res.ok) { const t = await res.text(); throw new Error(`${res.status} ${t}`); }
        return res.json();
    },
    async tryGetList<T>(paths: string[]): Promise<T[]> {
        for (const p of paths) {
            try {
                const data = await this.get<any>(p);
                if (Array.isArray(data)) return data;
                if (Array.isArray(data?.data)) return data.data;
                if (Array.isArray(data?.orders)) return data.orders;
                if (Array.isArray(data?.inquiries)) return data.inquiries;
                if (Array.isArray(data?.rentals)) return data.rentals;
            } catch { /* try next */ }
        }
        return [];
    },
};

// ─── DATA HOOK ───────────────────────────────────────────────────────────────
function useApi<T>(fn: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const refetch = useCallback(async () => {
        setLoading(true); setError(null);
        try { setData(await fn()); }
        catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => { refetch(); }, [refetch]);
    return { data, loading, error, refetch };
}

// ─── SHARED UI ───────────────────────────────────────────────────────────────
const Badge = ({ s }: { s: string }) => {
    const normalized = normalizeStatus(s);
    const st = statusColor[s] || statusColor[normalized] || { bg: "#1E1F2A", text: "#888" };
    return <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: st.bg, color: st.text, fontWeight: 600 }}>{normalized}</span>;
};

const LoadingSpinner = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
        <div style={{ width: 40, height: 40, border: `3px solid #1E1F2A`, borderTop: `3px solid ${ACCENT}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 13, color: "#555577" }}>Loading…</p>
    </div>
);

const ErrorBox = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div style={{ background: "#13141C", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <p style={{ fontSize: 14, color: "#FF6B6B", fontWeight: 600, marginBottom: 8 }}>Failed to connect</p>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>{message}</p>
        <button onClick={onRetry} style={{ fontSize: 12, color: "#000", background: ACCENT, border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Retry</button>
    </div>
);

const EmptyState = ({ message, hint }: { message: string; hint?: string }) => (
    <div style={{ padding: 60, textAlign: "center", color: "#555577" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
        <p style={{ fontSize: 14, marginBottom: hint ? 8 : 0 }}>{message}</p>
        {hint && <p style={{ fontSize: 11, color: "#444" }}>{hint}</p>}
    </div>
);

function ConfirmModal({ isOpen, message, onConfirm, onCancel }: { isOpen: boolean; message: string; onConfirm: () => void; onCancel: () => void }) {
    if (!isOpen) return null;
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 12, width: "100%", maxWidth: 380, padding: 24 }}>
                <p style={{ fontSize: 14, color: "#E8E8EF", marginBottom: 20, lineHeight: 1.6 }}>{message}</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onCancel} style={{ padding: "8px 18px", background: "transparent", border: "1px solid #1E1F2A", borderRadius: 6, color: "#888", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <button onClick={onConfirm} style={{ padding: "8px 18px", background: "#FF6B6B", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

// Toast hook
function useToast() {
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const show = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };
    const Toast = () => toast ? (
        <div style={{ position: "fixed", top: 70, right: 20, zIndex: 3000, background: toast.type === "success" ? "#00C9A7" : "#FF6B6B", color: "#000", padding: "10px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "fadeInDown 0.3s ease" }}>
            <style>{`@keyframes fadeInDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
            {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
        </div>
    ) : null;
    return { show, Toast };
}

// ─── FILE UPLOAD COMPONENT ───────────────────────────────────────────────────
function FileUploadZone({
    label, accept, multiple, onFiles, uploaded, hint, required,
}: {
    label: string;
    accept: string;
    multiple?: boolean;
    onFiles: (files: File[]) => void;
    uploaded?: string[];
    hint?: string;
    required?: boolean;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const arr = Array.from(files);
        onFiles(arr);
        const urls = arr.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...urls]);
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                {label} {required && <span style={{ color: "#FF6B6B" }}>*</span>}
            </label>
            {hint && <p style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>{hint}</p>}

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                style={{
                    border: `2px dashed ${dragging ? ACCENT : "#2A2B35"}`,
                    borderRadius: 10, padding: "20px 16px", textAlign: "center",
                    cursor: "pointer", transition: "all 0.2s",
                    background: dragging ? "rgba(78,205,196,0.05)" : "rgba(255,255,255,0.02)",
                }}
            >
                <div style={{ fontSize: 24, marginBottom: 6 }}>📁</div>
                <p style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>
                    Click or drag & drop files here
                </p>
                <p style={{ fontSize: 10, color: "#444" }}>{accept.replace(/,/g, ", ")}</p>
                <input ref={inputRef} type="file" accept={accept} multiple={multiple} style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
            </div>

            {/* New previews */}
            {previews.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                    {previews.map((url, i) => (
                        <div key={i} style={{ position: "relative" }}>
                            <img src={url} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: "1px solid #2A2B35" }} />
                            <button
                                onClick={() => setPreviews(prev => prev.filter((_, j) => j !== i))}
                                style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#FF6B6B", border: "none", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >×</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Already uploaded */}
            {uploaded && uploaded.length > 0 && (
                <div style={{ marginTop: 8 }}>
                    <p style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>Already uploaded:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {uploaded.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer">
                                <img src={url} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: `1px solid ${ACCENT}44` }} />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── DOCUMENT UPLOAD MODAL ───────────────────────────────────────────────────
function DocumentUploadModal({
    order,
    isOpen,
    onClose,
    onSuccess,
}: {
    order: RentalOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [productImages, setProductImages] = useState<File[]>([]);
    const [aadharFile, setAadharFile] = useState<File | null>(null);
    const [agreementFile, setAgreementFile] = useState<File | null>(null);
    const [otherFiles, setOtherFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const { show, Toast } = useToast();

    useEffect(() => {
        if (!isOpen) {
            setProductImages([]);
            setAadharFile(null);
            setAgreementFile(null);
            setOtherFiles([]);
            setProgress(0);
        }
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const orderId = order._id || order.id || "";
    const totalFiles = productImages.length + (aadharFile ? 1 : 0) + (agreementFile ? 1 : 0) + otherFiles.length;

    const handleUpload = async () => {
        if (productImages.length < 5) {
            show("Please upload at least 5 product images", "error");
            return;
        }
        if (!aadharFile) {
            show("Please upload customer Aadhar card", "error");
            return;
        }
        if (!agreementFile) {
            show("Please upload signed agreement document", "error");
            return;
        }

        setUploading(true);
        setProgress(10);

        try {
            const fd = new FormData();
            productImages.forEach(f => fd.append("productImages", f));
            fd.append("aadhar", aadharFile);
            fd.append("agreement", agreementFile);
            otherFiles.forEach(f => fd.append("otherDocs", f));
            fd.append("orderId", orderId);

            setProgress(40);

            const endpoints = [
                `/api/rental-inquiry/${orderId}/documents`,
            ];

            let success = false;
            for (const ep of endpoints) {
                try {
                    await Api.uploadFile(ep, fd);
                    success = true;
                    break;
                } catch { /* try next */ }
            }

            setProgress(100);
            if (success) {
                show("Documents uploaded successfully! ✓");
                setTimeout(() => { onSuccess(); onClose(); }, 1200);
            } else {
                show("Upload failed — backend endpoint not available", "error");
            }
        } catch (e: any) {
            show(e.message || "Upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Toast />
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 14, width: "100%", maxWidth: 700, maxHeight: "92vh", overflow: "auto" }}>

                    {/* Header */}
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#13141C", zIndex: 10 }}>
                        <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#E8E8EF", margin: 0 }}>📎 Upload Documents</h3>
                            <p style={{ fontSize: 10, color: "#555577", marginTop: 2 }}>Order: {order.productName} — {order.name}</p>
                        </div>
                        <button onClick={onClose} style={{ background: "none", border: "none", color: "#777", fontSize: 22, cursor: "pointer" }}>×</button>
                    </div>

                    <div style={{ padding: 20 }}>
                        {/* Progress bar */}
                        {uploading && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, color: "#888" }}>Uploading…</span>
                                    <span style={{ fontSize: 11, color: ACCENT }}>{progress}%</span>
                                </div>
                                <div style={{ height: 6, background: "#1E1F2A", borderRadius: 3 }}>
                                    <div style={{ height: "100%", width: `${progress}%`, background: ACCENT, borderRadius: 3, transition: "width 0.4s" }} />
                                </div>
                            </div>
                        )}

                        {/* Summary banner */}
                        <div style={{ background: "rgba(78,205,196,0.06)", border: `1px solid ${ACCENT}22`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 20, flexWrap: "wrap" }}>
                            {[
                                { label: "Product Images", count: productImages.length, required: 5, icon: "🖼️" },
                                { label: "Aadhar Card", count: aadharFile ? 1 : 0, required: 1, icon: "🪪" },
                                { label: "Agreement", count: agreementFile ? 1 : 0, required: 1, icon: "📄" },
                                { label: "Other Docs", count: otherFiles.length, required: 0, icon: "📎" },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: "center", flex: 1, minWidth: 80 }}>
                                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: s.count >= s.required && (s.required === 0 || s.count > 0) ? "#00C9A7" : "#FFA94D" }}>
                                        {s.count}{s.required > 0 ? `/${s.required}` : ""}
                                    </div>
                                    <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* 1 — Product Images */}
                        <div style={{ background: "#0F1017", borderRadius: 10, padding: 16, marginBottom: 14 }}>
                            <h4 style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 12 }}>
                                🖼️ Product Images <span style={{ color: "#FF6B6B" }}>*</span>
                                <span style={{ fontSize: 10, color: "#555", fontWeight: 400, marginLeft: 8 }}>Min 5 required</span>
                            </h4>
                            <FileUploadZone
                                label={`${productImages.length} image(s) selected`}
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onFiles={files => setProductImages(prev => [...prev, ...files])}
                                uploaded={order.productImages}
                                hint="Upload clear photos of the equipment from multiple angles (front, back, sides, accessories, any existing damage)"
                            />
                            {productImages.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                                    {productImages.map((f, i) => (
                                        <div key={i} style={{ position: "relative" }}>
                                            <img src={URL.createObjectURL(f)} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: `1px solid ${ACCENT}44` }} />
                                            <button onClick={() => setProductImages(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#FF6B6B", border: "none", color: "#fff", fontSize: 10, cursor: "pointer" }}>×</button>
                                            <div style={{ fontSize: 8, color: "#666", textAlign: "center", marginTop: 2, maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {productImages.length < 5 && productImages.length > 0 && (
                                <p style={{ fontSize: 10, color: "#FFA94D", marginTop: 8 }}>
                                    ⚠️ Need {5 - productImages.length} more image(s)
                                </p>
                            )}
                            {productImages.length >= 5 && (
                                <p style={{ fontSize: 10, color: "#00C9A7", marginTop: 8 }}>✓ Minimum requirement met</p>
                            )}
                        </div>

                        {/* 2 — Aadhar Card */}
                        <div style={{ background: "#0F1017", borderRadius: 10, padding: 16, marginBottom: 14 }}>
                            <h4 style={{ fontSize: 12, fontWeight: 600, color: "#FFD93D", marginBottom: 12 }}>
                                🪪 Customer Aadhar Card <span style={{ color: "#FF6B6B" }}>*</span>
                            </h4>
                            <div
                                onClick={() => document.getElementById("aadhar-input")?.click()}
                                style={{ border: `2px dashed ${aadharFile ? "#00C9A7" : "#2A2B35"}`, borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer", background: aadharFile ? "rgba(0,201,167,0.04)" : "transparent" }}
                            >
                                {aadharFile ? (
                                    <div>
                                        <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                                        <p style={{ fontSize: 12, color: "#00C9A7", fontWeight: 600 }}>{aadharFile.name}</p>
                                        <p style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{(aadharFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: 28, marginBottom: 6 }}>🪪</div>
                                        <p style={{ fontSize: 12, color: "#777" }}>Click to upload Aadhar card photo</p>
                                        <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>JPG, PNG or PDF accepted</p>
                                    </div>
                                )}
                                <input id="aadhar-input" type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={e => setAadharFile(e.target.files?.[0] || null)} />
                            </div>
                            {order.customerAadhar && (
                                <div style={{ marginTop: 8 }}>
                                    <p style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Previously uploaded:</p>
                                    <a href={order.customerAadhar} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: ACCENT2, textDecoration: "underline" }}>View Aadhar →</a>
                                </div>
                            )}
                        </div>

                        {/* 3 — Agreement */}
                        <div style={{ background: "#0F1017", borderRadius: 10, padding: 16, marginBottom: 14 }}>
                            <h4 style={{ fontSize: 12, fontWeight: 600, color: "#6C63FF", marginBottom: 12 }}>
                                📄 Signed Rental Agreement <span style={{ color: "#FF6B6B" }}>*</span>
                            </h4>
                            <div
                                onClick={() => document.getElementById("agreement-input")?.click()}
                                style={{ border: `2px dashed ${agreementFile ? "#00C9A7" : "#2A2B35"}`, borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer", background: agreementFile ? "rgba(0,201,167,0.04)" : "transparent" }}
                            >
                                {agreementFile ? (
                                    <div>
                                        <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                                        <p style={{ fontSize: 12, color: "#00C9A7", fontWeight: 600 }}>{agreementFile.name}</p>
                                        <p style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{(agreementFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
                                        <p style={{ fontSize: 12, color: "#777" }}>Click to upload signed agreement</p>
                                        <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>PDF, JPG or PNG accepted</p>
                                    </div>
                                )}
                                <input id="agreement-input" type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={e => setAgreementFile(e.target.files?.[0] || null)} />
                            </div>
                            {order.agreementDoc && (
                                <div style={{ marginTop: 8 }}>
                                    <p style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Previously uploaded:</p>
                                    <a href={order.agreementDoc} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: ACCENT2, textDecoration: "underline" }}>View Agreement →</a>
                                </div>
                            )}
                        </div>

                        {/* 4 — Other Docs */}
                        <div style={{ background: "#0F1017", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                            <h4 style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 12 }}>
                                📎 Other Documents <span style={{ fontSize: 10, fontWeight: 400, color: "#555" }}>(optional)</span>
                            </h4>
                            <div
                                onClick={() => document.getElementById("other-input")?.click()}
                                style={{ border: "2px dashed #2A2B35", borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer" }}
                            >
                                <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
                                <p style={{ fontSize: 12, color: "#777" }}>Additional receipts, ID proofs, etc.</p>
                                <input id="other-input" type="file" accept="image/*,application/pdf" multiple style={{ display: "none" }} onChange={e => setOtherFiles(prev => [...prev, ...Array.from(e.target.files || [])])} />
                            </div>
                            {otherFiles.length > 0 && (
                                <div style={{ marginTop: 10 }}>
                                    {otherFiles.map((f, i) => (
                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#1A1B24", borderRadius: 6, marginBottom: 4 }}>
                                            <span style={{ fontSize: 11, color: "#D0D0E8" }}>📄 {f.name}</span>
                                            <button onClick={() => setOtherFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#FF6B6B", cursor: "pointer", fontSize: 14 }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            style={{
                                width: "100%", padding: "14px", borderRadius: 10,
                                background: uploading ? "#1E1F2A" : `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                                border: "none", color: uploading ? "#555" : "#000",
                                fontSize: 13, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer",
                                fontFamily: "inherit", transition: "all 0.2s",
                            }}
                        >
                            {uploading ? `Uploading… ${progress}%` : `📤 Upload All Documents (${totalFiles} file${totalFiles !== 1 ? "s" : ""})`}
                        </button>

                        <p style={{ fontSize: 10, color: "#444", textAlign: "center", marginTop: 8 }}>
                            Files are securely stored and linked to this rental order
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── AVAILABILITY TAB ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function AvailabilityTab() {
    const { show, Toast } = useToast();

    // Local state: availability map  productId → { isAvailable, reason }
    const [availMap, setAvailMap] = useState<Record<number, { isAvailable: boolean; reason: string; updatedAt: string }>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("All");

    // Load from backend
    const loadAvailability = useCallback(async () => {
        setLoading(true);
        try {
            const data = await Api.get<any>("/api/product-availability");
            const arr: ProductAvailability[] = Array.isArray(data) ? data : (data?.data || []);
            const map: typeof availMap = {};
            arr.forEach(a => {
                map[a.productId] = {
                    isAvailable: a.isAvailable ?? true,
                    reason: a.unavailableReason || "",
                    updatedAt: a.updatedAt || "",
                };
            });

            const savedMap = readAvailabilityFromStorage();

            // Fill in defaults for any product not in DB
            ALL_ITEMS.forEach(item => {
                if (!map[item.id]) {
                    map[item.id] = savedMap[item.id] || { isAvailable: true, reason: "", updatedAt: "" };
                }
            });

            setAvailMap(map);
            saveAvailabilityToStorage(map);
        } catch {
            // If endpoint doesn't exist, keep sync using localStorage
            const savedMap = readAvailabilityFromStorage();
            const map: typeof availMap = {};
            ALL_ITEMS.forEach(item => {
                map[item.id] = savedMap[item.id] || { isAvailable: true, reason: "", updatedAt: "" };
            });
            setAvailMap(map);
            saveAvailabilityToStorage(map);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadAvailability(); }, [loadAvailability]);

    const toggleAvailability = async (productId: number, isAvailable: boolean) => {
        setSaving(productId);
        const currentReason = availMap[productId]?.reason || "";
        const updatedAt = new Date().toISOString();

        // Optimistic update + local sync for service page
        setAvailMap(prev => {
            const next = {
                ...prev,
                [productId]: {
                    ...prev[productId],
                    isAvailable,
                    reason: isAvailable ? "" : currentReason,
                    updatedAt,
                },
            };
            saveAvailabilityToStorage(next);
            return next;
        });

        try {
            saveAvailabilityToStorage(availMap);
            const endpoints = [
                `/api/product-availability/${productId}`,
                `/api/rental-availability/${productId}`,
            ];
            let success = false;
            for (const ep of endpoints) {
                try {
                    await Api.patch(ep, {
                        productId, isAvailable,
                        unavailableReason: isAvailable ? "" : currentReason,
                    });
                    success = true;
                    break;
                } catch { /* try next */ }
            }
            if (success) {
                show(`${ALL_ITEMS.find(i => i.id === productId)?.name} marked as ${isAvailable ? "Available" : "Unavailable"}`);
            } else {
                show("Saved locally (backend endpoint not set up yet)", "error");
            }
        } catch {
            show("Failed to save", "error");
        } finally {
            setSaving(null);
        }
    };

    const updateReason = (productId: number, reason: string) => {
        setAvailMap(prev => {
            const next = { ...prev, [productId]: { ...prev[productId], reason } };
            saveAvailabilityToStorage(next);
            return next;
        });
    };

    const saveReason = async (productId: number) => {
        setSaving(productId);
        const { isAvailable, reason } = availMap[productId] || {};
        try {
            saveAvailabilityToStorage(availMap);
            const endpoints = [
                `/api/product-availability/${productId}`,
                `/api/rental-availability/${productId}`,
            ];
            for (const ep of endpoints) {
                try {
                    await Api.patch(ep, { productId, isAvailable, unavailableReason: reason });
                    break;
                } catch { /* try next */ }
            }
            show("Reason saved");
        } catch { show("Failed to save reason", "error"); }
        finally { setSaving(null); }
    };

    const categories = ["All", ...RENTAL_CATALOG.map(c => c.category)];
    const filteredItems = ALL_ITEMS.filter(item => {
        const matchCat = filterCat === "All" || item.categoryName === filterCat;
        const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const availableCount = ALL_ITEMS.filter(i => availMap[i.id]?.isAvailable !== false).length;
    const unavailableCount = ALL_ITEMS.length - availableCount;

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <Toast />

            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
                {[
                    { label: "Total Equipment", value: ALL_ITEMS.length, color: ACCENT, icon: "📷" },
                    { label: "Available", value: availableCount, color: "#00C9A7", icon: "✅" },
                    { label: "Unavailable", value: unavailableCount, color: "#FF6B6B", icon: "❌" },
                ].map(m => (
                    <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{m.icon}</span>
                        <div>
                            <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
                            <p style={{ fontSize: 10, color: "#555577" }}>{m.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <input
                    type="text" placeholder="Search equipment…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, minWidth: 180, padding: "7px 12px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 7, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilterCat(cat)}
                            style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: filterCat === cat ? 600 : 400, background: filterCat === cat ? ACCENT : "transparent", color: filterCat === cat ? "#000" : "#777", borderColor: filterCat === cat ? ACCENT : "#2A2B35" }}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Equipment List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {RENTAL_CATALOG.map(cat => {
                    const catItems = filteredItems.filter(i => i.categoryName === cat.category);
                    if (catItems.length === 0) return null;
                    return (
                        <div key={cat.category}>
                            <h3 style={{ fontSize: 12, fontWeight: 600, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, marginTop: 4 }}>
                                {cat.category}
                            </h3>
                            {catItems.map(item => {
                                const avail = availMap[item.id] || { isAvailable: true, reason: "", updatedAt: "" };
                                const isSaving = saving === item.id;
                                return (
                                    <div key={item.id} style={{ background: "#13141C", border: `1px solid ${avail.isAvailable ? "#1E1F2A" : "rgba(255,107,107,0.3)"}`, borderRadius: 10, padding: "14px 18px", marginBottom: 8, transition: "all 0.2s" }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                                            {/* Left */}
                                            <div style={{ flex: 1, minWidth: 180 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                                    <span style={{ fontSize: 10, color: ACCENT, fontFamily: "monospace" }}>#{item.id}</span>
                                                    <p style={{ fontSize: 13, fontWeight: 600, color: "#E8E8EF" }}>{item.name}</p>
                                                    <span style={{
                                                        fontSize: 9, padding: "2px 8px", borderRadius: 10, fontWeight: 700,
                                                        background: avail.isAvailable ? "rgba(0,201,167,0.12)" : "rgba(255,107,107,0.12)",
                                                        color: avail.isAvailable ? "#00C9A7" : "#FF6B6B",
                                                    }}>
                                                        {avail.isAvailable ? "● Available" : "● Unavailable"}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: 10, color: "#8888AA" }}>{item.specs} • {formatINR(item.price)}/day</p>
                                                {avail.updatedAt && (
                                                    <p style={{ fontSize: 9, color: "#444", marginTop: 4 }}>Last updated: {formatDateTime(avail.updatedAt)}</p>
                                                )}
                                            </div>

                                            {/* Toggle */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <span style={{ fontSize: 11, color: "#666" }}>
                                                    {avail.isAvailable ? "Available" : "Unavailable"}
                                                </span>
                                                <div
                                                    onClick={() => !isSaving && toggleAvailability(item.id, !avail.isAvailable)}
                                                    style={{
                                                        width: 44, height: 24, borderRadius: 12,
                                                        background: avail.isAvailable ? "#00C9A7" : "#3A3B45",
                                                        position: "relative", cursor: isSaving ? "wait" : "pointer",
                                                        transition: "background 0.3s",
                                                        opacity: isSaving ? 0.6 : 1,
                                                    }}
                                                >
                                                    <div style={{
                                                        position: "absolute", top: 3,
                                                        left: avail.isAvailable ? 23 : 3,
                                                        width: 18, height: 18, borderRadius: "50%",
                                                        background: "#fff", transition: "left 0.3s",
                                                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reason (only when unavailable) */}
                                        {!avail.isAvailable && (
                                            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                                                <input
                                                    type="text"
                                                    value={avail.reason}
                                                    onChange={e => updateReason(item.id, e.target.value)}
                                                    placeholder="Reason for unavailability (e.g., Under repair, Already rented…)"
                                                    style={{ flex: 1, padding: "7px 12px", background: "#0F1017", border: "1px solid #FF6B6B44", borderRadius: 7, color: "#E8E8EF", fontSize: 11, outline: "none", fontFamily: "inherit" }}
                                                />
                                                <button
                                                    onClick={() => saveReason(item.id)}
                                                    disabled={isSaving}
                                                    style={{ padding: "7px 14px", background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 7, color: "#FF6B6B", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function DashboardTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const ordersQ = useApi(() => Api.tryGetList<RentalOrder>(["/api/rental-inquiry", "/api/rental-inquiries", "/api/rentals", "/api/rental-orders"]));
    const inquiriesQ = useApi(() => Api.tryGetList<ServiceInquiry>(["/api/service-inquiry", "/api/service-inquiries", "/api/inquiries"]));

    if (ordersQ.loading || inquiriesQ.loading) return <LoadingSpinner />;
    if (ordersQ.error) return <ErrorBox message={ordersQ.error} onRetry={ordersQ.refetch} />;

    const orders = ordersQ.data || [];
    const inquiries = inquiriesQ.data || [];

    const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const pendingOrders = orders.filter(o => normalizeStatus(o.status) === "Pending").length;
    const activeOrders = orders.filter(o => { const ns = normalizeStatus(o.status); return ns === "Active" || ns === "Confirmed"; }).length;
    const uniqueCustomers = new Set(orders.map(o => o.email)).size;

    // Orders missing documents
    const missingDocs = orders.filter(o =>
        !o.productImages?.length || !o.customerAadhar || !o.agreementDoc
    ).length;

    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5);

    return (
        <div>
            {/* Alert if pending docs */}
            {missingDocs > 0 && (
                <div style={{ background: "rgba(255,165,61,0.1)", border: "1px solid rgba(255,165,61,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>⚠️</span>
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#FFA94D" }}>{missingDocs} order(s) missing documents</p>
                            <p style={{ fontSize: 10, color: "#888" }}>Upload product images, Aadhar & agreement for complete records</p>
                        </div>
                    </div>
                    <button onClick={() => onNavigate("orders")} style={{ fontSize: 11, padding: "6px 14px", background: "rgba(255,165,61,0.15)", border: "1px solid rgba(255,165,61,0.3)", borderRadius: 6, color: "#FFA94D", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                        View Orders →
                    </button>
                </div>
            )}

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
                {[
                    { label: "Total Orders", value: orders.length.toString(), color: ACCENT, sub: "all-time", icon: "📋" },
                    { label: "Total Revenue", value: formatINRShort(totalRevenue), color: "#00C9A7", sub: "from rentals", icon: "💰" },
                    { label: "Pending Orders", value: pendingOrders.toString(), color: "#FFA94D", sub: "awaiting action", icon: "⏳" },
                    { label: "Active Rentals", value: activeOrders.toString(), color: ACCENT2, sub: "in progress", icon: "🎬" },
                    { label: "Unique Customers", value: uniqueCustomers.toString(), color: "#FFD93D", sub: "registered", icon: "👥" },
                    { label: "Service Inquiries", value: inquiries.length.toString(), color: "#6C63FF", sub: "from website", icon: "📩" },
                ].map(m => (
                    <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "16px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</p>
                            <span style={{ fontSize: 16 }}>{m.icon}</span>
                        </div>
                        <p style={{ fontSize: 26, fontWeight: 700, color: m.color, marginBottom: 4 }}>{m.value}</p>
                        <p style={{ fontSize: 10, color: "#555577" }}>{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", margin: 0 }}>Recent Rental Orders</h4>
                    <button onClick={() => onNavigate("orders")} style={{ fontSize: 11, color: ACCENT, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View All →</button>
                </div>
                {recentOrders.length === 0 ? (
                    <EmptyState message="No orders yet" hint="Orders submitted from your website will appear here" />
                ) : (
                    recentOrders.map((o, i) => (
                        <div key={o._id || o.id || i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1A1B24", gap: 12, flexWrap: "wrap" }}>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                    <p style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{o.name}</p>
                                    {(!o.productImages?.length || !o.customerAadhar || !o.agreementDoc) && (
                                        <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(255,165,61,0.12)", color: "#FFA94D" }}>Docs pending</span>
                                    )}
                                </div>
                                <p style={{ fontSize: 10, color: "#555577" }}>{o.productName} • {o.rentalDays} day(s) • {o.categoryName}</p>
                                <p style={{ fontSize: 10, color: "#444466" }}>{formatDateTime(o.createdAt)}</p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 4 }}>{formatINR(o.totalPrice)}</p>
                                <Badge s={o.status || "Pending"} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── ORDERS TAB ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function OrdersTab() {
    const { data, loading, error, refetch } = useApi(() =>
        Api.tryGetList<RentalOrder>(["/api/rental-inquiry", "/api/rental-inquiries", "/api/rentals", "/api/rental-orders"])
    );
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<RentalOrder | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [uploadOrder, setUploadOrder] = useState<RentalOrder | null>(null);
    const { show, Toast } = useToast();

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        const paths = [`/api/rental-inquiry/${id}/status`, `/api/rental-inquiries/${id}/status`, `/api/rental-inquiry/${id}`, `/api/rentals/${id}`];
        let success = false;
        for (const p of paths) {
            try { await Api.patch(p, { status }); success = true; break; } catch { /* next */ }
        }
        setUpdatingId(null);
        if (success) {
            show(`Status updated to ${normalizeStatus(status)}`);
            await refetch();
            setSelected(prev => prev && (prev._id === id || prev.id === id) ? { ...prev, status: status as any } : prev);
        } else {
            show("Failed to update status", "error");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete) return;
        const id = confirmDelete;
        setConfirmDelete(null);
        setDeletingId(id);
        const paths = [`/api/rental-inquiry/${id}`, `/api/rental-inquiries/${id}`, `/api/rentals/${id}`];
        let success = false;
        for (const p of paths) {
            try { await Api.delete(p); success = true; break; } catch { /* next */ }
        }
        setDeletingId(null);
        if (success) { show("Order deleted"); await refetch(); setSelected(null); }
        else { show("Failed to delete", "error"); }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorBox message={error} onRetry={refetch} />;

    const orders = data || [];
    const filtered = orders
        .filter(o => filter === "All" || normalizeStatus(o.status) === filter)
        .filter(o => !search ||
            o.name?.toLowerCase().includes(search.toLowerCase()) ||
            o.email?.toLowerCase().includes(search.toLowerCase()) ||
            o.productName?.toLowerCase().includes(search.toLowerCase()) ||
            o.mobile?.includes(search)
        );

    // Doc completeness helper
    const docStatus = (o: RentalOrder) => {
        const imgs = (o.productImages?.length || 0) >= 5;
        const aadhar = !!o.customerAadhar;
        const agreement = !!o.agreementDoc;
        if (imgs && aadhar && agreement) return { label: "Complete", color: "#00C9A7", icon: "✅" };
        if (!imgs && !aadhar && !agreement) return { label: "None", color: "#FF6B6B", icon: "❌" };
        return { label: "Partial", color: "#FFA94D", icon: "⚠️" };
    };

    return (
        <div>
            <Toast />
            <ConfirmModal isOpen={!!confirmDelete} message="Delete this rental order? This cannot be undone." onConfirm={handleDeleteConfirm} onCancel={() => setConfirmDelete(null)} />

            {/* Document Upload Modal */}
            <DocumentUploadModal
                order={uploadOrder}
                isOpen={!!uploadOrder}
                onClose={() => setUploadOrder(null)}
                onSuccess={refetch}
            />

            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Rental Orders ({filtered.length}/{orders.length})</span>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: 200, padding: "6px 10px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                        <select value={filter} onChange={e => setFilter(e.target.value)}
                            style={{ padding: "6px 10px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit", width: 130 }}>
                            {["All", "Pending", "Confirmed", "Active", "Completed", "Cancelled"].map(s => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
                        </select>
                        <button onClick={refetch} style={{ fontSize: 11, color: ACCENT, background: "rgba(78,205,196,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>↻ Refresh</button>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
                        <thead>
                            <tr style={{ background: "#0F1017" }}>
                                {["Date", "Customer", "Contact", "Product", "Days", "Total", "Docs", "Status", "Actions"].map(h => (
                                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={9}><EmptyState message="No orders match" hint="Orders from your service page will appear here" /></td></tr>
                            ) : filtered.map((o, i) => {
                                const id = o._id || o.id || String(i);
                                const isUpdating = updatingId === id;
                                const isDeleting = deletingId === id;
                                const ds = docStatus(o);
                                return (
                                    <tr key={id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14", cursor: "pointer", opacity: isDeleting ? 0.4 : 1, transition: "opacity 0.2s" }} onClick={() => setSelected(o)}>
                                        <td style={{ padding: "12px 14px", fontSize: 10, color: "#555577" }}>{formatDateTime(o.createdAt)}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <div style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{o.name}</div>
                                            <div style={{ fontSize: 10, color: "#555577" }}>{o.categoryName}</div>
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 11 }}>
                                            <div style={{ color: ACCENT2 }}>{o.email}</div>
                                            <div style={{ color: "#8888AA" }}>{o.mobile}</div>
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#D0D0E8" }}>
                                            {o.productName}
                                            <div style={{ fontSize: 10, color: "#555577" }}>{formatINR(o.pricePerDay)}/day</div>
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#EEEEF5", textAlign: "center" }}>{o.rentalDays}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: ACCENT }}>{formatINR(o.totalPrice)}</td>

                                        {/* Docs status */}
                                        <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                                                <span style={{ fontSize: 9, color: ds.color, fontWeight: 600 }}>{ds.icon} {ds.label}</span>
                                                <button
                                                    onClick={() => setUploadOrder(o)}
                                                    style={{ fontSize: 10, color: "#6C63FF", background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
                                                >
                                                    📎 Upload
                                                </button>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                                            <select value={normalizeStatus(o.status)} disabled={isUpdating} onChange={e => updateStatus(id, e.target.value)}
                                                style={{ background: "transparent", border: "none", color: statusColor[o.status || "pending"]?.text || statusColor["Pending"].text, fontSize: 11, fontWeight: 600, cursor: isUpdating ? "wait" : "pointer", fontFamily: "inherit", opacity: isUpdating ? 0.5 : 1 }}>
                                                {["Pending", "Confirmed", "Active", "Completed", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                                            <div style={{ display: "flex", gap: 5 }}>
                                                <button onClick={() => setSelected(o)} style={{ fontSize: 10, color: ACCENT, background: "rgba(78,205,196,0.1)", border: `1px solid ${ACCENT}30`, borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }}>View</button>
                                                <button onClick={() => setConfirmDelete(id)} disabled={isDeleting} style={{ fontSize: 10, color: "#FF6B6B", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }}>Del</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selected && (
                <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 14, width: "100%", maxWidth: 680, maxHeight: "92vh", overflow: "auto" }}>
                        {/* Modal Header */}
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#13141C", zIndex: 10 }}>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>Order Details</h3>
                                <p style={{ fontSize: 10, color: "#555577", marginTop: 2 }}>ID: {(selected._id || selected.id || "").slice(-8).toUpperCase()}</p>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => { setUploadOrder(selected); setSelected(null); }}
                                    style={{ fontSize: 11, padding: "6px 12px", background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 6, color: "#6C63FF", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                                    📎 Upload Docs
                                </button>
                                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#777", fontSize: 22, cursor: "pointer" }}>×</button>
                            </div>
                        </div>

                        <div style={{ padding: 20 }}>
                            {/* Status Row */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#0F1017", borderRadius: 8, marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                                <div>
                                    <p style={{ fontSize: 10, color: "#555577", marginBottom: 4 }}>Current Status</p>
                                    <Badge s={selected.status || "pending"} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, color: "#555577", marginBottom: 4 }}>Update Status</p>
                                    <select value={normalizeStatus(selected.status)} onChange={e => { const id = selected._id || selected.id || ""; updateStatus(id, e.target.value); }}
                                        style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                                        {["Pending", "Confirmed", "Active", "Completed", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Document Status */}
                            <div style={{ background: "#0F1017", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                                <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", marginBottom: 10, letterSpacing: "0.06em" }}>Document Status</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                                    {[
                                        { label: "Product Images", count: selected.productImages?.length || 0, required: 5, icon: "🖼️" },
                                        { label: "Aadhar Card", count: selected.customerAadhar ? 1 : 0, required: 1, icon: "🪪" },
                                        { label: "Agreement", count: selected.agreementDoc ? 1 : 0, required: 1, icon: "📄" },
                                    ].map(d => (
                                        <div key={d.label} style={{ textAlign: "center", padding: "8px", background: "#13141C", borderRadius: 8 }}>
                                            <div style={{ fontSize: 20, marginBottom: 4 }}>{d.icon}</div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: d.count >= d.required ? "#00C9A7" : "#FF6B6B" }}>
                                                {d.count}/{d.required}
                                            </div>
                                            <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{d.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Uploaded images preview */}
                                {selected.productImages && selected.productImages.length > 0 && (
                                    <div style={{ marginTop: 12 }}>
                                        <p style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>Product Images:</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                            {selected.productImages.map((url, i) => (
                                                <a key={i} href={url} target="_blank" rel="noreferrer">
                                                    <img src={url} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: `1px solid ${ACCENT}44` }} />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Document links */}
                                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                                    {selected.customerAadhar && (
                                        <a href={selected.customerAadhar} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#FFD93D", textDecoration: "underline" }}>🪪 View Aadhar</a>
                                    )}
                                    {selected.agreementDoc && (
                                        <a href={selected.agreementDoc} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#6C63FF", textDecoration: "underline" }}>📄 View Agreement</a>
                                    )}
                                </div>
                            </div>

                            {/* Order Fields */}
                            {[
                                ["Customer Name", selected.name],
                                ["Email", selected.email],
                                ["Mobile", selected.mobile],
                                ["Category", selected.categoryName],
                                ["Product", selected.productName],
                                ["Product ID", `#${selected.productId}`],
                                ["Daily Rate", formatINR(selected.pricePerDay)],
                                ["Rental Days", `${selected.rentalDays} day(s)`],
                                ["Total Amount", formatINR(selected.totalPrice)],
                                ["Submitted", formatDateTime(selected.createdAt)],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1A1B24" }}>
                                    <span style={{ fontSize: 11, color: "#666688", textTransform: "uppercase" }}>{label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "#D0D0E8", textAlign: "right" }}>{value}</span>
                                </div>
                            ))}

                            {selected.requirements && (
                                <div style={{ marginTop: 12, padding: "12px 14px", background: "#0F1017", borderRadius: 8 }}>
                                    <p style={{ fontSize: 11, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>Special Requests</p>
                                    <p style={{ fontSize: 12, color: "#D0D0E8", lineHeight: 1.6 }}>{selected.requirements}</p>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                                <a href={`tel:${selected.mobile}`} style={{ flex: 1, minWidth: 100, padding: "10px", background: "rgba(78,205,196,0.1)", border: `1px solid ${ACCENT}30`, borderRadius: 8, color: ACCENT, fontSize: 12, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>📞 Call</a>
                                <a href={`mailto:${selected.email}`} style={{ flex: 1, minWidth: 100, padding: "10px", background: "rgba(0,151,255,0.1)", border: `1px solid ${ACCENT2}30`, borderRadius: 8, color: ACCENT2, fontSize: 12, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>✉️ Email</a>
                                <button onClick={() => { setUploadOrder(selected); setSelected(null); }} style={{ flex: 1, minWidth: 100, padding: "10px", background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 8, color: "#6C63FF", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>📎 Upload Docs</button>
                                <button onClick={() => { const id = selected._id || selected.id || ""; setSelected(null); setConfirmDelete(id); }} style={{ flex: 1, minWidth: 100, padding: "10px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, color: "#FF6B6B", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🗑️ Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── CATALOG TAB ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function CatalogTab() {
    const ordersQ = useApi(() => Api.tryGetList<RentalOrder>(["/api/rental-inquiry", "/api/rental-inquiries", "/api/rentals", "/api/rental-orders"]));
    const orders = ordersQ.data || [];
    const rentCount = orders.reduce((acc, o) => { acc[o.productId] = (acc[o.productId] || 0) + 1; return acc; }, {} as Record<number, number>);
    const revenueMap = orders.reduce((acc, o) => { acc[o.productId] = (acc[o.productId] || 0) + (o.totalPrice || 0); return acc; }, {} as Record<number, number>);

    return (
        <div>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "12px 18px", marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#888" }}>📋 Catalog from <code style={{ color: ACCENT }}>/service</code> page. Rental counts & revenue from real orders.</p>
            </div>
            {RENTAL_CATALOG.map(cat => (
                <div key={cat.category} style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#CCCCE0", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                        {cat.category} <span style={{ fontSize: 11, color: "#555", fontWeight: 400 }}>({cat.items.length} items)</span>
                    </h3>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#0F1017" }}>
                                    {["ID", "Product", "Specs", "Daily Rate", "Original", "Rentals", "Revenue"].map(h => (
                                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cat.items.map((item, i) => {
                                    const count = rentCount[item.id] || 0;
                                    const revenue = revenueMap[item.id] || 0;
                                    return (
                                        <tr key={item.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                                            <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT }}>#{item.id}</td>
                                            <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{item.name}</td>
                                            <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{item.specs}</td>
                                            <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: ACCENT }}>{formatINR(item.price)}</td>
                                            <td style={{ padding: "12px 14px", fontSize: 11, color: "#555577", textDecoration: "line-through" }}>{formatINR(item.originalPrice)}</td>
                                            <td style={{ padding: "12px 14px" }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: count > 0 ? "rgba(0,201,167,0.12)" : "#1E1F2A", color: count > 0 ? "#00C9A7" : "#555" }}>
                                                    {count} {count === 1 ? "rental" : "rentals"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#FFA94D" }}>{revenue > 0 ? formatINR(revenue) : "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── CUSTOMERS TAB ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function CustomersTab() {
    const { data, loading, error, refetch } = useApi(() => Api.tryGetList<RentalOrder>(["/api/rental-inquiry", "/api/rental-inquiries", "/api/rentals", "/api/rental-orders"]));
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<any>(null);
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorBox message={error} onRetry={refetch} />;

    const customerMap = (data || []).reduce((acc, o) => {
        if (!o.email) return acc;
        if (!acc[o.email]) acc[o.email] = { name: o.name, email: o.email, mobile: o.mobile, orderCount: 0, totalSpent: 0, lastOrder: o.createdAt, orders: [] };
        acc[o.email].orderCount++;
        acc[o.email].totalSpent += o.totalPrice || 0;
        acc[o.email].orders.push(o);
        if (new Date(o.createdAt || 0) > new Date(acc[o.email].lastOrder || 0)) acc[o.email].lastOrder = o.createdAt;
        return acc;
    }, {} as Record<string, any>);

    const customers = Object.values(customerMap).sort((a: any, b: any) => b.totalSpent - a.totalSpent).filter((c: any) => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.mobile?.includes(search));

    return (
        <div>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Customers ({customers.length})</span>
                    <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: 200, padding: "6px 10px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                        <thead>
                            <tr style={{ background: "#0F1017" }}>
                                {["Customer", "Email", "Mobile", "Orders", "Total Spent", "Last Order", ""].map(h => (
                                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? <tr><td colSpan={7}><EmptyState message="No customers yet" hint="Customers appear when orders are placed" /></td></tr> :
                                customers.map((c: any, i: number) => (
                                    <tr key={c.email} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                                        <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{c.name}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT2 }}>{c.email}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{c.mobile}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#EEEEF5", textAlign: "center" }}>{c.orderCount}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: ACCENT }}>{formatINR(c.totalSpent)}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#555577" }}>{formatDate(c.lastOrder)}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <button onClick={() => setSelected(c)} style={{ fontSize: 11, color: ACCENT, background: "rgba(78,205,196,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>View Orders</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && (
                <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 12, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto" }}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#13141C", zIndex: 10 }}>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>{selected.name}</h3>
                                <p style={{ fontSize: 10, color: "#555577", marginTop: 2 }}>{selected.email} • {selected.mobile}</p>
                            </div>
                            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#777", fontSize: 22, cursor: "pointer" }}>×</button>
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                                {[{ label: "Total Orders", value: selected.orderCount, color: ACCENT }, { label: "Total Spent", value: formatINR(selected.totalSpent), color: "#00C9A7" }].map(s => (
                                    <div key={s.label} style={{ background: "#0F1017", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                                        <p style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</p>
                                        <p style={{ fontSize: 10, color: "#555577", marginTop: 4 }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <h4 style={{ fontSize: 12, color: "#666688", marginBottom: 10, textTransform: "uppercase" }}>Order History</h4>
                            {selected.orders.map((o: RentalOrder, i: number) => (
                                <div key={o._id || o.id || i} style={{ padding: "10px 12px", background: "#0F1017", borderRadius: 8, marginBottom: 8, border: "1px solid #1A1B24" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{o.productName}</span>
                                        <Badge s={o.status || "pending"} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 10, color: "#555577" }}>{o.categoryName} • {o.rentalDays} day(s)</span>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>{formatINR(o.totalPrice)}</span>
                                    </div>
                                    <p style={{ fontSize: 10, color: "#444466", marginTop: 4 }}>{formatDateTime(o.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── INQUIRIES TAB ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function InquiriesTab() {
    const { data, loading, error, refetch } = useApi(() => Api.tryGetList<ServiceInquiry>(["/api/service-inquiry", "/api/service-inquiries", "/api/inquiries"]));
    const [selected, setSelected] = useState<ServiceInquiry | null>(null);
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorBox message={error} onRetry={refetch} />;
    const inquiries = data || [];

    return (
        <div>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Service Inquiries ({inquiries.length})</span>
                    <button onClick={refetch} style={{ fontSize: 11, color: ACCENT, background: "rgba(78,205,196,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>↻ Refresh</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                        <thead>
                            <tr style={{ background: "#0F1017" }}>
                                {["Date", "Name", "Contact", "Service", "Timeline", "Requirements", ""].map(h => (
                                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length === 0 ? <tr><td colSpan={7}><EmptyState message="No inquiries yet" hint="Service inquiries appear here" /></td></tr> :
                                inquiries.map((q, i) => (
                                    <tr key={q._id || q.id || i} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14", cursor: "pointer" }} onClick={() => setSelected(q)}>
                                        <td style={{ padding: "12px 14px", fontSize: 10, color: "#555577" }}>{formatDateTime(q.createdAt)}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{q.name}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 11 }}><div style={{ color: ACCENT2 }}>{q.email}</div><div style={{ color: "#8888AA" }}>{q.mobile}</div></td>
                                        <td style={{ padding: "12px 14px", fontSize: 12, color: ACCENT, fontWeight: 500 }}>{q.service}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{q.timeline}</td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688", maxWidth: 200 }}>
                                            <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>{q.requirements || "—"}</span>
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <button onClick={e => { e.stopPropagation(); setSelected(q); }} style={{ fontSize: 11, color: ACCENT, background: "rgba(78,205,196,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>View</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && (
                <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 12, width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto" }}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#13141C", zIndex: 10 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>Inquiry Details</h3>
                            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#777", fontSize: 22, cursor: "pointer" }}>×</button>
                        </div>
                        <div style={{ padding: 20 }}>
                            {[["Name", selected.name], ["Email", selected.email], ["Mobile", selected.mobile], ["Service", selected.service], ["Timeline", selected.timeline], ["Submitted", formatDateTime(selected.createdAt)]].map(([label, value]) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1A1B24" }}>
                                    <span style={{ fontSize: 11, color: "#666688", textTransform: "uppercase" }}>{label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "#D0D0E8", textAlign: "right" }}>{value}</span>
                                </div>
                            ))}
                            {selected.requirements && (
                                <div style={{ marginTop: 12, padding: "12px 14px", background: "#0F1017", borderRadius: 8 }}>
                                    <p style={{ fontSize: 11, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>Requirements</p>
                                    <p style={{ fontSize: 12, color: "#D0D0E8", lineHeight: 1.6 }}>{selected.requirements}</p>
                                </div>
                            )}
                            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                                <a href={`tel:${selected.mobile}`} style={{ flex: 1, padding: "10px", background: "rgba(78,205,196,0.1)", border: `1px solid ${ACCENT}30`, borderRadius: 8, color: ACCENT, fontSize: 12, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>📞 Call</a>
                                <a href={`mailto:${selected.email}`} style={{ flex: 1, padding: "10px", background: "rgba(0,151,255,0.1)", border: `1px solid ${ACCENT2}30`, borderRadius: 8, color: ACCENT2, fontSize: 12, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>✉️ Email</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── REPORTS TAB ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function ReportsTab() {
    const { data, loading, error, refetch } = useApi(() => Api.tryGetList<RentalOrder>(["/api/rental-inquiry", "/api/rental-inquiries", "/api/rentals", "/api/rental-orders"]));
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorBox message={error} onRetry={refetch} />;

    const orders = data || [];
    const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    const byCategory = orders.reduce((acc, o) => { if (o.categoryName) acc[o.categoryName] = (acc[o.categoryName] || 0) + (o.totalPrice || 0); return acc; }, {} as Record<string, number>);
    const productCounts = orders.reduce((acc, o) => { if (o.productName) acc[o.productName] = (acc[o.productName] || 0) + 1; return acc; }, {} as Record<string, number>);
    const topProducts = Object.entries(productCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
    const byStatus = orders.reduce((acc, o) => { const s = normalizeStatus(o.status); acc[s] = (acc[s] || 0) + 1; return acc; }, {} as Record<string, number>);

    const exportCSV = () => {
        const headers = ["Name", "Email", "Mobile", "Product", "Category", "Days", "Total", "Status", "Date"];
        const rows = orders.map(o => [o.name, o.email, o.mobile, o.productName, o.categoryName, o.rentalDays, o.totalPrice, normalizeStatus(o.status), formatDate(o.createdAt)]);
        const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `rental-report-${new Date().toISOString().split("T")[0]}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {
        const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), summary: { totalOrders: orders.length, totalRevenue, avgOrder }, orders, byCategory, topProducts, byStatus }, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `rental-report-${new Date().toISOString().split("T")[0]}.json`; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, color: "#CCCCE0", fontWeight: 600 }}>Business Reports</h3>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={exportCSV} style={{ fontSize: 11, color: ACCENT, background: "rgba(78,205,196,0.1)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>📥 CSV</button>
                    <button onClick={exportJSON} style={{ fontSize: 11, color: ACCENT2, background: "rgba(0,151,255,0.1)", border: `1px solid ${ACCENT2}30`, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>📥 JSON</button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
                {[
                    { label: "Total Orders", value: orders.length.toString(), color: ACCENT },
                    { label: "Total Revenue", value: formatINR(totalRevenue), color: "#00C9A7" },
                    { label: "Avg Order Value", value: formatINR(avgOrder), color: ACCENT2 },
                    { label: "Unique Products", value: Object.keys(productCounts).length.toString(), color: "#FFA94D" },
                ].map(m => (
                    <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <p style={{ fontSize: 11, color: "#555577", textTransform: "uppercase", marginBottom: 8 }}>{m.label}</p>
                        <p style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {/* Revenue by Category */}
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 16 }}>Revenue by Category</h4>
                    {Object.entries(byCategory).length === 0 ? <p style={{ fontSize: 12, color: "#555" }}>No data yet</p> :
                        Object.entries(byCategory).sort(([, a], [, b]) => b - a).map(([cat, rev]) => {
                            const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
                            return (
                                <div key={cat} style={{ marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, color: "#888" }}>{cat}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>{formatINR(rev)}</span>
                                    </div>
                                    <div style={{ height: 6, background: "#1E1F2A", borderRadius: 3 }}>
                                        <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 3, transition: "width 0.5s" }} />
                                    </div>
                                    <p style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{pct.toFixed(1)}% of total</p>
                                </div>
                            );
                        })}
                </div>

                {/* Top Products */}
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 16 }}>Top Rented Products</h4>
                    {topProducts.length === 0 ? <p style={{ fontSize: 12, color: "#555" }}>No data yet</p> :
                        topProducts.map(([name, count], i) => (
                            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1A1B24" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ width: 22, height: 22, borderRadius: 4, background: i === 0 ? "rgba(255,215,0,0.15)" : "#1E1F2A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: i === 0 ? "#FFD700" : "#555", flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{name}</p>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#FFA94D" }}>{count}×</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Status */}
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 16 }}>Orders by Status</h4>
                {Object.keys(byStatus).length === 0 ? <p style={{ fontSize: 12, color: "#555" }}>No data yet</p> :
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                        {Object.entries(byStatus).map(([status, count]) => (
                            <div key={status} style={{ padding: 14, background: "#0F1017", borderRadius: 8, textAlign: "center", border: `1px solid ${statusColor[status]?.text || "#555"}22` }}>
                                <p style={{ fontSize: 28, fontWeight: 700, color: statusColor[status]?.text || "#888" }}>{count}</p>
                                <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{status}</p>
                            </div>
                        ))}
                    </div>}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MAIN PANEL ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function RentalPanel() {
    const [active, setActive] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [adminUser, setAdminUser] = useState<{ name: string; email: string; role?: string } | null>(null);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
        const onResize = () => setIsMobile(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);
        try { const raw = localStorage.getItem("user"); if (raw) setAdminUser(JSON.parse(raw)); } catch { /* ignore */ }
        const onClick = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest("[data-profile-menu]")) setProfileOpen(false); };
        document.addEventListener("click", onClick);
        return () => { window.removeEventListener("resize", onResize); document.removeEventListener("click", onClick); };
    }, []);

    const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; };
    const getInitial = () => adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A";

    const renderContent = () => {
        switch (active) {
            case "dashboard": return <DashboardTab onNavigate={setActive} />;
            case "orders": return <OrdersTab />;
            case "availability": return <AvailabilityTab />;
            case "catalog": return <CatalogTab />;
            case "customers": return <CustomersTab />;
            case "inquiries": return <InquiriesTab />;
            case "reports": return <ReportsTab />;
            default: return null;
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF" }}>
            {isMobile && <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: "fixed", top: 12, left: 12, zIndex: 100, background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 6, padding: "8px 12px", color: "#E8E8EF", cursor: "pointer", fontSize: 16 }}>☰</button>}

            {/* Sidebar */}
            <aside style={{ width: 220, background: "#0F1117", borderRight: "1px solid #1E1F2A", flexShrink: 0, display: "flex", flexDirection: "column", position: isMobile ? "fixed" : "relative", left: isMobile && !sidebarOpen ? -220 : 0, top: 0, bottom: 0, zIndex: 50, transition: "left 0.3s" }}>
                <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #1E1F2A", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◧</div>
                    <div><p style={{ fontSize: 13, fontWeight: 700, color: "#E8E8EF" }}>Crewholic</p><p style={{ fontSize: 10, color: "#555577" }}>Rental Admin</p></div>
                </div>
                <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                    {SIDEBAR_ITEMS.map(item => (
                        <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: active === item.id ? "rgba(78,205,196,0.12)" : "transparent", border: "none", cursor: "pointer", color: active === item.id ? ACCENT : "#777799", fontSize: 12, fontWeight: active === item.id ? 600 : 400, borderLeft: `2px solid ${active === item.id ? ACCENT : "transparent"}`, transition: "all 0.15s", textAlign: "left", fontFamily: "inherit" }}>
                            <span style={{ fontSize: 13 }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div style={{ padding: "10px 16px", borderTop: "1px solid #1E1F2A" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00C9A7" }} />
                        <span style={{ fontSize: 10, color: "#555577" }}>Connected</span>
                    </div>
                    <p style={{ fontSize: 9, color: "#333344", marginTop: 4, fontFamily: "monospace", wordBreak: "break-all" }}>{API_BASE}</p>
                </div>
            </aside>

            {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}

            {/* Main */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <header style={{ background: "#0F1117", borderBottom: "1px solid #1E1F2A", padding: "0 16px 0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 12 }}>
                    <h1 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0, paddingLeft: isMobile ? 40 : 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {SIDEBAR_ITEMS.find(s => s.id === active)?.label}
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={() => window.location.href = "/"} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "rgba(78,205,196,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, color: ACCENT, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                            <span>⌂</span>{!isMobile && <span>Main Site</span>}
                        </button>
                        <div data-profile-menu style={{ position: "relative" }}>
                            <button onClick={e => { e.stopPropagation(); setProfileOpen(!profileOpen); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 5px", background: profileOpen ? "rgba(255,255,255,0.05)" : "transparent", border: "1px solid", borderColor: profileOpen ? "#1E1F2A" : "transparent", borderRadius: 20, cursor: "pointer", fontFamily: "inherit" }}>
                                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000", flexShrink: 0 }}>{getInitial()}</div>
                                {!isMobile && <><div style={{ textAlign: "left", lineHeight: 1.2 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#E8E8EF" }}>{adminUser?.name || "Admin"}</div><div style={{ fontSize: 9, color: "#666688" }}>{adminUser?.role || "Administrator"}</div></div><span style={{ fontSize: 9, color: "#555", display: "inline-block", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span></>}
                            </button>
                            {profileOpen && (
                                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 240, background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.4)", zIndex: 100, overflow: "hidden" }}>
                                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1E1F2A", background: "linear-gradient(135deg, rgba(78,205,196,0.05), rgba(0,151,255,0.05))" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#000", flexShrink: 0 }}>{getInitial()}</div>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: "#E8E8EF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminUser?.name || "Admin User"}</p>
                                                <p style={{ fontSize: 10, color: "#666688", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminUser?.email || "admin@crewholic.com"}</p>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", background: "rgba(0,201,167,0.12)", borderRadius: 4 }}>
                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C9A7" }} />
                                            <span style={{ fontSize: 10, color: "#00C9A7", fontWeight: 600 }}>{adminUser?.role || "Administrator"}</span>
                                        </div>
                                    </div>
                                    <div style={{ padding: "6px 0" }}>
                                        {[{ label: "Go to Main Website", icon: "⌂", href: "/" }, { label: "View Services", icon: "◈", href: "/service" }].map(item => (
                                            <button key={item.label} onClick={() => { setProfileOpen(false); window.location.href = item.href; }}
                                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "transparent", border: "none", color: "#CCCCE0", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(78,205,196,0.08)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>{item.icon}</span>
                                                <span>{item.label}</span>
                                            </button>
                                        ))}
                                        <div style={{ height: 1, background: "#1E1F2A", margin: "6px 0" }} />
                                        <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "transparent", border: "none", color: "#FF6B6B", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.08)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>⎋</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}