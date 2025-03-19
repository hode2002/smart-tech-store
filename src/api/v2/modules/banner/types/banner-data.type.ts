export type CreateBannerData = {
    title: string;
    link: string;
    type?: string;
    image: string;
    slug: string;
};

export type UpdateBannerData = Partial<Omit<CreateBannerData, 'title' | 'slug'>> & {
    status?: string;
};
