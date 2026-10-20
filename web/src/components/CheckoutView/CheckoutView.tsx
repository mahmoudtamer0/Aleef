"use client";

import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { CartSummary } from "@/components/CartSummary/CartSummary";
import { CheckoutSteps } from "@/components/CheckoutSteps/CheckoutSteps";
import { OrderSuccess } from "@/components/OrderSuccess/OrderSuccess";
import { Photo } from "@/components/Photo/Photo";
import { Step } from "@/components/Step/Step";
import { routes } from "@/config/routes";
import { useCart } from "@/hooks/useCart";
import { useCartTotals, useCreateOrder } from "@/hooks/useProducts";
import { getErrorMessage } from "@/lib/api/client";
import { formatMoney } from "@/lib/format";
import { paymentMethods } from "@/lib/paymentMethods";
import { cx } from "@/lib/utils";
import styles from "./CheckoutView.module.css";

type Field = "address" | "city" | "phone";

export function CheckoutView() {
  const { items, clear } = useCart();
  const totals = useCartTotals(items);
  const order = useCreateOrder();

  const [form, setForm] = useState({ address: "", city: "", phone: "" });
  const [touched, setTouched] = useState<Record<Field, boolean>>({ address: false, city: false, phone: false });
  const [placedId, setPlacedId] = useState<string | null>(null);
  const method = paymentMethods[0];

  const errors: Record<Field, string> = {
    address: form.address.trim().length < 5 ? "Enter your full address." : "",
    city: form.city.trim().length < 2 ? "Enter your city." : "",
    phone: /^\+?[0-9\s-]{8,15}$/.test(form.phone.trim()) ? "" : "Enter a valid phone number.",
  };
  const isValid = !errors.address && !errors.city && !errors.phone;

  function submit() {
    if (!isValid) return setTouched({ address: true, city: true, phone: true }); // show every problem
    order.mutate(
      {
        cart: items.map(({ productId, quantity }) => ({ productId, quantity })),
        shippingAddress: { address: form.address.trim(), city: form.city.trim(), phone: form.phone.trim() },
        paymentMethod: method.value,
      },
      {
        onSuccess: (orderId) => {
          clear(); // the cart is now an order
          setPlacedId(orderId);
        },
      },
    );
  }

  if (placedId !== null) return <OrderSuccess orderId={placedId} />;

  if (items.length === 0) {
    return (
      <div className={`rise ${styles.empty}`}>
        <h1 className={styles.title}>Nothing to check out</h1>
        <p>Your cart is empty.</p>
        <Button href={routes.store}>Browse the store</Button>
      </div>
    );
  }

  const field = (name: Field, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>{label}</label>
      <input
        id={name}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        onBlur={() => setTouched({ ...touched, [name]: true })}
        aria-invalid={touched[name] && !!errors[name]}
        className={cx(styles.input, touched[name] && errors[name] && styles.invalid)}
        {...props}
      />
      {touched[name] && errors[name] && <span role="alert" className={styles.error}>{errors[name]}</span>}
    </div>
  );

  return (
    <>
      <div className={`rise ${styles.head}`}>
        <h1 className={styles.title}>Checkout</h1>
        <CheckoutSteps current={1} />
      </div>

      <div className={styles.layout}>
        <div className={styles.steps}>
          <Step number={1} title="Where should we deliver?" hint="We'll call this number if the courier can't find you.">
            <div className={styles.fields}>
              {field("address", "Street address", { placeholder: "Building, street, area", autoComplete: "street-address" })}
              <div className={styles.two}>
                {field("city", "City", { placeholder: "Cairo", autoComplete: "address-level2" })}
                {field("phone", "Phone number", { placeholder: "01xxxxxxxxx", type: "tel", autoComplete: "tel", inputMode: "tel" })}
              </div>
            </div>
          </Step>

          <Step number={2} title="Payment method">
            <div className={styles.method}>
              <span aria-hidden className={styles.radio} />
              <span>
                <b className={styles.methodLabel}>{method.label}</b>
                <span className={styles.methodHint}>{method.hint}</span>
              </span>
            </div>
          </Step>
        </div>

        <div className={styles.aside}>
          <CartSummary
            totals={totals.data}
            isLoading={totals.isLoading}
            isError={totals.isError}
            updating={totals.updating}
            onRetry={() => totals.refetch()}
            header={
              <div className={styles.items}>
                {items.map((item) => (
                  <div key={item.productId} className={styles.item}>
                    <Photo src={item.image} alt="" glass className={styles.thumb} />
                    <div className={styles.itemText}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemQty}>Qty {item.quantity}</span>
                    </div>
                    <span className={styles.itemTotal}>{formatMoney(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            }
          >
            {order.isError && <p role="alert" className={styles.orderError}>{getErrorMessage(order.error)}</p>}
            <Button variant="white" disabled={!totals.data || totals.updating || order.isPending} onClick={submit}>
              {order.isPending ? "Placing order…" : totals.data ? `Place order · ${formatMoney(totals.data.total)}` : "Place order"}
            </Button>
            <Button href={routes.cart} variant="outlineWhite">Back to cart</Button>
          </CartSummary>
        </div>
      </div>
    </>
  );
}
