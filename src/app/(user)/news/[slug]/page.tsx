'use client';

import React, { useEffect, useState } from 'react';
import adminApiRequest, {
    FetchNewsResponseType,
    NewsResponseType,
} from '@/apiRequests/admin';

type Props = {
    params: { slug: string };
};

const News = ({ params }: Props) => {
    const [news, setNews] = useState<NewsResponseType>();

    useEffect(() => {
        (async () => {
            const response = (await adminApiRequest.getNewsBySlug(
                params.slug,
            )) as FetchNewsResponseType;
            if (response?.statusCode === 200) {
                setNews(response.data);
            }
        })();
    }, [params.slug]);
    return (
        news && (
            <div className="md:container">
                <h1 className="text-[45px] font-bold text-[#33333]">
                    {news.title}
                </h1>
                <div
                    className="mt-2 mb-8 flex flex-col justify-center items-center"
                    dangerouslySetInnerHTML={{
                        __html: news.content,
                    }}
                ></div>
            </div>
        )
    );
};

export default News;
