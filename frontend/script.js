document.getElementById('payButton').addEventListener('click', async function () {
    const phone = prompt("Enter your phone number (start with +254):");

    if (!phone || !/^(\+2547\d{8})$/.test(phone)) {
        alert("Invalid phone number! Please try again.");
        return;
    }

    try {
        // Call the backend to initiate payment
        const response = await fetch('http://localhost:3000/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        const result = await response.json();

        if (result.success) {
            alert("Payment successful! Redirecting to predictions...");
            localStorage.setItem("paymentStatus", "paid");
            window.location.href = 'predictions.html';
        } else {
            alert("Payment failed. Try again.");
        }
    } catch (error) {
        console.error("Error during payment:", error);
        alert("An error occurred. Please try again later.");
    }
});
