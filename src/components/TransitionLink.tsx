"use client";

import { useTransition } from "@/context/TransitionProvider";
import Link from "next/link";
import { ReactNode } from "react";

interface TransitionLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function TransitionLink({
    href,
    children,
    className,
    onClick,
}: TransitionLinkProps) {
    const { startTransition } = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onClick) onClick();
        startTransition(href);
    };

    return (
        <Link href={href} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}
