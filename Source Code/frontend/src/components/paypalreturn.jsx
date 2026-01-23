import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function PayPalReturn() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const payerId = searchParams.get('PayerID');
        const subscriptionId = searchParams.get('subscription_id');
        const baToken = searchParams.get('ba_token');

        if (window.opener) {
            window.opener.postMessage(
                {
                    type: 'PAYPAL_SUCCESS',
                    token: token,
                    payerId: payerId,
                    subscriptionId: subscriptionId,
                    baToken: baToken
                },
                window.location.origin
            );

            window.close();
        } else {
            document.body.innerHTML = "Payment successful. You can close this window.";
        }
    }, [searchParams]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>Plaćanje uspješno. Zatvaranje prozora...</p>
        </div>
    );
}

export default PayPalReturn;