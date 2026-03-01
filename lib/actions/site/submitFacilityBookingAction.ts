'use server';

/**
 * Server action to submit facility booking form to Contact Form 7 REST API.
 */
export async function submitFacilityBookingAction(
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    try {
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const membershipNumber = formData.get('membershipNumber') as string;
        const eventType = formData.get('eventType') as string;
        const requiredHall = formData.get('requiredHall') as string;
        const eventDate = formData.get('eventDate') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;
        const expectedAttendance = formData.get('expectedAttendance') as string;
        const equipment = formData.get('equipment') as string;
        const additionalServices = formData.get('additionalServices') as string;
        const specialRequirements = formData.get('specialRequirements') as string;
        const formId = formData.get('formId') as string;

        // Validate required fields
        if (!fullName || !email || !phone || !eventType || !requiredHall || !eventDate || !startTime || !endTime || !expectedAttendance) {
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
        cf7FormData.append('full-name', fullName);
        cf7FormData.append('user-email', email);
        cf7FormData.append('phone-number', phone);
        cf7FormData.append('membership-number', membershipNumber || '');
        cf7FormData.append('event-type', eventType);
        cf7FormData.append('required-hall', requiredHall);
        cf7FormData.append('event-date', eventDate);
        cf7FormData.append('start-time', startTime);
        cf7FormData.append('end-time', endTime);
        cf7FormData.append('expected-attendance', expectedAttendance);

        // CF7 checkboxes: send as array
        if (equipment) {
            const equipmentList = equipment.split(',');
            equipmentList.forEach((item) => {
                cf7FormData.append('equipment[]', item.trim());
            });
        }

        cf7FormData.append('additional-services', additionalServices || '');
        cf7FormData.append('special-requirements', specialRequirements || '');

        const response = await fetch(endpoint, {
            method: 'POST',
            body: cf7FormData,
        });

        const result = await response.json();

        // Handle rest_no_route error
        if (result.code === 'rest_no_route') {
            return {
                success: false,
                message: 'خطأ في إعداد نموذج الحجز. الرجاء التواصل معنا مباشرة.',
            };
        }

        if (result.status === 'mail_sent') {
            return {
                success: true,
                message: result.message || 'تم إرسال طلب الحجز بنجاح!',
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
        console.error('Error submitting facility booking form:', error);
        return {
            success: false,
            message: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        };
    }
}
