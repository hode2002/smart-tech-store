'use client';

import AddressCombobox from '@/app/user/account/address/address-combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import accountApiRequest from '@/apiRequests/account';
import { ReloadIcon } from '@radix-ui/react-icons';

import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
    UpdateAddressBodyType,
    UpdateAddressResponseType,
} from '@/schemaValidations/account.schema';
import { setAddress } from '@/lib/store/slices';

type ProvinceResponse = {
    ProvinceID: number;
    ProvinceName: string;
};

type DistrictResponse = {
    DistrictID: number;
    DistrictName: string;
};

type WardResponse = {
    WardCode: number;
    WardName: string;
};

export type AddressOption = {
    id: string;
    value: string;
    label: string;
};

export default function UpdateAddressForm() {
    const token = useAppSelector((state) => state.auth.accessToken);
    const userAddress = useAppSelector((state) => state.user.address);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        accountApiRequest
            .getUserAddress(token)
            .then((response: UpdateAddressResponseType) => {
                const userAddress = response?.data;
                console.log(userAddress);
                dispatch(setAddress(userAddress));
            });

        accountApiRequest
            .getProvinces()
            .then((provinces: ProvinceResponse[]) => {
                const provinceOptions = provinces.map((province) => ({
                    id: String(province.ProvinceID),
                    value: province.ProvinceName,
                    label: province.ProvinceName,
                })) as AddressOption[];
                setProvinceOptions(provinceOptions);
            });
    }, [token, dispatch]);

    const [provinceOptions, setProvinceOptions] = useState<AddressOption[]>([]);
    const [districtOptions, setDistrictOptions] = useState<AddressOption[]>([]);
    const [wardOptions, setWardOptions] = useState<AddressOption[]>([]);

    const [province, setProvince] = useState<AddressOption>();
    const [district, setDistrict] = useState<AddressOption>();
    const [ward, setWard] = useState<AddressOption>();
    const [addressDetail, setAddressDetail] = useState<string>(
        userAddress?.address || '',
    );

    useEffect(() => {
        accountApiRequest
            .getDistricts(province?.id)
            .then((districts: DistrictResponse[]) => {
                const districtOptions = districts.map((district) => ({
                    id: String(district.DistrictID),
                    value: district.DistrictName,
                    label: district.DistrictName,
                })) as AddressOption[];
                setDistrictOptions(districtOptions);
            });
    }, [province?.id]);

    useEffect(() => {
        accountApiRequest
            .getWards(district?.id)
            .then((wards: WardResponse[]) => {
                const wardOptions = wards.map((district) => ({
                    id: String(district.WardCode),
                    value: district.WardName,
                    label: district.WardName,
                })) as AddressOption[];
                setWardOptions(wardOptions);
            });
    }, [district?.id]);

    const onSubmit = async () => {
        if (loading) return;
        const data: UpdateAddressBodyType = {
            address: addressDetail,
            province: province ? province?.label : userAddress?.province,
            district: district ? district?.label : userAddress?.district,
            ward: ward ? ward?.label : userAddress?.ward,
        };
        setLoading(true);
        const response: UpdateAddressResponseType =
            await accountApiRequest.updateAddress(token, data);
        setLoading(false);
        if (response.statusCode === 200) {
            const addressUpdated = response.data;
            dispatch(setAddress(addressUpdated));
            setWard(undefined);
        }
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center p-5">
            <div className="flex flex-col md:flex-row w-full gap-4 justify-between">
                <AddressCombobox
                    title="Tỉnh - Thành phố"
                    items={provinceOptions}
                    value={
                        userAddress?.province
                            ? userAddress?.province
                            : province?.value
                    }
                    setValue={setProvince}
                />
                <AddressCombobox
                    title="Quận - Huyện"
                    items={districtOptions}
                    value={
                        userAddress?.district
                            ? userAddress?.district
                            : district?.value
                    }
                    setValue={setDistrict}
                    isDisabled={!province ? true : false}
                />
                <AddressCombobox
                    title="Phường - Xã"
                    items={wardOptions}
                    value={userAddress?.ward ? userAddress?.ward : ward?.value}
                    setValue={setWard}
                    isDisabled={!district || !province ? true : false}
                />
            </div>
            <div className="w-full my-4">
                <Label htmlFor="address-detail">Địa chỉ cụ thể</Label>
                <Input
                    id="address-detail"
                    type="text"
                    autoComplete="off"
                    className="mt-2"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                />
            </div>

            {loading ? (
                <Button disabled className="w-40">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                </Button>
            ) : (
                <Button
                    onClick={onSubmit}
                    disabled={!ward?.value && !addressDetail.length}
                    className={'w-40'}
                >
                    Lưu
                </Button>
            )}
        </div>
    );
}
