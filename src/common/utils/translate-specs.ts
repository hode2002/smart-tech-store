import { technicalSpecs } from '@v1/modules/product/types';

const translation = {
    screen: 'Màn hình',
    screen_size: 'Kích thước màn hình',
    os: 'Hệ điều hành',
    front_camera: 'Camera trước',
    rear_camera: 'Camera sau',
    chip: 'chip',
    ram: 'ram',
    rom: 'Dung lượng lưu trữ',
    sim: 'SIM',
    battery: 'Pin, sạc',
    connection: 'Kết nối',
    weight: 'Cân nặng',
};

export const translateSpecs = (specs: technicalSpecs) => {
    return Object.keys(specs)
        .map(key => {
            return (
                translation[key] && {
                    name: <string>translation[key],
                    value: <string>specs[key],
                }
            );
        })
        .filter(item => item !== null);
};
