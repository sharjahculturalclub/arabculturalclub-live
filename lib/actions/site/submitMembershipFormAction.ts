'use server';

/**
 * Server action to submit membership registration form to Contact Form 7 REST API.
 * Handles extensive fields including file uploads natively through FormData.
 */
export async function submitMembershipFormAction(
    formData: FormData
): Promise<{ success: boolean; message: string; invalidFields?: any[] }> {
    try {
        const formId = formData.get('formId') as string;
        
        // Basic required validation on server
        const email = formData.get('user-email') as string;
        if (!email) {
            return {
                success: false,
                message: 'الرجاء إدخال البريد الإلكتروني',
            };
        }

        const wpApiUrl = process.env.NEXT_PUBLIC_DB_URI;
        if (!wpApiUrl) {
            return {
                success: false,
                message: 'حدث خطأ في إعداد الخادم. يرجى المحاولة لاحقاً.',
            };
        }

        const endpoint = `${wpApiUrl}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

        const cf7FormData = new FormData();
        cf7FormData.append('_wpcf7', formId);
        cf7FormData.append('_wpcf7_version', '5.9.8');
        cf7FormData.append('_wpcf7_locale', 'ar');
        cf7FormData.append('_wpcf7_unit_tag', `wpcf7-f${formId}-o1`);
        cf7FormData.append('_wpcf7_container_post', '0');

        // Forward all fields to CF7. 
        // CF7 checkboxes must be appended with [] in keys.
        const checkboxFields = ['membership_type', 'consent_rules_acknowledged'];

        for (const [key, value] of formData.entries()) {
            if (key !== 'formId') {
                // If it's a known checkbox field, append [] to satisfy CF7 REST API
                if (checkboxFields.includes(key)) {
                    cf7FormData.append(`${key}[]`, value);
                } else {
                    cf7FormData.append(key, value);
                }
            }
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            body: cf7FormData,
        });

        const result = await response.json();

        if (result.code === 'rest_no_route') {
            return {
                success: false,
                message: 'خطأ في إعداد نموذج التسجيل. الرجاء التواصل معنا مباشرة.',
            };
        }

        if (result.status === 'mail_sent') {
            return {
                success: true,
                message: result.message === 'Thank you for your message. It has been sent.' 
                    ? 'تم إرسال طلب العضوية بنجاح!' 
                    : (result.message || 'تم إرسال طلب العضوية بنجاح!'),
            };
        } else if (result.status === 'validation_failed') {
            const invalidFields: Array<{ field: string; message: string }> = result.invalid_fields || [];
            // Build a readable message listing the failing fields
            let message = 'يرجى مراجعة الحقول التالية وتصحيحها:';
            if (invalidFields.length > 0) {
                const fieldNames = invalidFields.map(f => f.field).join('، ');
                message = `يوجد خطأ في الحقول التالية: ${fieldNames}`;
            }
            console.warn('CF7 validation_failed:', invalidFields);
            return {
                success: false,
                message,
                invalidFields,
            };
        } else {
            return {
                success: false,
                message: result.message || 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.',
            };
        }
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error('Error submitting membership form:', errMsg);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development'
                ? `خطأ في الخادم: ${errMsg}`
                : 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        };
    }
}
