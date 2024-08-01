import {Tooltip} from "@nextui-org/tooltip";

interface TooltipProps {
    message: React.ReactNode;
    children: React.ReactNode | string;
    placement?: "top" | "bottom" | "left" | "right";
    isCustom?: boolean;
    className?: string;
}
export default function TooltipCustom({
    message,
    children,
    placement = "top",
    isCustom = false,
    className
}: TooltipProps) {
    return isCustom ?
            <Tooltip
                placement={placement}
                className={className}
                content={message}>
                <div className="w-fit h-fit">{children}</div>
            </Tooltip>
        :   <Tooltip
                placement={placement}
                delay={100}
                closeDelay={100}
                className={
                    "bg-black rounded-[2.4px] p-[5px] text-white text-[13px]"
                }
                content={message}>
                <div className="w-fit h-fit"> {children}</div>
            </Tooltip>;
}
