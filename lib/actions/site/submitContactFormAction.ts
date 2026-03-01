'use server';

/**
 * Server action to submit contact form data to Contact Form 7 REST API.
 * Adapted from todaymediaprod project.
 */
export async function submitContactFormAction(
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;
        const formId = formData.get('formId') as string;

        // Validate required fields
        if (!name || !email || !subject || !message) {
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

        // CF7 requires multipart/form-data — use FormData and let fetch set the Content-Type with boundary
        const cf7FormData = new FormData();

        // Required CF7 fields
        cf7FormData.append('_wpcf7', formId);
        cf7FormData.append('_wpcf7_version', '5.9.8');
        cf7FormData.append('_wpcf7_locale', 'ar');
        cf7FormData.append('_wpcf7_unit_tag', `wpcf7-f${formId}-o1`);
        cf7FormData.append('_wpcf7_container_post', '0');

        // Form fields
        cf7FormData.append('your-name', name);
        cf7FormData.append('your-email', email);
        cf7FormData.append('topic', subject);
        cf7FormData.append('your-message', message);

        // Do NOT set Content-Type header — fetch auto-sets multipart/form-data with boundary
        const response = await fetch(endpoint, {
            method: 'POST',
            body: cf7FormData,
        });

        const result = await response.json();

        // Handle rest_no_route error (CF7 not available or wrong form ID)
        if (result.code === 'rest_no_route') {
            return {
                success: false,
                message: 'خطأ في إعداد نموذج الاتصال. الرجاء التواصل معنا مباشرة عبر البريد الإلكتروني أو الهاتف.',
            };
        }

        // Handle CF7 response
        if (result.status === 'mail_sent') {
            return {
                success: true,
                message: result.message || 'تم إرسال رسالتك بنجاح!',
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
                message: result.message || 'حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.',
            };
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return {
            success: false,
            message: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        };
    }
}
