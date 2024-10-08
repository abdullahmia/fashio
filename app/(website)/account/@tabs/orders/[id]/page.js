import GenerateInvoice from "@/components/generate-invoice";
import { getOrderById } from "@/services/order/order.service";
import { formatDate } from "@/utils/date";

export default async function OrderDetail({ params: { id } }) {
  const order = await getOrderById(id);
  const billingAddress = order?.user;
  const shippingAddress = order?.shippingAddress;
  return (
    <div>
      <h3 className="text-sm text-secondary">
        Order <span className="bg-[#ff0]">#{order?.id}</span> was placed on{" "}
        <span className="bg-[#ff0]">{formatDate(order?.createdAt)}</span> and is
        currently{" "}
        <span className="bg-[#ff0] capitalize">{order?.orderStatus}</span>.
      </h3>

      <div className="flex items-center justify-between mt-5">
        <h4 className="text-2xl font-bold">Order details</h4>
        <GenerateInvoice order={order} />
      </div>

      {/* Products  */}
      <div className="border w-full text-secondary mt-3">
        {/*  */}
        <div className="py-2 px-2 text-md flex items-center justify-between uppercase">
          <div className="w-full">Product</div>
          <div className="w-full">Total</div>
        </div>

        {/* Products */}
        {order?.products?.map((item) => (
          <div
            key={item?.product?.id}
            className="py-2 text-xs px-2 flex items-center justify-between border-t"
          >
            <div className="w-full">
              {item?.product?.title?.slice(0, 50)} × {item?.quantity}
            </div>
            <div className="w-full">${item?.price * item?.quantity}</div>
          </div>
        ))}

        <div className="py-2 text-sm px-2 flex items-center justify-between border-t">
          <div className="w-full uppercase">Subtotal: </div>
          <div className="w-full">${order?.totalAmount}</div>
        </div>
        <div className="py-2 text-sm px-2 flex items-center justify-between border-t">
          <div className="w-full uppercase">Shipping: </div>
          <div className="w-full">Free shipping</div>
        </div>
        <div className="py-2 text-sm px-2 flex items-center justify-between border-t">
          <div className="w-full uppercase">Payment method: </div>
          <div className="w-full capitalize">{order?.paymentMethod}</div>
        </div>
        <div className="py-2 text-sm px-2 flex items-center justify-between border-t">
          <div className="w-full uppercase">Payment status: </div>
          <div className="w-full capitalize">{order?.paymentStatus}</div>
        </div>
        <div className="py-2 text-sm px-2 flex items-center justify-between border-t">
          <div className="w-full uppercase font-semibold">Total: </div>
          <div className="w-full font-semibold">${order?.totalAmount}</div>
        </div>
      </div>

      {/* Shipping Address */}

      <div className="mt-14 flex items-center gap-12 lg:flex-nowrap flex-wrap">
        <div className="w-full">
          <h2 className="text-2xl text-primary">Billing address</h2>

          <div className="space-y-1 mt-3">
            {/* name */}
            <p className="text-sm text-secondary">{billingAddress?.name}</p>
            <p className="text-sm text-secondary">
              {billingAddress?.address?.street}
            </p>
            <p className="text-sm text-secondary">
              {billingAddress?.address?.city}
            </p>
            {/* <p className="text-sm text-secondary">+8801318214225</p> */}
            <p className="text-sm text-secondary">{billingAddress?.email}</p>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-2xl text-primary">Shipping address</h2>

          <div className="space-y-1 mt-3">
            {/* name */}
            <p className="text-sm text-secondary">{shippingAddress?.name}</p>
            <p className="text-sm text-secondary">{shippingAddress?.streets}</p>
            <p className="text-sm text-secondary">{shippingAddress?.city}</p>
            {/* <p className="text-sm text-secondary">+8801318214225</p> */}
            <p className="text-sm text-secondary">{billingAddress?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
