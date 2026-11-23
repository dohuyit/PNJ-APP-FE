'use client';

import {m} from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {RouterLink} from 'src/routes/components';

import {SimpleLayout} from 'src/layouts/simple';
import {PageNotFoundIllustration} from 'src/assets/illustrations';

import {varBounce, MotionContainer} from 'src/components/animate';

export function NotFoundView({title, message}) {
    return (
        <SimpleLayout
            slotProps={{
                content: {compact: true},
            }}
        >
            <Container component={MotionContainer}>
                <m.div variants={varBounce('in')}>
                    <Typography variant="h3" sx={{mb: 2}}>
                        {title || 'Xin lỗi, trang bạn tìm kiếm không tồn tại!'}
                    </Typography>
                </m.div>

                <m.div variants={varBounce('in')}>
                    <Typography sx={{color: 'text.secondary'}}>
                        {message || 'Chúng tôi không tìm thấy trang bạn đang tìm kiếm. Có lẽ bạn đã nhập sai URL? Hãy kiểm tra lỗi chính tả của bạn.'}
                    </Typography>
                </m.div>

                <m.div variants={varBounce('in')}>
                    <PageNotFoundIllustration sx={{my: {xs: 5, sm: 10}}}/>
                </m.div>

                <Button component={RouterLink} href="/" size="large" variant="contained">
                    Quay về trang chủ
                </Button>
            </Container>
        </SimpleLayout>
    );
}
