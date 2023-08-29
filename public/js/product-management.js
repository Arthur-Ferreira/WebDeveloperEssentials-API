const deleteProductBtnElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
  const btnElement = event.target;
  const productId = btnElement.dataset.productid;
  const csrfToken = btnElement.dataset.csrf

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    method: 'DELETE'
  });

  if(!response.ok) {
    alert('Something went wrong!');
    return;
  }
  btnElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductBtnElement of deleteProductBtnElements) {
  deleteProductBtnElement.addEventListener('click', deleteProduct);
}