import React from "react";
import Button from "../Button";
import {formatDate} from "@/utils/FormatDate";
import {Notice} from "@/interfaces/notice";
import Link from "next/link";

interface PropsOrderNotice {
    total?: number;
    dataNotice?: Notice[];
}

export default function OrderNotice(props: PropsOrderNotice) {
    const {dataNotice, total} = props;
    console.log({dataNotice, total});
    const latestNotices = dataNotice?.slice(-5);

    return latestNotices?.length !== 0 ?
            <div className="rounded-[10px] bg-white z-40 transition transform absolute min-w-[325px] h-auto shadow-[0px_4px_11px_0px_rgba(0,0,0,0.1)] left-[-149px] pt-4 mt-4">
                <div className="font-medium mb-4 text-[16px] leading-[19.09px] text-text px-4">
                    Notifications
                </div>
                {latestNotices?.map((item) => (
                    <Link
                        href="https://nextui.org/docs/components/date-picker"
                        key={item.id}>
                        <div className="py-[12px] cursor-pointer border-t border-b border-stroke hover:bg-highlight hover:text-primary">
                            <p className="w-full px-4 mb-1 text-[13px] font-medium leading-[18.2px]">
                                {item.content}
                            </p>
                            <p className="text-input text-[12px] font-normal leading-[14.32px] px-4">
                                {formatDate(item.timestamp)}
                            </p>
                        </div>
                    </Link>
                ))}
                {(total ?? 0) > 5 && (
                    <div className="text-center pb-4">
                        <Button
                            size="large"
                            className="text-[14px] font-medium leading-[16.71px] mt-4"
                            target="_blank"
                            url="https://www.youtube.com/watch?v=AJtDXIazrMo&list=PLPSCssPYXhWTTcpNZwYoEQWt8Wc8KO0NV&index=18"
                            variant="link">
                            See all
                        </Button>
                    </div>
                )}
            </div>
        :   null;
}
