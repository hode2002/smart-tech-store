import { View, TextInput, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore, useUserStore } from '@/store';
import {
    UpdateAddressResponseType,
    UpdateAddressBodyType,
} from '@/schemaValidations/account.schema';
import { Button } from '@/components/Button';
import accountApiRequest from '@/lib/apiRequest/account';
import Dropdown from '@/components/CustomDropdown';
import {
    AddressOption,
    DistrictResponse,
    ProvinceResponse,
    WardResponse,
} from '@/types/type';
import { router } from 'expo-router';

const EditAddress = () => {
    const { setAddress, address: userAddress } = useUserStore((state) => state);
    const { accessToken } = useAuthStore((state) => state);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        accountApiRequest
            .getUserAddress(accessToken)
            .then((response: UpdateAddressResponseType) => {
                const userAddress = response?.data;
                setAddress(userAddress);
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
    }, [accessToken, setAddress]);

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
            await accountApiRequest.updateAddress(accessToken, data);
        setLoading(false);
        if (response.statusCode === 200) {
            const addressUpdated = response.data;
            setAddress(addressUpdated);
            setWard(undefined);
            router.back();
        }
    };

    return (
        <View className="h-screen py-10 items-center bg-white">
            <View className="w-11/12 bg-white rounded-lg">
                <View>
                    <Dropdown
                        title="Tỉnh - Thành phố"
                        items={provinceOptions}
                        value={
                            userAddress?.province
                                ? userAddress?.province
                                : province?.value
                        }
                        setValue={setProvince}
                    />
                    <Dropdown
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
                    <Dropdown
                        title="Phường - Xã"
                        items={wardOptions}
                        value={
                            userAddress?.ward ? userAddress?.ward : ward?.value
                        }
                        setValue={setWard}
                        isDisabled={!district || !province ? true : false}
                    />
                    <TextInput
                        inputMode="text"
                        placeholder="Địa chỉ cụ thể"
                        value={addressDetail}
                        onChangeText={setAddressDetail}
                        className="border border-gray-200 rounded-md m-4 px-4 py-2 font-JakartaMedium"
                    />
                    <View>
                        {loading ? (
                            <View className="m-4 mt-12 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        ) : (
                            <Button
                                onPress={onSubmit}
                                label="Lưu"
                                disabled={!ward?.value && !addressDetail.length}
                                labelClasses={`m-4 mt-12 font-JakartaBold text-white px-5 py-3 min-w-[120px] rounded-md ${!ward?.value && !addressDetail.length ? 'bg-[#ccc]' : 'bg-black'}`}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EditAddress;
