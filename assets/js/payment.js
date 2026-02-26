// =====================================================
// SN DESIGN PAYMENT ENGINE
// =====================================================

const API = "https://sn-design-api.onrender.com";

const box = document.querySelector(".payment-content");
const status = document.querySelector(".payment-status");

// ========================
// CLICK SELECT PAYMENT
// ========================

document.addEventListener("click", async (e)=>{

    // STRIPE
    if(e.target.closest(".pay-stripe")){

        status.innerText = "STATUS: LOADING STRIPE";

        const res = await fetch(API+"/api/stripe/create-checkout",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ amount:100 })
        });

        const data = await res.json();

        window.location.href = data.url;

    }

    // PROMPTPAY
    if(e.target.closest(".pay-promptpay")){

        status.innerText = "STATUS: GENERATING QR";

        const res = await fetch(API+"/api/thai-payment/promptpay",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ amount:100 })
        });

        const data = await res.json();

        box.innerHTML = `
            <img src="${data.qr}" style="width:260px;">
            <p>สแกนเพื่อชำระเงิน</p>
        `;

    }

    // TRUEMONEY
    if(e.target.closest(".pay-truemoney")){

        status.innerText = "STATUS: WALLET MODE";

        box.innerHTML = `
            <p>Redirect Wallet...</p>
        `;

        window.location.href = API+"/api/thai-payment/wallet";

    }

    // CRYPTO
    if(e.target.closest(".pay-crypto")){

        status.innerText = "STATUS: CRYPTO MODE";

        box.innerHTML = `
            <p>Generating crypto address...</p>
        `;

        const res = await fetch(API+"/api/crypto/create");

        const data = await res.json();

        box.innerHTML = `
            <p>Send USDT to:</p>
            <b>${data.address}</b>
        `;
    }

});
