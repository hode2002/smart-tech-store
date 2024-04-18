import accountApiRequest from '@/apiRequests/account';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
    HistorySearchItem,
    removeHistorySearch,
    removeLocalSearch,
} from '@/lib/store/slices';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react';

type Props = {
    searchList: Array<HistorySearchItem>;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function HeaderSearchList(props: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { searchList, isOpen, setIsOpen } = props;
    const token = useAppSelector((state) => state.auth.accessToken);

    const handleClick = (searchItem: HistorySearchItem) => {
        router.push(
            `/search/${searchItem.search_content.replaceAll(' ', '-').toLowerCase()}`,
        );
    };

    const handleDeleteSearchItem = async (searchItem: HistorySearchItem) => {
        if (token) {
            dispatch(removeHistorySearch(searchItem));
            await accountApiRequest.removeHistorySearch(token, searchItem);
        } else {
            dispatch(removeLocalSearch(searchItem));
        }
    };
    return (
        isOpen && (
            <div
                onMouseDown={() => setIsOpen(false)}
                className={`rounded-md bg-popover z-50 mt-1 absolute w-full min-h-fit shadow-lg`}
            >
                {searchList
                    ?.slice(0, 5)
                    .reverse()
                    .map((searchItem: HistorySearchItem, idx) => (
                        <div
                            key={idx}
                            className="flex text-[14px] md:text-[16px] px-4 py-2 justify-between items-center w-full hover:cursor-pointer hover:bg-popover-foreground hover:text-popover"
                        >
                            <div
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={() => handleClick(searchItem)}
                                className="truncate"
                            >
                                {searchItem.search_content}
                            </div>
                            <p
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={() =>
                                    handleDeleteSearchItem(searchItem)
                                }
                            >
                                <X />
                            </p>
                        </div>
                    ))}
            </div>
        )
    );
}
