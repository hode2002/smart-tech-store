'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Overview } from '@/app/admin/dashboard/components/overview';
import { RecentSales } from '@/app/admin/dashboard/components/recent-sales';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import {
    BadgeDollarSign,
    Home,
    ImagePlus,
    Package,
    Package2,
    Settings,
    ShoppingCart,
    Smartphone,
    Users,
    Users2,
} from 'lucide-react';
import DashboardStatisticCard from '@/app/admin/components/dashboard-statistic-card';
import { formatPrice } from '@/lib/utils';
import { useAppSelector } from '@/lib/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    GetOrderStatusResponseType,
    OrderResponseType,
} from '@/apiRequests/order';
import adminApiRequest, {
    FetchAllUsersResponseType,
    UserResponseType,
} from '@/apiRequests/admin';
import moment from 'moment';
import {
    ProductDetailType,
    ProductPaginationResponseType,
} from '@/schemaValidations/product.schema';
import {
    GetAllProductReviewResponseType,
    ProductReview,
} from '@/apiRequests/product';
import ProductReviewTable from '@/app/admin/dashboard/components/product-review-table';
import { RecentCustomers } from '@/app/admin/dashboard/components/recent-customers';

export default function Dashboard() {
    const token = useAppSelector((state) => state.auth.accessToken);

    const [products, setProducts] = useState<ProductDetailType[] | []>([]);
    const [orders, setOrders] = useState<OrderResponseType[]>([]);
    const [users, setUsers] = useState<UserResponseType[]>([]);
    const [reviews, setReviews] = useState<ProductReview[]>([]);

    const fetchProducts = useCallback(
        async (page: number = 1) => {
            const response = (await adminApiRequest.getAllProducts(
                token,
                page,
                100,
            )) as ProductPaginationResponseType;
            if (response?.statusCode === 200) {
                return setProducts(response.data.products);
            }
            return setProducts([]);
        },
        [token],
    );

    const fetchOrders = useCallback(async () => {
        const response = (await adminApiRequest.getAllOrders(
            token,
        )) as GetOrderStatusResponseType;
        if (response?.statusCode === 200) {
            return setOrders(response.data);
        }
        return setOrders([]);
    }, [token]);

    const fetchUsers = useCallback(async () => {
        const response = (await adminApiRequest.getAllUsers(
            token,
        )) as FetchAllUsersResponseType;
        if (response?.statusCode === 200) {
            return setUsers(response.data.filter((user) => user.is_active));
        }
        return setUsers([]);
    }, [token]);

    const fetchReviews = useCallback(async () => {
        const response = (await adminApiRequest.getAllReviews(
            token,
        )) as GetAllProductReviewResponseType;
        if (response?.statusCode === 200) {
            return setReviews(response.data);
        }
        return setReviews([]);
    }, [token]);

    useEffect(() => {
        fetchOrders().then();
        fetchUsers().then();
        fetchProducts().then();
        fetchReviews().then();
    }, [fetchOrders, fetchUsers, fetchProducts, fetchReviews]);

    const totalRevenue = useMemo(() => {
        let total = 0;
        orders
            .filter(
                (item) =>
                    item.status === 2 &&
                    moment(item.estimate_date).isSame(
                        moment(new Date()),
                        'month',
                    ),
            )
            .map((order) => (total += order.total_amount));
        return total;
    }, [orders]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 py-4">
                    <Link
                        href="#"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Home className="h-5 w-5" />
                                <span className="sr-only">Dashboard</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin/orders"
                                className="flex h-9 w-9 items-center justify-center text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span className="sr-only">Orders</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Orders</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin/products"
                                className="flex h-9 w-9 items-center justify-center text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Package className="h-5 w-5" />
                                <span className="sr-only">Products</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Products</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin/customers"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Users2 className="h-5 w-5" />
                                <span className="sr-only">Customers</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Customers</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin/banners"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <ImagePlus className="h-5 w-5" />
                                <span className="sr-only">Banners</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Banners</TooltipContent>
                    </Tooltip>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
            <div className="flex flex-col">
                <div className="hidden flex-col md:flex">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <div className="flex items-center justify-between space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Dashboard
                            </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <DashboardStatisticCard
                                Icon={BadgeDollarSign}
                                title="Tổng doanh thu"
                                subtitle={formatPrice(totalRevenue)}
                                // description="+10%"
                                description=""
                            />
                            <DashboardStatisticCard
                                Icon={Users}
                                title="Số lượng khách hàng"
                                subtitle={`${users.length}`}
                                description={`+${users.filter((user) => moment(user.created_at).isSame(moment(new Date()), 'month')).length} so với tháng trước`}
                            />
                            <DashboardStatisticCard
                                Icon={ShoppingCart}
                                title="Số đơn hàng"
                                subtitle={`${orders.length}`}
                                description={`+${orders.filter((order) => moment(order.estimate_date).isSame(moment(new Date()), 'month')).length} so với tháng trước`}
                            />
                            <DashboardStatisticCard
                                Icon={Smartphone}
                                title="Số lượng sản phẩm"
                                subtitle={`${products.length}`}
                                description={`+${products.filter((product) => moment(product.created_at).isSame(moment(new Date()), 'month')).length} so với tháng trước`}
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-12">
                                <CardHeader>
                                    <CardTitle>Đơn vị (triệu đồng)</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <Overview orders={orders} />
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Đơn hàng gần đây</CardTitle>
                                    <CardDescription>
                                        Đã bán được{' '}
                                        <span className="font-bold">
                                            {
                                                orders?.filter((order) =>
                                                    moment(
                                                        order.estimate_date,
                                                    ).isSame(
                                                        moment(new Date()),
                                                        'month',
                                                    ),
                                                ).length
                                            }
                                        </span>{' '}
                                        đơn hàng trong tháng này
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentSales orders={orders} />
                                </CardContent>
                            </Card>
                            <Card className="col-span-9">
                                <CardHeader>
                                    <CardTitle>Khách hàng mới</CardTitle>
                                    <CardDescription>
                                        Có thêm{' '}
                                        <span className="font-bold">
                                            {`${users.filter((user) => moment(user.created_at).isSame(moment(new Date()), 'month')).length}`}
                                        </span>{' '}
                                        khách hàng mới trong tháng này
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentCustomers users={users} />
                                </CardContent>
                            </Card>
                            <Card className="col-span-12">
                                <CardHeader>
                                    <CardTitle>
                                        Đánh giá sản phẩm gần đây
                                    </CardTitle>
                                    <CardDescription>
                                        Đã có{' '}
                                        <span className="font-bold">
                                            {reviews.length}
                                        </span>{' '}
                                        đánh giá mới tháng này
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ProductReviewTable
                                        reviews={reviews}
                                        fetchReviews={fetchReviews}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
