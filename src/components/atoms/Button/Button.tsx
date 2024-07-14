"use client";

import Frame from "@/assets/images/Frame";
import Link from "next/link";
import React, {
    ReactNode,
    ButtonHTMLAttributes,
    AnchorHTMLAttributes
} from "react";

interface PropsBtn {
    variant:
        | "file"
        | "primary-light"
        | "primary-dark"
        | "secondary"
        | "dashed"
        | "link"
        | "text";
    size: "large" | "medium" | "small";
    color?: "blue" | "blue-dark";
    isDisabled: boolean;
    children?: ReactNode;
    prefixIcon?: ReactNode;
    url?: string;
    isError: boolean;
    className: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

Button.defaultProps = {
    variant: "primary-light",
    size: "large",
    isDisabled: false,
    isError: false
};

export default function Button(
    props: PropsBtn &
        ButtonHTMLAttributes<HTMLButtonElement> &
        AnchorHTMLAttributes<HTMLAnchorElement>
) {
    const {
        variant,
        size,
        isDisabled,
        isError,
        prefixIcon,
        url,
        color,
        children,
        className,
        onChange,
        ...rest
    } = props;

    const getVariantClass = (variant: string) => {
        switch (variant) {
            case "primary-light":
                return "bg-secondary text-white hover:bg-secondary-hover ";
            case "primary-dark":
                return "bg-primary-5 text-white hover:bg-primary-5-hover";
            case "secondary":
                return "bg-white border border-stroke hover:bg-highlight hover:border-primary-5-hover hover:text-primary-5-hover text-text";
            case "dashed":
                return "bg-white border border-stroke border-dashed hover:bg-highlight hover:border-primary-5-hover hover:text-primary-5-hover text-text";
            case "link":
                return "bg-transparent text-primary hover:text-primary-5-hover";
            case "text":
                return "bg-transparent text-text hover:bg-white";
            case "file":
            default:
                return "";
        }
    };

    const getErrorClass = (variant: string) => {
        if (isError) {
            switch (variant) {
                case "primary-light":
                case "primary-dark":
                    return "bg-warning hover:bg-warning-hover text-white";
                case "secondary":
                    return "bg-white border border-warning hover:border-warning-hover hover:text-warning-hover text-warning";
                case "dashed":
                    return "bg-white border border-dashed border-warning hover:border-warning-hover hover:text-warning-hover text-warning";
                case "link":
                case "text":
                    return "bg-transparent text-warning hover:text-warning-hover";
                case "file":
                default:
                    return "";
            }
        }
    };

    const getOutline = (color?: string) => {
        if (variant === "secondary" || variant === "dashed") {
            switch (color) {
                case "blue":
                    return "border-secondary hover:border-secondary-hover hover:text-secondary-hover text-secondary";
                case "blue-dark":
                    return "border-primary-5 hover:border-primary-5-hover hover:text-primary-5-hover text-primary-5";
                default:
                    return "";
            }
        }
        return "";
    };

    const getSizeClass = (size: string) => {
        switch (size) {
            case "large":
                return "min-h-[40px]";
            case "medium":
                return "min-h-[32px]";
            case "small":
                return "min-h-[22px]";
            default:
                return "";
        }
    };

    if (variant === "link") {
        const anchorProps = {
            ...rest
        } as AnchorHTMLAttributes<HTMLAnchorElement>;

        return (
            <Link
                {...anchorProps}
                href={url || ""}
                className={`inline-flex justify-center items-center gap-[6px]
                text-[14px] rounded-[3px] px-5 leading-[16.71px] font-medium transition ${className} ${getVariantClass(
                    variant
                )} ${
                    isDisabled
                        ? "text-input cursor-not-allowed pointer-events-none"
                        : ""
                }  ${getErrorClass(variant)}`}
                style={{fontFamily: "inherit"}}>
                <span className="w-4 h-4">{prefixIcon}</span>
                <span>{children}</span>
            </Link>
        );
    }

    if (variant === "file") {
        return (
            <label
                htmlFor="file-input"
                className={`inline-flex justify-center items-center gap-[6px]
              text-[14px] rounded-[3px] px-5 leading-[16.71px] font-medium transition cursor-pointer bg-white text-primary border border-stroke hover:bg-highlight hover:border-primary-5-hover ${className} ${getSizeClass(
                    size
                )}`}>
                <input type="file" id="file-input" hidden onChange={onChange} />
                <span className="w-4 h-4">
                    <Frame />
                </span>
                <span>{children}</span>
            </label>
        );
    }

    return (
        <button
            disabled={isDisabled}
            {...rest}
            className={`flex justify-center items-center gap-[6px]
              text-[14px] rounded-[3px] px-5 leading-[16.71px] font-medium transition disabled:bg-disable disabled:text-input disabled:border disabled:border-stroke disabled:cursor-not-allowed ${className} ${getVariantClass(
                variant
            )} ${getErrorClass(variant)} ${getSizeClass(size)} ${getOutline(
                color
            )}`}
            style={{fontFamily: "inherit"}}>
            <span className="w-4 h-4">{prefixIcon}</span>
            <span>{children}</span>
        </button>
    );
}
