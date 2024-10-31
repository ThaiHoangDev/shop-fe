import { FC, useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
// import dynamic from 'next/dynamic';
import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';

import axiosClient from '../../utils/axios';
import Autocomplete from '@mui/material/Autocomplete';

// import { CartItem, useAppContext } from 'contexts/AppContext';
import { Formik } from 'formik';
import Card1 from '../Card1';

import * as Address from '../../utils/__api__/orders';
import { LoadingButton } from '@mui/lab';
import { dispatch, useSelector } from '@/store/store';
import { defaultInfoUser } from '@/store/slices/homeSlice';

// const MapContainerDynamic = dynamic(
//   () => import('../GoogleMap').then((mod) => mod.default),
//   {
//     ssr: false,
//   }
// );

// styled components
// const ContentWrapper = styled(Box)(({ theme }) => ({
//   '& .carousel:hover': {
//     cursor: 'pointer',
//     '& .carousel__back-button': { opacity: 1, left: 10 },
//     '& .carousel__next-button': { opacity: 1, right: 10 },
//   },
//   '& .carousel__next-button, & .carousel__back-button': {
//     opacity: 0,
//     boxShadow: 'none',
//     transition: 'all 0.3s',
//     background: 'transparent',
//     color: theme.palette.primary.main,
//     ':disabled': { color: theme.palette.grey[500] },
//     ':hover': {
//       color: theme.palette.primary.main,
//       backgroundColor: 'transparent',
//     },
//   },
//   '& .carousel__back-button': { left: 0 },
//   '& .carousel__next-button': { right: 0 },
// }));

// =====================================================
type ProductViewDialogProps = {
  openDialog: boolean;
  handleCloseDialog: () => void;
};
// =====================================================

interface FormProps {
  name: string;
  address: string;
  contact: string;
  province: any;
  district: any;
  ward: any;
}
const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const checkoutSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập Tên nhận hàng'),
  contact: yup
    .string()
    .required('Vui lòng nhập Số điện thoại')
    .matches(phoneRegExp, 'Vui lòng nhập đúng định dạng Số điện thoại'),
  address: yup.string().required('Vui lòng nhập địa chỉ cụ thể'),
  province: yup.object().required('Chọn Thành phố/Tỉnh'),
  district: yup.object().required('Chọn Quận/Huyện'),
  ward: yup.object().required('Chọn Phường/Xã'),
});

const AddressFormDialog: FC<ProductViewDialogProps> = (props) => {
  const { openDialog, handleCloseDialog } = props;

  const { infoUser } = useSelector((state) => state.home);

  const INITIAL_VALUES = {
    name: infoUser?.addressResponse?.name ?? '',
    address: infoUser?.addressResponse?.address1 ?? '',
    contact: infoUser?.addressResponse?.phone ?? '',
    province: infoUser?.addressResponse?.province_code ?? '',
    district: infoUser?.addressResponse?.district_code ?? '',
    ward: infoUser?.addressResponse?.ward_code ?? '',
  };

  const [countryList, setCountryList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  const [wardsList, setWardsList] = useState([]);

  const [province_code, setProvinceCode] = useState<any>({});
  const [ward_code, setWardsCode] = useState<any>({});
  const [district_code, setDistrictCode] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const getProvinces = useCallback(async () => {
    try {
      const { provinces } = await Address.default.getProvincesApi();

      const formatData = provinces.reduce(
        (arr: any, obj: any) => [...arr, { label: obj.name, value: obj.code }],
        []
      );

      setCountryList(formatData);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const getDistricts = useCallback(async () => {
    try {
      const { districts } = await Address.default.getDistrictsApi(
        province_code.value
      );

      const formatData = districts.reduce(
        (arr: any, obj: any) => [...arr, { label: obj.name, value: obj.code }],
        []
      );
      setDistrictsList(formatData);
    } catch (error) {}
  }, [province_code]);

  const getWards = useCallback(async () => {
    try {
      const { wards } = await Address.default.getWardsApi(
        province_code.value,
        district_code.value
      );

      const formatData = wards.reduce(
        (arr: any, obj: any) => [...arr, { label: obj.name, value: obj.code }],
        []
      );
      setWardsList(formatData);
    } catch (error) {}
  }, [province_code, district_code]);

  useEffect(() => {
    getProvinces();
  }, [getProvinces]);

  useEffect(() => {
    if (!!province_code) {
      getDistricts();
    }
  }, [getDistricts, province_code]);
  useEffect(() => {
    if (!!province_code && !!district_code) {
      getWards();
    }
  }, [district_code, getWards, province_code]);

  const handleFormSubmit = async (data: FormProps) => {
    setIsLoading(true);
    const payload = {
      user: {
        phone_number: data.contact,
      },
    };

    try {
      const { access_token } = await Address.default.postPhoneApi(payload);
      axiosClient.setHeader(access_token);

      const body = {
        address: {
          name: data.name,
          phone: data.contact,
          address1: data.address,
          province_code: data.province.value,
          district_code: data.district.value,
          ward_code: data.ward.value,
          building_name: '',
          is_default: true,
        },
      };

      const response = await Address.default.postAddressInfoApi(body);

      dispatch(
        defaultInfoUser({
          ...{ addressResponse: response, dataFormSubmit: data },
        })
      );
      handleCloseDialog();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      maxWidth={false}
      onClose={handleCloseDialog}
      title='Thêm địa chỉ'>
      <DialogContent
        sx={{
          width: { md: '40vw', xs: 'auto' },
          height: 'auto',
        }}>
        <Box>
          <Typography
            textAlign={'center'}
            sx={{ color: '#6C903C', fontSize: '20px', fontWeight: 600 }}>
            Thêm địa chỉ
          </Typography>
          <IconButton
            sx={{ position: 'absolute', top: 3, right: 3 }}
            onClick={handleCloseDialog}>
            <Close fontSize='small' color='secondary' />
          </IconButton>
        </Box>
        {/* <Grid container spacing={2} marginTop={0}>
          <Grid item md={6} xs={12}> */}
        <Card1>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={INITIAL_VALUES}
            validationSchema={checkoutSchema}>
            {({
              values,
              errors,
              touched,

              handleChange,
              handleBlur,
              handleSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Box mb={4}>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          name='name'
                          label='Tên người nhận'
                          onBlur={handleBlur}
                          value={values.name}
                          onChange={handleChange}
                          error={!!touched.name && !!errors.name}
                          helperText={(touched.name && errors.name) as string}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label='Số điện thoại'
                          name='contact'
                          onBlur={handleBlur}
                          value={values.contact}
                          onChange={handleChange}
                          error={!!touched.contact && !!errors.contact}
                          helperText={
                            (touched.contact && errors.contact) as string
                          }
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Autocomplete
                          fullWidth
                          options={countryList}
                          // getOptionLabel={(option) => option.label}
                          onChange={(_, value) => {
                            setProvinceCode(value);
                            values.province = value;
                          }}
                          defaultValue={infoUser?.province}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={values.province}
                              size='small'
                              onBlur={handleBlur}
                              name='province'
                              label='Tỉnh/ Thành phố'
                              variant='outlined'
                              // placeholder='Tỉnh/ Thành phố'
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Autocomplete
                          fullWidth
                          options={districtsList}
                          onChange={(_, value) => {
                            setDistrictCode(value);
                            values.district = value;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name='district'
                              value={values.district}
                              onBlur={handleBlur}
                              error={!!touched.district && !!errors.district}
                              helperText={
                                (touched.district && errors.district) as string
                              }
                              size='small'
                              label='Quận/ Huyện'
                              variant='outlined'
                              placeholder='Tỉnh/ Thành phố'
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Autocomplete
                          fullWidth
                          options={wardsList}
                          onChange={(_, value) => {
                            setWardsCode(value);
                            values.ward = value;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              onBlur={handleBlur}
                              label='Phường/ Xã'
                              value={values.ward}
                              onChange={handleChange}
                              helperText={
                                (touched.ward && errors.ward) as string
                              }
                              name='ward'
                              error={!!touched.ward && !!errors.ward}
                              size='small'
                              variant='outlined'
                              placeholder='Phường/ Xã'
                            />
                          )}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label='Địa chỉ cụ thể'
                          name='address'
                          onBlur={handleBlur}
                          value={values.address}
                          onChange={handleChange('address')}
                          error={!!touched.address && !!errors.address}
                          helperText={
                            (touched.address && errors.address) as string
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <LoadingButton
                    fullWidth
                    type='submit'
                    variant='contained'
                    color='primary'
                    loading={isLoading}>
                    Xác nhận
                  </LoadingButton>
                </form>
              );
            }}
          </Formik>
        </Card1>
        {/* </Grid> */}

        {/* <Grid item md={6} xs={12}>
            <MapContainerDynamic />
          </Grid> */}
        {/* </Grid> */}
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormDialog;
