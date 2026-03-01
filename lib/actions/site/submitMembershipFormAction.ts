'use server';

/**
 * Server action to submit membership registration form to Contact Form 7 REST API.
 */
export async function submitMembershipFormAction(
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    try {
        const email = formData.get('email') as string;
        const fullName = formData.get('fullName') as string;
        const dateOfBirth = formData.get('dateOfBirth') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;
        const profession = formData.get('profession') as string;
        const membershipType = formData.get('membershipType') as string;
        const interests = formData.get('interests') as string;
        const additionalInfo = formData.get('additionalInfo') as string;
        const formId = formData.get('formId') as string;

        // Validate required fields
        if (!fullName || !email || !phone) {
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

        // Form fields — matching CF7 field names exactly
        cf7FormData.append('user-email', email);
        cf7FormData.append('full-name', fullName);
        cf7FormData.append('date-of-birth', dateOfBirth || '');
        cf7FormData.append('phone-number', phone);
        cf7FormData.append('address', address || '');
        cf7FormData.append('profession', profession || '');
        cf7FormData.append('membership-type', membershipType || 'Regular membership');

        // CF7 checkboxes: send as array
        if (interests) {
            const interestsList = interests.split(',');
            interestsList.forEach((interest) => {
                cf7FormData.append('interests[]', interest.trim());
            });
        }

        cf7FormData.append('additional-info', additionalInfo || '');

        const response = await fetch(endpoint, {
            method: 'POST',
            body: cf7FormData,
        });

        const result = await response.json();

        // Handle rest_no_route error
        if (result.code === 'rest_no_route') {
            return {
                success: false,
                message: 'خطأ في إعداد نموذج التسجيل. الرجاء التواصل معنا مباشرة.',
            };
        }

        if (result.status === 'mail_sent') {
            return {
                success: true,
                message: result.message || 'تم إرسال طلب العضوية بنجاح!',
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
        console.error('Error submitting membership form:', error);
        return {
            success: false,
            message: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        };
    }
}
