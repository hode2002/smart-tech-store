import { UserResponseType } from '@/apiRequests/admin';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import moment from 'moment';
import { useEffect, useState } from 'react';

type Props = {
    users: UserResponseType[];
};
export function RecentCustomers(props: Props) {
    const { users } = props;
    const [userFilter, setUserFilter] = useState<UserResponseType[]>([]);

    useEffect(() => {
        setUserFilter(
            users.filter((user) =>
                moment(user.created_at).isSame(moment(new Date()), 'month'),
            ),
        );
    }, [users]);

    return (
        <div className="space-y-8">
            {userFilter &&
                userFilter.map((user) => {
                    return (
                        <div key={user.email} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar} alt="Avatar" />
                                <AvatarFallback>{user.name}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user.name}
                                </p>
                                <p className="text-sm text-muted-foreground text-truncate me-4">
                                    {user.email}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-nowrap">
                                {moment(user.created_at).format('DD-MM-YYYY')}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
