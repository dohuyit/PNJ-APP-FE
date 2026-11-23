'use client';

import {z as zod} from 'zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useBoolean} from 'minimal-shared/hooks';
import {useSearchParams} from "next/navigation";
import {zodResolver} from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import {useRouter} from 'src/routes/hooks';

import {Iconify} from 'src/components/iconify';
import {Form, Field} from 'src/components/hook-form';

import {useAuthContext} from '../../hooks';
import {getErrorMessage} from '../../utils';
import {FormHead} from '../../components/form-head';
// import {signInWithPassword} from '../../context/amplify';
import {signInWithPassword} from '../../context/basic';
// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, {message: 'Vui lòng nhập Email'})
    .email({message: 'Tài khoản phải là 1 Email hợp lệ'}),
  password: zod
    .string()
    .min(1, {message: 'Vui lòng nhập mật khẩu'})
    .min(6, {message: 'Mật khẩu tối thiếu 6 ký tự'}),
});

// ----------------------------------------------------------------------

export function AmplifySignInView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const showPassword = useBoolean();

  const {checkUserSession} = useAuthContext();

  const [errorMessage, setErrorMessage] = useState('');

  const defaultValues = {
    email: 'minhmq5@zenodigital.vn',
    password: 'Zeno@2025',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: {isSubmitting},
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const appId = searchParams.get('app_id')
    const redirectUrl = searchParams.get('redirect_url')
    const signature = searchParams.get('signature')
    try {
      await signInWithPassword({
        email: data.email,
        password: data.password,
        appId,
        redirectUrl,
        signature,
      });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{gap: 3, display: 'flex', flexDirection: 'column'}}>
      <Field.Text name="email" label="Email" placeholder="Nhập email" slotProps={{inputLabel: {shrink: true}}}/>

      <Box sx={{gap: 1.5, display: 'flex', flexDirection: 'column'}}>

        <Field.Text
          name="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: {shrink: true},
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Đăng nhập..."
      >
        Đăng nhập
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Đăng nhập tài khoản"
        sx={{textAlign: {xs: 'center', md: 'left'}}}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{mb: 3}}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
