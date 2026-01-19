import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function PayPalReturn() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const payerId = searchParams.get('PayerID');

        if (window.opener) {
            // Send the data to the main window
            window.opener.postMessage(
                {
                    type: 'PAYPAL_SUCCESS',
                    token: token,
                    payerId: payerId
                },
                window.location.origin
            );

            // Close this popup
            window.close();
        } else {
            // Fallback just in case opened directly
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