'use server';

/**
 * Server action to submit Newsletter subscription to Contact Form 7 REST API.
 */
export async function submitNewsletterAction(
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    try {
        const email = formData.get('email') as string;
        const formId = formData.get('formId') as string;

        // Validate required fields
        if (!email) {
            return {
                success: false,
                message: 'الرجاء إدخال البريد الإلكتروني',
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

        const cf7FormData = new FormData();

        // Required CF7 fields
        cf7FormData.append('_wpcf7', formId);
        cf7FormData.append('_wpcf7_version', '5.9.8');
        cf7FormData.append('_wpcf7_locale', 'ar');
        cf7FormData.append('_wpcf7_unit_tag', `wpcf7-f${formId}-o1`);
        cf7FormData.append('_wpcf7_container_post', '0');

        // Newsletter form fields
        cf7FormData.append('subscriber-email', email);

        const response = await fetch(endpoint, {
            method: 'POST',
            body: cf7FormData,
        });

        const result = await response.json();

        if (result.code === 'rest_no_route') {
            return {
                success: false,
                message: 'خطأ في إعداد نموذج الاتصال. الرجاء التحقق من معرف النموذج (formid).',
            };
        }

        if (result.status === 'mail_sent') {
            return {
                success: true,
                message: result.message === 'Thank you for your message. It has been sent.' ? 'تم الاشتراك في النشرة البريدية بنجاح!' : (result.message || 'تم الاشتراك في النشرة البريدية بنجاح!'),
            };
        } else if (result.status === 'validation_failed') {
            return {
                success: false,
                message: result.message || 'يرجى التحقق من البريد الإلكتروني المدخل والمحاولة مرة أخرى.',
            };
        } else if (result.status === 'mail_failed') {
            return {
                success: false,
                message: 'فشل الاشتراك في النشرة البريدية. حاول مرة أخرى.',
            };
        } else {
            return {
                success: false,
                message: result.message || 'حدث خطأ أثناء الاشتراك. حاول مرة أخرى.',
            };
        }
    } catch (error) {
        console.error('Error submitting newsletter form:', error);
        return {
            success: false,
            message: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        };
    }
}
