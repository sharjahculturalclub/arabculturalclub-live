'use server';

/**
 * Server action to submit join event form data to Contact Form 7 REST API.
 * Form ID: 434 (Join Event form)
 */
export async function submitJoinEventAction(
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    try {
        const name = formData.get('your-name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const attendees = formData.get('attendees') as string;
        const info = formData.get('info') as string;
        const eventName = formData.get('event_name') as string;
        const eventDate = formData.get('event_date') as string;
        const eventTime = formData.get('event_time') as string;
        const eventLocation = formData.get('event_location') as string;
        const formId = formData.get('formId') as string;

        // Validate required fields
        if (!name || !email || !phone) {
            return {
                success: false,
                message: 'الرجاء ملء جميع الحقول المطلوبة',
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                message: 'الرجاء إدخال بريد إلكتروني صحيح',
            };
        }

        const wpApiUrl = process.env.NEXT_PUBLIC_DB_URI;
        if (!wpApiUrl) {
            console.error('NEXT_PUBLIC_DB_URI is not set');
            return {
                success: false,
                message: 'حدث خطأ في إعداد الخادم. يرجى المحاولة لاحقاً.',
            };
        }

        const endpoint = `${wpApiUrl}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

        // CF7 requires multipart/form-data
        const cf7FormData = new FormData();

        // Required CF7 fields
        cf7FormData.append('_wpcf7', formId);
        cf7FormData.append('_wpcf7_version', '5.9.8');
        cf7FormData.append('_wpcf7_locale', 'ar');
        cf7FormData.append('_wpcf7_unit_tag', `wpcf7-f${formId}-o1`);
        cf7FormData.append('_wpcf7_container_post', '0');

        // Form fields — matching CF7 field names
        cf7FormData.append('your-name', name);
        cf7FormData.append('email', email);
        cf7FormData.append('phone', phone);
        cf7FormData.append('attendees', attendees || '');
        cf7FormData.append('info', info || '');
        cf7FormData.append('event_name', eventName || '');
        cf7FormData.append('event_date', eventDate || '');
        cf7FormData.append('event_time', eventTime || '');
        cf7FormData.append('event_location', eventLocation || '');

        const response = await fetch(endpoint, {
            method: 'POST',
            body: cf7FormData,
        });

        const result = await response.json();

        // Handle rest_no_route error
        if (result.code === 'rest_no_route') {
            return {
                success: false,
                message: 'خطأ في إعداد نموذج التسجيل. الرجاء التواصل معنا مباشرة عبر البريد الإلكتروني أو الهاتف.',
            };
        }

        // Handle CF7 response
        if (result.status === 'mail_sent') {
            return {
                success: true,
                message: result.message === 'Thank you for your message. It has been sent.'
                    ? 'تم تسجيل طلب انضمامك بنجاح! سنتواصل معك قريباً لتأكيد الحجز.'
                    : (result.message || 'تم تسجيل طلب انضمامك بنجاح!'),
            };
        } else if (result.status === 'validation_failed') {
            return {
                success: false,
                message: result.message || 'يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.',
            };
        } else if (result.status === 'mail_failed') {
            return {
                success: false,
                message: 'فشل إرسال البريد الإلكتروني. حاول مرة أخرى.',
            };
        } else {
            return {
                success: false,
                message: result.message || 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.',
            };
        }
    } catch (error) {
        console.error('Error submitting join event form:', error);
        return {
            success: false,
            message: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        };
    }
}
