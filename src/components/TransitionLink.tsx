"use client";

import { useTransition } from "@/context/TransitionProvider";
import { ReactNode } from "react";

interface TransitionLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
}

export default function TransitionLink({ href, children, className }: TransitionLinkProps) {
    const { navigate } = useTransition();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(href);
    };

    return (
        <a href={href} onClick={handleClick} className={className}>
            {children}
        </a>
    );
}
