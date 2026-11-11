/* classic-iife */
(function(){import{r as e}from"../../mobile-controller.js";document.addEventListener(`DOMContentLoaded`,async function(){let t=document.getElementById(`order-summary`),n=JSON.parse(localStorage.getItem(`cart`)),r=0;n&&n.forEach(e=>{let n=e.price*e.quantity;r+=n,t.innerHTML+=`
                                    <div class="d-flex justify-content-between">
                                        <p>${e.name} x ${e.quantity}</p>
                                        <p>$${n.toFixed(2)}</p>
                                    </div>
                                `});let i=r*.1,a=r+i;t.innerHTML+=`
                            <hr>
                            <div class="d-flex justify-content-between">
                                <p>Subtotal</p>
                                <p>$${r.toFixed(2)}</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <p>Tax (10%)</p>
                                <p>$${i.toFixed(2)}</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <h5>Total</h5>
                                <h5>$${a.toFixed(2)}</h5>
                            </div>
                        `;let o=Stripe(e.STRIPE_PUBLIC_KEY);try{let t=await fetch(`${e.API_BASE_URL}/stripe/create-payment-intent`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({cart:n})});if(!t.ok)throw Error(`Failed to fetch payment intent`);let{clientSecret:r}=await t.json(),i=o.elements({clientSecret:r});i.create(`payment`).mount(`#payment-element`),document.getElementById(`payment-form`).addEventListener(`submit`,async e=>{e.preventDefault();let{error:t}=await o.confirmPayment({elements:i,confirmParams:{return_url:window.location.origin+`/app/pages/ecommerce/payment-success.html`}});if(t){let e=document.getElementById(`error-message`);e.textContent=t.message}})}catch(e){console.error(`Stripe Error:`,e),document.getElementById(`error-message`).textContent=`Unable to initialize payment system.`}});})();
