/* classic-iife */
(function(){document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`addProductItem`),t=document.getElementById(`product-items`);e.addEventListener(`click`,()=>{let e=document.createElement(`div`);e.classList.add(`row`,`g-3`,`align-items-center`,`product-item`,`mb-3`),e.innerHTML=`
                                <div class="col-md-5">
                                    <input type="text" class="form-control" placeholder="Product Name">
                                </div>
                                <div class="col-md-2">
                                    <input type="number" class="form-control" placeholder="Qty" value="1">
                                </div>
                                <div class="col-md-3">
                                    <input type="number" class="form-control" placeholder="Price">
                                </div>
                                <div class="col-md-2">
                                    <button type="button" class="btn btn-danger btn-sm remove-product-item w-100">Remove</button>
                                </div>
                            `,t.appendChild(e)}),t.addEventListener(`click`,e=>{e.target.classList.contains(`remove-product-item`)&&e.target.closest(`.product-item`).remove()}),document.getElementById(`editOrderForm`).addEventListener(`submit`,e=>{e.preventDefault(),alert(`Order updated successfully!`)})});})();
