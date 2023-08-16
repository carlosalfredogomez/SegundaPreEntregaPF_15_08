const socket = io(); 
let cartId; 

socket.on("cartId", (receivedCartId) => {
  cartId = receivedCartId;
  console.log(`ID del carrito asignado: ${cartId}`);
});

addToCartButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (!cartId) {
      console.error("ID del carrito no disponible");
      return;
    }

    const productId = button.getAttribute("data-productid");

    const productToCart = {
      cid: cartId,
      pid: productId,
    };

    socket.emit("addProductToCart", productToCart);
  });
});
