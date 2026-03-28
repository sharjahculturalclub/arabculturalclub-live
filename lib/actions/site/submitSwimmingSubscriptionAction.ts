'use server';

/**
 * Server action to submit swimming subscription form to Contact Form 7 REST API.
 */
export async function submitSwimmingSubscriptionAction(
    formData: FormData
): Promise<{ success: boolean; message: string; invalidFields?: any[] }> {
    try {
        const wpApiUrl = process.env.WP_BACKEND_URL;
        if (!wpApiUrl) {
            return {
                success: false,
                message: 'حدث خطأ في إعداد الخادم. يرجى المحاولة لاحقاً.',
            };
        }

        const formId = formData.get('formId') as string;
        if (!formId) {
             return {
                success: false,
                message: 'حدث خطأ في إعداد النموذج. يرجى المحاولة لاحقاً.',
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

        // Form fields — matching CF7 shortcodes
        const textFields = [
            'participant_full_name', 'participant_nationality', 'participant_date_of_birth',
            'participant_mobile', 'participant_email', 'participant_emirates_id',
            'membership_type', 'has_family_membership', 'family_membership_number',
            'guardian_full_name', 'guardian_relationship', 'guardian_relationship_other',
            'guardian_mobile', 'guardian_email',
            'has_health_issues', 'health_issue_details',
            'declaration_name',
        ];

        for (const field of textFields) {
            cf7FormData.append(field, (formData.get(field) as string) || '');
        }

        if (formData.get('declaration_accepted')) {
            cf7FormData.append('declaration_accepted', 'on');
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            body: cf7FormData,
        });

        const result = await response.json();

        if (result.code === 'rest_no_route') {
            return {
                success: false,
                message: 'خطأ في إعداد النموذج. الرجاء التواصل معنا مباشرة.',
            };
        }

        if (result.status === 'mail_sent') {
            return {
                success: true,
                message: result.message === 'Thank you for your message. It has been sent.' ? 'تم إرسال رسالتك بنجاح!' : (result.message || 'تم إرسال رسالتك بنجاح!'),
            };
        } else if (result.status === 'validation_failed') {
            return {
                success: false,
                message: result.message || 'يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.',
                invalidFields: result.invalid_fields,
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
        console.error('Error submitting swimming subscription form:', error);
        return {
            success: false,
            message: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        };
    }
}
