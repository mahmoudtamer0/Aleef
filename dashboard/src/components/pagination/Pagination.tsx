import React from "react";
import "./pagination.css";

type Props = {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        onChange(p);
    };

    const buildPages = () => {
        const pages: (number | "...")[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                Math.abs(i - page) <= 1
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">

            <button
                className="pagination__btn pagination__btn--nav"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
            >
                ‹
            </button>

            {buildPages().map((p, idx) =>
                p === "..." ? (
                    <span key={idx} className="pagination__ellipsis">…</span>
                ) : (
                    <button
                        key={p}
                        className={`pagination__btn ${page === p ? "pagination__btn--active" : ""}`}
                        onClick={() => goToPage(p)}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                className="pagination__btn pagination__btn--nav"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
            >
                ›
            </button>

        </div>
    );
}