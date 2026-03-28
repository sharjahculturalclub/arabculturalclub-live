import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, formId } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'الرجاء إدخال البريد الإلكتروني' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, message: 'الرجاء إدخال بريد إلكتروني صحيح' }, { status: 400 });
        }

        const wpApiUrl = process.env.WP_BACKEND_URL;
        if (!wpApiUrl || !formId) {
            return NextResponse.json({ success: false, message: 'حدث خطأ في إعداد الخادم. يرجى المحاولة لاحقاً.' }, { status: 500 });
        }

        const endpoint = `${wpApiUrl}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

        const cf7FormData = new FormData();
        cf7FormData.append('_wpcf7', formId);
        cf7FormData.append('_wpcf7_version', '5.9.8');
        cf7FormData.append('_wpcf7_locale', 'ar');
        cf7FormData.append('_wpcf7_unit_tag', `wpcf7-f${formId}-o1`);
        cf7FormData.append('_wpcf7_container_post', '0');
        cf7FormData.append('subscriber-email', email);

        const response = await fetch(endpoint, { method: 'POST', body: cf7FormData });
        const result = await response.json();

        if (result.status === 'mail_sent') {
            return NextResponse.json({ success: true, message: 'تم الاشتراك في النشرة البريدية بنجاح!' });
        } else if (result.status === 'validation_failed') {
            return NextResponse.json({ success: false, message: result.message || 'يرجى التحقق من البريد الإلكتروني.' });
        } else {
            return NextResponse.json({ success: false, message: result.message || 'حدث خطأ أثناء الاشتراك. حاول مرة أخرى.' });
        }
    } catch {
        return NextResponse.json({ success: false, message: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.' }, { status: 500 });
    }
}
