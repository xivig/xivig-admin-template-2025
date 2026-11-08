import"../../mobile-controller.js";import"../../main.js";import{t as e}from"../../config.js";document.addEventListener(`DOMContentLoaded`,()=>{let t=document.getElementById(`cart-items-container`),n=document.getElementById(`cart-item-count`),r=document.getElementById(`summary-subtotal`),i=document.getElementById(`summary-tax`),a=document.getElementById(`summary-total`),o=document.getElementById(`empty-cart-btn`),s=[];fetch(`${e.API_BASE_URL}/products`).then(e=>{if(!e.ok)throw Error(`Failed to fetch products`);return e.json()}).then(e=>{s=e.map(e=>({...e,quantity:1})),c()}).catch(e=>{console.warn(`API Error (Cart):`,e.message,`- Falling back to static data.`),s=[{id:1,name:`Premium Dashboard`,price:59,quantity:1,image:`/app/src/images/product-1.jpg`}],c()});function c(){t.innerHTML=``;let e=0;s.forEach(n=>{let r=n.price*n.quantity;e+=r;let i=document.createElement(`div`);i.classList.add(`cart-item`,`d-flex`,`align-items-center`,`justify-content-between`,`p-4`,`mx-2`,`my-2`,`border-bottom`,`border-opacity-10`,`border-light`),i.innerHTML=`
                          <div class="d-flex align-items-center gap-4">
                              <div class="bg-light p-2 rounded-4 border shadow-sm position-relative overflow-hidden" style="width: 100px; height: 100px;">
                                  <img src="${n.image}" alt="${n.name}" class="w-100 h-100 rounded-3" style="object-fit: cover;">
                              </div>
                              <div>
                                  <h6 class="fw-bold text-dark mb-1 fs-5">${n.name}</h6>
                                  <p class="text-muted small mb-0">${n.category}</p>
                              </div>
                          </div>
                          <div class="d-flex align-items-center gap-5">
                              <div class="text-center">
                                  <label class="apple-label mb-2" style="font-size: 0.6rem;">Quantity</label>
                                  <div class="quantity-picker shadow-sm">
                                      <button class="btn-qty decrease-qty" data-id="${n.id}"><i class="bi bi-dash"></i></button>
                                      <input type="text" class="qty-input" value="${n.quantity}" readonly>
                                      <button class="btn-qty increase-qty" data-id="${n.id}"><i class="bi bi-plus"></i></button>
                                  </div>
                              </div>
                              <div class="text-end" style="min-width: 120px;">
                                  <label class="apple-label mb-2" style="font-size: 0.6rem;">Total Price</label>
                                  <h5 class="fw-black text-primary mb-0">$${r.toFixed(2)}</h5>
                              </div>
                              <button class="btn btn-white btn-sm rounded-circle shadow-sm border p-2 text-danger hover-bg-danger hover-text-white transition-all remove-item" data-id="${n.id}">
                                  <i class="bi bi-x-lg"></i>
                              </button>
                          </div>
                        `,t.appendChild(i)}),l(e),u()}function l(e){let t=e*.1,n=e+t;r.textContent=`$`+e.toFixed(2),i.textContent=`$`+t.toFixed(2),a.textContent=`$`+n.toFixed(2)}function u(){n.textContent=`${s.reduce((e,t)=>e+t.quantity,0)} items`}t.addEventListener(`click`,e=>{let t=e.target;if(t.closest(`.increase-qty`)){let e=parseInt(t.closest(`.increase-qty`).dataset.id),n=s.find(t=>t.id===e);n&&(n.quantity++,c())}if(t.closest(`.decrease-qty`)){let e=parseInt(t.closest(`.decrease-qty`).dataset.id),n=s.find(t=>t.id===e);n&&n.quantity>1&&(n.quantity--,c())}if(t.closest(`.remove-item`)){let e=parseInt(t.closest(`.remove-item`).dataset.id);s=s.filter(t=>t.id!==e),c()}}),o.addEventListener(`click`,()=>{s=[],c()}),document.getElementById(`checkout-btn`).addEventListener(`click`,e=>{e.preventDefault(),localStorage.setItem(`cart`,JSON.stringify(s)),window.location.href=`checkout.html`})});